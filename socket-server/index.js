const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { exec } = require("child_process");
const app = express();
const server = http.createServer(app);
const io = new Server({
  cors: "*",
});
io.attach(server);

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("bash:command", (command) => {
    exec(command, (error, stdin, stderr) => {
      if (stdin) {
        socket.emit("bash:output", stdin);
      } else if (error) {
        socket.emit("bash:output", error);
      }
    });
  });
});

server.listen(8000, () => console.log("Socket Server started on port 8000"));
