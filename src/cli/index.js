const inquirer = require("inquirer");
const { runChat } = require("../core/chatRunner");

async function main() {
  console.log("Welcome to the Lead AI Agent CLI");

  const lead = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Lead Name:",
      validate: (input) => input.trim() !== "" || "Name is required",
    },
    {
      type: "input",
      name: "phone",
      message: "Phone Number (optional):",
    },
    {
      type: "input",
      name: "source",
      message: "Lead Source (e.g., Website, Facebook):",
      default: "Website",
    },
    {
      type: "input",
      name: "message",
      message: "Initial Message (optional):",
    },
  ]);

  console.log("\nStarting chat simulation for lead...");
  await runChat(lead);
}

main();
