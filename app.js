const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller.js");
const { getArticle } = require("./controllers/articles-controller.js");
const endPointsJson = require("./endpoints.json");

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
  res.status(200).send(endPointsJson);
});

app.get("/api/articles/:article_id", getArticle);

app.use((err, req, res, next) => {
  // handle custom errors
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

// 404 path not found
app.use((req, res, next) => {
  res.status(404).send({ msg: "Invalid path" });
});

module.exports = app;
