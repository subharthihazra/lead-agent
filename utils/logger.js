const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "..", "logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

function getLogFileName(sessionId = "session") {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(LOG_DIR, `${sessionId}-${timestamp}.log`);
}

function logToFile(filename, data) {
  fs.writeFileSync(filename, data, { encoding: "utf-8" });
}

function appendToLog(filename, line) {
  fs.appendFileSync(filename, `${line}\n`, { encoding: "utf-8" });
}

module.exports = {
  getLogFileName,
  logToFile,
  appendToLog,
};
