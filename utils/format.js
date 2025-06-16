// utils/format.js

/**
 * Converts an array of chat messages into readable text format.
 * @param {Array} messages - Array of { role: 'user'|'agent', content: string }
 * @returns {string} formatted chat transcript
 */
function formatChatTranscript(messages) {
  return messages
    .map((msg) => {
      const speaker = msg.role === "agent" ? "Agent" : "User";
      return `${speaker}: ${msg.content}`;
    })
    .join("\n");
}

module.exports = {
  formatChatTranscript,
};
