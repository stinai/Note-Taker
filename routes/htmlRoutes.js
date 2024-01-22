const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/assets/notes.html"));
});

router.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/assets/index.html"));
});

module.exports = router;