// cli/chatRunner.js
const readlineSync = require("readline-sync");
const { runChatSession } = require("../core/chatSession");

/**
 * CLI wrapper around reusable chat session
 */
async function runChat(lead, config) {
  return {
    messages: await runChatSession(
      lead,
      config,
      async () => readlineSync.question("User: "),
      (reply) => console.log("Agent: ", reply)
    ),
  };
}

module.exports = {
  runChat,
};
