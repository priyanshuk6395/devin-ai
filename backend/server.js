import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import jwt from "jsonwebtoken";

const server = http.createServer(app);
import { Server } from "socket.io";

import { generateResponse } from "./services/ai.service.js";


const io = new Server(server, {
  cors: {
    origin: process.env.REACT_URL,
  },
});

io.use(async (socket, next) => {
  try {
    // Debugging CORS   
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid projectId"));
    }

    socket.project = await projectModel.findById(projectId);

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Internal server error"));
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  socket.join(socket.roomId);
  socket.on("project-message", async (data) => {
    const message = data.message;
    const AiPresence = message.includes("@ai");
    if (AiPresence) {
      const prompt = message.replace('@ai','');
      const result = await generateResponse(prompt);
      io.to(socket.roomId).emit('project-message',{
        message:result,
        sender:'ai'
      })
      return;
    }
    socket.broadcast.to(socket.roomId).emit("project-message", data);
  });

  socket.on("event", (data) => {
  });

  socket.on("disconnect", () => {
    socket.leave(socket.roomId);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
