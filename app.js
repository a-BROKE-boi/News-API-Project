const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller.js");
const {
  getArticle,
  getAllArticles,
} = require("./controllers/articles-controller.js");
const { getComments } = require("./controllers/comments-controller.js");
const endPointsJson = require("./endpoints.json");

app.get("/api", (req, res, next) => {
  res.status(200).send(endPointsJson);
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getComments);

// 404 path not found
app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid path" });
});

//error handles
app.use((err, req, res, next) => {
  // handle custom errors
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
