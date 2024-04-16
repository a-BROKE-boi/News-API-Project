const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const endPointsJson = require("./endpoints.json");

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
  res.status(200).send({ msg: endPointsJson });
});

// 404 path not found
app.use((req, res, next) => {
  res.status(404).send({ msg: "Invalid path" });
});

//app.listen(9090, () => console.log("App listening on port 9090!"));

module.exports = app;
