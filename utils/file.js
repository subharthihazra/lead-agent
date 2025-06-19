const fs = require("fs");
const path = require("path");

function saveOutput(data, dir = "./outputs") {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = path.join(dir, `lead-${timestamp}.json`);

  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");

  console.log(`📝 Output saved to ${filename}`);
}

function loadConfig(industry = "real-estate") {
  const configPath = path.join(__dirname, "..", "config", `${industry}.json`);
  try {
    const content = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error(`Failed to load config for ${industry}:`, err.message);
    return {};
  }
}

module.exports = {
  loadConfig,
  saveOutput,
};
