const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUserByNameAndRoom, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "https://lagalt-frontend-gbg.herokuapp.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    //console.log("name " + name);
    //console.log("room " + room);
    //const user = getUser(socket.id);

    const { error, user, existingUser } = addUser({ id: socket.id, name, room });

    if (error) {
      return callback(error);
    }

    //console.log("USER")
    //console.log(user);

    socket.join(user.room);

    console.log(`User ${user.name} has joined the room ${user.room}.`);

    if (existingUser) {
      socket.emit("message", {
        user: "Admin",
        text: `Welcome back to chatroom ${user.room}, ${user.name}.`,
      });
    } else {
      socket.emit("message", {
        user: "Admin",
        text: `Welcome to chatroom ${user.room}, ${user.name}.`,
      });
    }

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "Admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, dateCreated, name, room, callback) => {
    //const user = getUser(socket.id);
    const user = getUserByNameAndRoom(name, room);

    //console.log("USER")
    //console.log(user);

    //console.log(message);
    //console.log("Send at time " + dateCreated);

    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
      dateCreated,
    });

    callback();
  });

  socket.on("disconnect", () => {
  //socket.on("disconnect", (name, room) => {
    const user = removeUser(socket.id);
    //const user = removeUserByNameAndRoom(name, room);
    //console.log(user)

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
