const express = require("express");
const { ExpressPeerServer } = require("peer");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

const server = app.listen(port);

const customGenerationFunction = () =>
  (Math.random().toString(36) + "0000000000000000000").substr(2, 16);

const peerServer = ExpressPeerServer(server, {
  proxied: true,
  debug: true,
  path: "/callServer",
  ssl: {},
  generateClientId: customGenerationFunction,
});

app.use(express.json());
app.use(peerServer);

app.use("/js", express.static(path.join(__dirname, "/../client/js")));
app.use("/css", express.static(path.join(__dirname, "/../client/css")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../client") + "/index.html");
});

app.get("/port", (req, res) => {
  res.send({ port: port });
});

peerServer.on("connection", (client) => {
  console.log("Client Connected" + client);
});
