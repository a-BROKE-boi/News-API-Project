const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");

app.get("/api/topics", getTopics);

// make 404 path not found

app.use((req, res, next) => {
  res.status(404).send({ msg: "Invalid path" });
});

//app.listen(9090, () => console.log("App listening on port 9090!"));

module.exports = app;
