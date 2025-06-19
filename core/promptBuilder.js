const { loadConfig } = require("../config");

function buildPrompt(type, chatLog, metadata = {}) {
  const config = loadConfig(process.env.INDUSTRY || "real-estate");

  const transcript = chatLog
    .map((m) => `${m.role === "agent" ? "Agent" : "User"}: ${m.content}`)
    .join("\n");

  if (type === "classifier") {
    return `
You are a lead qualification assistant in the "${config.industry}" domain.
Classify the lead into:
- Hot (serious, responsive, clear budget + urgency)
- Cold (vague, unsure, passive)
- Invalid (nonsense, spam, unclear)

Your job is to return only a **valid JSON object**, without any explanation, commentary, or formatting outside the JSON block.


== Business Rules ==
${config.rules?.classification || "Use general judgment."}

== Transcript ==
${transcript}

== Metadata ==
${JSON.stringify(metadata, null, 2)}

OUTPUT INSTRUCTIONS:
- Respond ONLY with a JSON object.
- Do NOT add comments, markdown, or any extra text.
- If any field is missing from the chat, return it with an empty string ("").

Respond only with JSON:
{
  "status": "Hot" | "Cold" | "Invalid",
  "reason": "..."
}

Now, return in the same JSON format. Do not add anything else.
    `.trim();
  } else if (type === "extractor") {
    return `
You are an intelligent assistant designed to extract structured metadata from lead conversations.

Your job is to return only a **valid JSON object**, without any explanation, commentary, or formatting outside the JSON block.

== Transcript ==
${transcript}

== Required Metadata ==
${JSON.stringify(config.rules?.metadataFormat, null, 2)}


OUTPUT INSTRUCTIONS:
- Respond ONLY with a JSON object.
- Do NOT add comments, markdown, or any extra text.
- If any field is missing from the chat, return it with an empty string ("").


Example Output:
{
  "location": "Kolkata",
  "propertyType": "Apartment",
  "budget": "50 lakhs",
  "purpose": "Investment",
  "timeline": "3 months"
}


Extract and return only what is present in JSON:
{
  "location": "...",
  "propertyType": "...",
  "budget": "...",
  "purpose": "...",
  "timeline": "...",
  ...
}

Now, return in the same JSON format. Do not add anything else.
    `.trim();
  } else {
    throw new Error(`Unknown prompt type: ${type}`);
  }
}

module.exports = {
  buildPrompt,
};
