// core/extractor.js
const { createLLM } = require("./llmClient");
const { buildPrompt } = require("./promptBuilder");

/**
 * Extracts budget, location, etc. from conversation
 * @param {Array} chatLog
 * @returns {Object}
 */
async function extractMetadata(chatLog) {
  const model = createLLM({ temperature: 0.1 });
  const prompt = buildPrompt("extractor", chatLog);

  const res = await model.invoke(prompt);
  console.log("ex: ", res);
  try {
    const match = res.content.match(/```json\s*([\s\S]*?)```/i);
    if (!match) throw new Error("No JSON object found in response.");
    return JSON.parse(match[1]);
  } catch (err) {
    console.error("Metadata parse failed:", err.message);
    return {};
  }
}

module.exports = {
  extractMetadata,
};
