// cli/index.js
require("dotenv").config();
const readlineSync = require("readline-sync");
const { runChat } = require("./chatRunner");
const { extractMetadata } = require("../core/extractor");
const { classifyLead } = require("../core/classifier");
const { saveOutput } = require("../utils/file");
const { loadConfig } = require("../config");

async function runSession() {
  const config = loadConfig(process.env.INDUSTRY || "real-estate");

  console.log("=== 🧠 Lead Qualification CLI ===");

  const name = readlineSync.question("Lead Name: ", { hideEchoBack: false });
  const phone = readlineSync.question("Phone Number: ", {
    hideEchoBack: false,
  });
  const source = readlineSync.question(
    "Lead Source (e.g., Website, Facebook): ",
    { hideEchoBack: false }
  );
  const initialMessage = readlineSync.question("Initial Message (optional): ", {
    hideEchoBack: false,
  });

  const leadInfo = {
    name,
    phone,
    source,
    message: initialMessage || "",
  };

  console.log("\n📞 Starting AI conversation with lead...\n");

  const { messages } = await runChat(leadInfo, config);
  const metadata = await extractMetadata(messages, config);
  const classification = await classifyLead(messages, metadata);

  const finalOutput = {
    lead: leadInfo,
    transcript: messages,
    metadata,
    classification,
  };

  await saveOutput(finalOutput);

  console.log("\n✅ Conversation complete. Classification:");
  console.log(JSON.stringify(classification, null, 2));
}

runSession();
