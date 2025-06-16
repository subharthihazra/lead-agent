// config/index.js
const path = require("path");
const fs = require("fs");

function loadConfig(industry = "real-estate") {
  const filePath = path.resolve(__dirname, "profiles", `${industry}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Config not found for industry: ${industry}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse config: ${err.message}`);
  }
}

module.exports = {
  loadConfig,
};
