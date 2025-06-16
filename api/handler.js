// api/handler.js
const { startConversation } = require("../core/conversation");
const { extractMetadata } = require("../core/extractor");
const { classifyLead } = require("../core/classifier");
const { loadConfig } = require("../config");

async function handleLeadRequest(lead) {
  const config = loadConfig(process.env.INDUSTRY || "real-estate");

  if (!lead.name || !lead.phone || !lead.source) {
    throw new Error("Missing required lead fields");
  }

  const { messages } = await startConversation(lead, config);
  const metadata = await extractMetadata(messages, config);
  const classification = await classifyLead(messages, metadata);

  return {
    lead,
    transcript: messages,
    metadata,
    classification,
  };
}

module.exports = {
  handleLeadRequest,
};
