require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const routes = require("./route");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", routes);

// console.log("JWT SECRET:", process.env.JWT_SECRET);

// SOCKET AUTH
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("No token provided");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    console.log("Invalid token");
    next(new Error("Authentication error"));
  }
});

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.user.name);

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", {
      userId: socket.user.id,
      userName: socket.user.name,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.name);
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);