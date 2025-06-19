const { loadConfig } = require("../config");

function buildPrompt(type, chatLog, metadata = {}) {
  const config = loadConfig(process.env.INDUSTRY, process.env.LOCATION);

  const transcript = chatLog
    .map((m) => `${m.role === "agent" ? "Agent" : "User"}: ${m.content}`)
    .join("\n");

  if (type === "classifier") {
    return `
You are a lead qualification assistant working in the "${
      config.industry
    }" domain.

Classify the lead into one of the following:
- Hot (serious, responsive, clear budget and urgency)
- Cold (vague, unsure, passive)
- Invalid (spam, irrelevant, unclear)

== Business Rules ==
${config.rules?.classification || "Use general judgment."}

== Transcript ==
${transcript}

== Metadata ==
${JSON.stringify(metadata, null, 2)}

OUTPUT INSTRUCTIONS:
- Respond ONLY with a JSON object.
- Do NOT include comments, markdown, or extra text.
- If any required field is missing, set its value to an empty string ("").

Expected format:
{
  "status": "Hot" | "Cold" | "Invalid",
  "reason": "Your reasoning here"
}

Respond only with the JSON object. Nothing else.
    `.trim();
  }

  if (type === "extractor") {
    return `
You are an intelligent assistant that extracts structured metadata from real estate lead conversations.

== Transcript ==
${transcript}

== Required Metadata ==
${JSON.stringify(config.rules?.metadataFormat, null, 2)}

OUTPUT INSTRUCTIONS:
- Respond ONLY with a JSON object.
- Do NOT include comments, markdown, or extra text.
- If a field is missing, return it with an empty string ("").

Example format:
{
  "location": "Kolkata",
  "propertyType": "Apartment",
  "budget": "50 lakhs",
  "purpose": "Investment",
  "timeline": "3 months"
}

Return only the JSON object with available fields:
{
  "location": "...",
  "propertyType": "...",
  "budget": "...",
  "purpose": "...",
  "timeline": "...",
  ...
}
    `.trim();
  }

  throw new Error(`Unknown prompt type: ${type}`);
}

module.exports = {
  buildPrompt,
};
