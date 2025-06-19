// api/sessionStore.js
const { v4: uuidv4 } = require("uuid");

const sessions = {};

function createSession(lead, config, messages) {
  const sessionId = uuidv4();
  sessions[sessionId] = {
    lead,
    config,
    messages,
  };
  return sessionId;
}

function getSession(sessionId) {
  return sessions[sessionId];
}

function getAllSessions() {
  return sessions;
}

function updateSession(sessionId, data) {
  sessions[sessionId] = data;
}

module.exports = { createSession, getSession, getAllSessions, updateSession };
