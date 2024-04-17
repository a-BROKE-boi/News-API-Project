const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const endPointsJson = require("./endpoints.json");

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
  res.status(200).send(endPointsJson);
});

// 404 path not found
app.use((req, res, next) => {
  res.status(404).send({ msg: "Invalid path" });
});

module.exports = app;
