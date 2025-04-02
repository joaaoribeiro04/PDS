/* eslint-disable no-undef */
const app = require("express")();

app.get("/", (req, res) => {
  res.status(200).send("Server is running!");
});

module.exports = app;
