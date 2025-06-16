// core/classifier.js
const { createLLM } = require("./llmClient");
const { buildPrompt } = require("./promptBuilder");

/**
 * Classifies lead using LLM based on chat + metadata
 * @param {Array} chatLog
 * @param {Object} metadata
 * @returns {Object} { status, reason }
 */
async function classifyLead(chatLog, metadata = {}) {
  const model = createLLM({ temperature: 0.2 });
  const prompt = buildPrompt("classifier", chatLog, metadata);

  const res = await model.invoke(prompt);

  console.log("clas: ", res);
  try {
    const match = res.content.match(/```json\s*([\s\S]*?)```/i);
    if (!match) throw new Error("No JSON object found in response.");
    return JSON.parse(match[1]);
  } catch (err) {
    console.error("❌ Classification JSON parse failed:", err.message);
    return {
      status: "Invalid",
      reason: "Malformed LLM response",
    };
  }
}

module.exports = {
  classifyLead,
};
