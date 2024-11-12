const express = require("express");
const app = express();
const socketio = require("socket.io");
const namespaces = require("./data/namespaces");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8080);
const io = socketio(expressServer);

io.on("connection", (socket) => {
  socket.emit("welcome", "Welcome to the server ! ");
  socket.on("Client Connected", (data) => {
    console.log(socket.id, "has connected :)");
  });
  // sending the namespace data which is imported from the namespaces.js file under data folder
  socket.emit("nsList", namespaces);
});
