const express = require("express");
const app = express();
const { getTopics } = require("./controller");

app.get("/api/topics", getTopics);

//app.listen(9090, () => console.log("App listening on port 9090!"));

module.exports = app;
