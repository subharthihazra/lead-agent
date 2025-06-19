require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { runChat } = require("./chatRunner");
const { extractMetadata } = require("../core/extractor");
const { classifyLead } = require("../core/classifier");
const { loadConfig } = require("../config");
const { saveOutput } = require("../utils/file");
const {
  createSession,
  getSession,
  getAllSessions,
  updateSession,
} = require("./sessionStore");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function generateSessionSummary(sessionId, session) {
  try {
    const { messages, config } = session;
    const metadata = await extractMetadata(messages, config);
    const classification = await classifyLead(messages, metadata);

    const summary = { metadata, classification };
    updateSession(sessionId, { ...session, summary, exited: true });

    const finalOutput = {
      lead: session.lead,
      transcript: session.messages,
      metadata,
      classification,
    };
    saveOutput(finalOutput);

    return session.summary;
  } catch (err) {
    console.log(err);
    return null;
  }
}

app.post("/api/session/start", async (req, res) => {
  const lead = req.body;
  const config = loadConfig(process.env.INDUSTRY || "real-estate");

  console.log(lead);

  try {
    const result = await runChat(
      lead,
      config,
      [],
      lead.message || "Hi, I'm interested in your service."
    );

    const sessionId = createSession(lead, config, result.updatedMessages);

    return res.json({
      sessionId,
      reply: result.reply,
      exit: result.exit,
      reason: result.reason,
    });
  } catch (err) {
    console.error("Failed to start session:", err);
    return res.status(500).json({ error: "Could not start session" });
  }
});

app.post("/api/session/:sessionId/message", async (req, res) => {
  const { sessionId } = req.params;
  const session = getSession(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: "Message not found" });
  }

  const { lead, config, messages } = session;

  try {
    const result = await runChat(lead, config, messages, message);

    session.messages = result.updatedMessages;
    if (result.exit) {
      generateSessionSummary(sessionId, session);
    }
    return res.json({
      reply: result.reply,
      exit: result.exit,
      reason: result.reason,
    });
  } catch (err) {
    console.error("Chat turn failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const { messages, config, exited } = session;

  return res.json({ messages, exited });
});

app.get("/api/session/:sessionId/summary", async (req, res) => {
  const { sessionId } = req.params;
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  if (session.summary) {
    return res.json(session.summary);
  }

  try {
    const summary = await generateSessionSummary(session);
    return res.json(summary);
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate summary" });
  }
});

app.get("/api/sessions", (req, res) => {
  const sessions = getAllSessions();

  const result = Object.entries(sessions).map(([sessionId, session]) => ({
    sessionId,
    lead: session.lead,
    summary: session.summary || null,
  }));

  res.json(result);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
