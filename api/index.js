require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { runChat } = require("./chatRunner");
const { extractMetadata } = require("../core/extractor");
const { classifyLead } = require("../core/classifier");
const { loadConfig } = require("../config");
const { createSession, getSession } = require("./sessionStore");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/api/session/start", (req, res) => {
  const lead = req.body;
  const config = loadConfig(process.env.INDUSTRY || "real-estate");
  const sessionId = createSession(lead, config);
  return res.json({ sessionId });
});
app.post("/api/session/:sessionId/message", async (req, res) => {
  const { sessionId } = req.params;

  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  if (!req.body || !req.body.message) {
    return res.status(400).json({ error: "Message not found" });
  }
  const { message } = req.body;

  const { lead, config, messages } = session;

  const { reply, messages: updatedMessages } = await runChat(
    lead,
    config,
    messages,
    message
  );

  session.messages = updatedMessages;

  return res.json({ reply });
});

app.get("/api/session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const { messages, config } = session;
  const metadata = await extractMetadata(messages, config);
  const classification = await classifyLead(messages, metadata);

  return res.json({ messages, metadata, classification });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
