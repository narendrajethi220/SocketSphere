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

// io.use((socket, next) => {
//   const jwt = socket.handshake.query.jwt;
//   console.log(jwt);
//   if (1) {
//     next();
//   } else {
//     console.log("GoodBye");
//     socket.disconnect();
//   }
// });

io.on("connection", (socket) => {
  // const username=socket.handshake.query.username;
  // const jwt=socket.handshake.query.jwt;
  socket.emit("welcome", "Welcome to the server ! ");
  // console.log("====================");
  // console.log(socket.handshake);
  socket.on("Client Connected", (data) => {
    console.log(socket.id, "has connected :)");
    // sending the namespace data which is imported from the namespaces.js file under data folder
    socket.emit("nsList", namespaces);
  });
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    // console.log(`${socket.id} has connected to ${namespace.endpoint}`);
    socket.on("joinRoom", async (roomObj, ackCallBack) => {
      //need to fetch the history
      const thisNs = namespaces[roomObj.namespaceId];
      const thisRoomObj = thisNs.rooms.find(
        (room) => room.roomTitle === roomObj.roomTitle
      );
      const thisRoomHistory = thisRoomObj.history;

      // console.log(roomObj);
      //leave all rooms (except own room), because the client can only be in on room
      const rooms = socket.rooms;
      // console.log(rooms);
      let i = 0;
      rooms.forEach((room) => {
        //we do not want to leave the socket's personal room which is guaranteed to be first
        if (i != 0) {
          socket.leave(room);
        }
        i++;
      });

      //join the room
      socket.join(roomObj.roomTitle);

      //fetch the number of socket in this room
      const sockets = await io
        .of(namespace.endpoint)
        .in(roomObj.roomTitle)
        .fetchSockets();

      const socketCount = sockets.length;

      ackCallBack({
        numUsers: socketCount,
        thisRoomHistory,
      });
      //Note- roomtitle is coming from the client, which is not safe.
      //Auth to make sure the socket has right to be that room

      // console.log(roomTitle);
    });
    socket.on("newMessageToRoom", (messageObj) => {
      // console.log(messageObj);
      //braodcast this to all the connected clients... this room only !
      //how can we find out what room This socket is in ?
      const rooms = socket.rooms;
      // console.log(rooms);
      const currentRoom = [...rooms][1]; //this is set not array
      // send out this messageObj to everyone including the sender
      io.of(namespace.endpoint)
        .in(currentRoom)
        .emit("messageToRoom", messageObj);
      //add this message to this room's history

      const thisNs = namespaces[messageObj.selectedNsId];
      // console.log(thisNs);
      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === currentRoom
      );
      // console.log(thisRoom);
      thisRoom.addMessage(messageObj);
    });
  });
});
