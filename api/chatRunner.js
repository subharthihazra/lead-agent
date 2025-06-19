const { runChatTurn } = require("../core/chatSession");

async function runChat(lead, config, messages, userMessage) {
  const updatedMessages = [...messages, { role: "user", content: userMessage }];

  const result = await runChatTurn(lead, updatedMessages, config);

  return {
    reply: result.reply,
    exit: result.exit,
    reason: result.reason,
    updatedMessages: [
      ...updatedMessages,
      { role: "agent", content: result.reply },
    ],
  };
}

module.exports = {
  runChat,
};
