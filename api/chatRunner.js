const { runChatSession } = require("../core/chatSession");

/**
 * Runs a chat session step-by-step via API.
 * You call this repeatedly with updated lead and user messages.
 *
 * @param {Object} lead - { name, phone, source, message }
 * @param {Object} config - loaded industry config
 * @param {Array} previousMessages - Array of previous chat messages (from DB or memory)
 * @returns {Object} - { reply, exit, messages }
 */
async function runChat({ lead, config, previousMessages = [] }) {
  let messages = [...previousMessages];

  // Use last message from user if present; otherwise, use initial lead.message
  const lastUserMessage =
    messages.length > 0
      ? messages.filter((m) => m.role === "user").slice(-1)[0]?.content
      : lead.message;

  return new Promise(async (resolve) => {
    const newMessages = await runChatSession(
      lead,
      config,
      async () => lastUserMessage || "Hi, I'm looking for assistance.",
      (reply) => {
        // Handle agent reply (optional hook)
      }
    );

    const latestAgentMessage = newMessages.slice(-1)[0];
    const updatedMessages = [...newMessages];

    resolve({
      messages: updatedMessages,
      reply: latestAgentMessage?.content || "",
      exit: latestAgentMessage?.exit === true || updatedMessages.length >= 50, // backup exit
    });
  });
}

module.exports = {
  runChat,
};
