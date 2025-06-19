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

module.exports = {
  saveOutput,
};
