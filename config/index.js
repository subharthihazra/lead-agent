const path = require("path");
const fs = require("fs");

function loadConfig(industry, location) {
  const filePath = path.resolve(__dirname, "profiles.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file not found at ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let configs;

  try {
    configs = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse config: ${err.message}`);
  }

  const matched = configs.find(
    (c) =>
      c.industry.toLowerCase() === industry.toLowerCase() &&
      c.location.toLowerCase() === location.toLowerCase()
  );

  if (!matched) {
    throw new Error(
      `No matching config found for industry "${industry}" and location "${location}"`
    );
  }

  return matched;
}

module.exports = {
  loadConfig,
};
