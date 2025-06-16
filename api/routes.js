// api/routes.js
const express = require("express");
const router = express.Router();
const { handleLeadRequest } = require("./handler");

router.post("/lead", async (req, res) => {
  try {
    const result = await handleLeadRequest(req.body);
    res.json(result);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
