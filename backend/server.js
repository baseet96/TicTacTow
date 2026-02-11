const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const roomManager = require("./roomManager");
const { handleMessage, handleDisconnect } = require("./handlers");

// Track WebSocket connections to player states
const playerStates = new Map();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Start room cleanup (5 min inactivity)
roomManager.startCleanup();

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Store player state for this connection
  const playerState = {
    playerRoom: null,
    playerRole: null,
  };

  // Track this connection
  playerStates.set(ws, playerState);

  // Handle incoming messages
  ws.on("message", (message) => {
    handleMessage(ws, message, playerState, playerStates);
  });

  // Handle client disconnect
  ws.on("close", () => {
    console.log("Client disconnected");
    handleDisconnect(playerState, playerStates);
    playerStates.delete(ws);
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Basic HTTP route
app.get("/", (req, res) => {
  res.send("WebSocket server running");
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
