// core/chatSession.js
const { createLLM } = require("./llmClient");

/**
 * Runs a chat session between lead and agent using LLM
 * @param {Object} lead - { name, phone, source, message }
 * @param {Object} config - loaded config for industry
 * @param {Function} onUserInput - async function that returns user input string
 * @param {Function} onAgentResponse - function to handle agent response string
 * @returns {Array} messages - full chat history
 */
async function runChatSession(lead, config, onUserInput, onAgentResponse) {
  const agent = createLLM();

  const messages = [
    {
      role: "user",
      content: lead.message || "Hi, I'm looking for assistance.",
    },
  ];

  let counter = 0;

  while (true) {
    const prompt =
      messages
        .map((m) => `${m.role === "agent" ? "Agent" : "User"}: ${m.content}`)
        .join("\n") + "\nAgent:";

    const systemPrompt = `
You are Lead AI Agent, a professional and friendly assistant designed to qualify real estate leads through natural conversation.

Your goal is to understand the lead's requirements clearly and politely, including:
- Preferred location
- Budget
- Property type (e.g., Apartment, Villa, Plot)
- Buying purpose (self-use, investment, etc.)
- Timeline to purchase

Always follow these rules:
- Use a warm and helpful tone
- Ask one question at a time
- Personalize responses using the lead's name or info if available
- Avoid repeating questions already answered
- Guide the conversation smoothly towards gathering the required info
- Politely conclude when the user says 'bye' or stops engaging

Your job is to:
1. Continue the conversation with the lead by replying appropriately.
2. Decide if the conversation is complete based on the user's last message.

== Lead Details ==
Name: ${lead.name}
Phone: ${lead.phone}
Source: ${lead.source}
Initial Message: ${lead.message || "N/A"}


== Chat History ==
${prompt}

OUTPUT INSTRUCTIONS:
- Respond ONLY with a JSON object.
- Do NOT add comments, markdown, or any extra text.

Follow this output format only (in JSON):
{
  "reply": "Your reply message to the lead.",
  "exit": true | false, // true if the conversation is done (e.g., lead says bye, shows disinterest, or all info is collected)
  "reason": "Brief explanation why you marked 'exit' as true or false"
}

Now, return in the same JSON format. Do not add anything else.
`.trim();

    const res = await agent.invoke(systemPrompt);
    console.log(res);
    const text = res.content.trim();

    const match = text.match(/```json\s*([\s\S]*?)```/i);
    if (!match) throw new Error("No valid JSON block found");

    const reply = JSON.parse(match[1]);
    messages.push({ role: "agent", content: reply.reply });
    onAgentResponse?.(reply.reply);

    const userInput = await onUserInput();
    if (reply.exit == true || counter == 50) break;

    messages.push({ role: "user", content: userInput });
  }

  counter++;
  return messages;
}

module.exports = {
  runChatSession,
};
