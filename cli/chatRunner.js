const readlineSync = require("readline-sync");
const { runChatTurn } = require("../core/chatSession");

async function runChat(lead, config) {
  let messages = [
    {
      role: "user",
      content: lead.message || "Hi, I'm looking for assistance.",
    },
  ];

  while (true) {
    const result = await runChatTurn(lead, messages, config);

    console.log("Agent:", result.reply);

    if (result.exit) {
      console.log("Conversation ended. Reason:", result.reason);
      break;
    }

    const userInput = readlineSync.question("User: ");
    if (!userInput.trim()) {
      console.log("No input received. Ending session.");
      break;
    }

    messages = [
      ...result.updatedMessages,
      { role: "user", content: userInput },
    ];
  }

  return { messages };
}

module.exports = {
  runChat,
};
