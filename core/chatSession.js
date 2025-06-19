const { createLLM } = require("./llmClient");

async function runChatTurn(lead, messages, config) {
  if (!lead || !lead.name || !lead.phone || !lead.source) {
    throw new Error("Invalid lead data provided");
  }
  if (!Array.isArray(messages)) {
    throw new Error("Messages must be an array");
  }

  const agent = createLLM();

  const formattedChat = messages
    .map((m) => `${m.role === "agent" ? "Agent" : "User"}: ${m.content}`)
    .join("\n");

  const systemPrompt = `
You are Lead AI Agent, a professional and friendly assistant designed to qualify leads in the "${
    config.industry
  }" domain. You operate from "${config.location}".

Your job is to carry a natural, polite conversation to understand the lead's needs and gather essential information.

Here are the key qualifying questions you should aim to get answered:
${config.qualifyingQuestions.map((q, i) => `- ${q}`).join("\n")}

AAlways follow these rules:
- Use a warm and helpful tone
- Ask one question at a time
- Personalize responses using the lead's name or info if available
- Avoid repeating questions already answered
- Do not restate information the lead has already provided unless necessary for clarity
- Guide the conversation smoothly toward gathering the needed info
- Aim to cover the qualifying questions, but you are not limited to only asking them
- Ask follow-up questions when helpful for clarity, interest, or context
- After collecting the required info, check if the lead has any questions or needs more help
- Do not assume the lead wants to end the conversation unless they clearly indicate so or stop engaging for multiple turns
- Politely conclude only when it's reasonably clear the conversation is over

Your responsibilities:
1. Continue the conversation with the lead by replying appropriately.
2. Decide if the conversation is complete based on the user's last message.

== Lead Details ==
Name: ${lead.name}
Phone: ${lead.phone}
Source: ${lead.source}
Initial Message: ${lead.message || "N/A"}

== Chat History ==
${formattedChat}

OUTPUT INSTRUCTIONS:
- Respond ONLY with a JSON object.
- Do NOT add comments, markdown, or any extra text.

Follow this output format only (in JSON):
{
  "reply": "Your reply message to the lead.",
  "exit": true | false,
  "reason": "Explanation for 'exit' status"
}
`.trim();

  const res = await agent.invoke(systemPrompt);
  const raw = res.content.trim();

  const match = raw.match(/```json\s*([\s\S]*?)```/i);
  if (!match || !match[1]) {
    throw new Error("No valid JSON block found in LLM response");
  }

  let parsed;
  try {
    parsed = JSON.parse(match[1]);
  } catch (err) {
    throw new Error("Failed to parse JSON response from LLM");
  }

  if (
    typeof parsed.reply !== "string" ||
    typeof parsed.exit !== "boolean" ||
    typeof parsed.reason !== "string"
  ) {
    throw new Error("Parsed JSON missing required fields or invalid types");
  }

  const updatedMessages = [
    ...messages,
    { role: "agent", content: parsed.reply },
  ];

  return {
    reply: parsed.reply,
    exit: parsed.exit,
    reason: parsed.reason,
    updatedMessages,
  };
}

module.exports = {
  runChatTurn,
};
