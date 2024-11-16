const express = require("express");
const app = express();
const socketio = require("socket.io");
const Room = require("./classes/Room");
const namespaces = require("./data/namespaces");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8080);
const io = socketio(expressServer);

app.set("io", io);

app.get("/change-ns", (req, res) => {
  // updating namespace array
  namespaces[0].addRoom(new Room(0, "Deleted Articles", 0));
  //let everyone know in this namespace , that is changed
  const io = app.get("io");
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);
  res.json(namespaces[0]);
});

io.on("connection", (socket) => {
  socket.emit("welcome", "Welcome to the server ! ");
  socket.on("Client Connected", (data) => {
    console.log(socket.id, "has connected :)");
    // sending the namespace data which is imported from the namespaces.js file under data folder
    socket.emit("nsList", namespaces);
  });
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    console.log(`${socket.id} has connected to ${namespace.endpoint}`);
  });
});
