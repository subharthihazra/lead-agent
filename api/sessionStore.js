// api/sessionStore.js
const { v4: uuidv4 } = require("uuid");

const sessions = {};

function createSession(lead, config) {
  const sessionId = uuidv4();
  sessions[sessionId] = {
    lead,
    config,
    messages: [
      {
        role: "user",
        content: lead?.message || "Hi, I'm looking for assistance.",
      },
    ],
  };
  return sessionId;
}

function getSession(sessionId) {
  return sessions[sessionId];
}

function addMessage(sessionId, role, content) {
  sessions[sessionId]?.messages.push({ role, content });
}

module.exports = { createSession, getSession, addMessage };
