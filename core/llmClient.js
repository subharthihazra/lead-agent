// core/llmClient.js
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

/**
 * Returns a new Gemini LLM client
 * @param {Object} [options]
 * @returns {ChatGoogleGenerativeAI}
 */
function createLLM(options = {}) {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: options.temperature ?? 0.3,
    ...options,
  });

  return model;
}

module.exports = {
  createLLM,
};
