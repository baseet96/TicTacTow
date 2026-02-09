// Room management

const rooms = {};

/**
 * Generate 4-digit room code
 * @returns {string}
 */
function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Create a new room
 * @param {WebSocket} playerX - Player X's connection
 * @returns {string} - Room code
 */
function createRoom(playerX) {
  let roomCode;
  do {
    roomCode = generateRoomCode();
  } while (rooms[roomCode]);

  rooms[roomCode] = {
    code: roomCode,
    players: {
      X: playerX,
      O: null,
    },
    board: ["", "", "", "", "", "", "", "", ""],
    currentTurn: "X",
    status: "waiting",
    lastActivityAt: Date.now(),
  };

  return roomCode;
}

/**
 * Get room by code
 * @param {string} roomCode
 * @returns {object|null}
 */
function getRoom(roomCode) {
  return rooms[roomCode] || null;
}

/**
 * Join a room
 * @param {string} roomCode
 * @param {WebSocket} playerO - Player O's connection
 * @returns {object|string} - Room object or error message
 */
function joinRoom(roomCode, playerO) {
  const room = getRoom(roomCode);

  if (!room) {
    return "Room not found";
  }

  if (room.players.O !== null) {
    return "Room is full";
  }

  room.players.O = playerO;
  room.status = "playing";
  room.lastActivityAt = Date.now();

  return room;
}

/**
 * Update room activity timestamp
 * @param {string} roomCode
 */
function updateActivity(roomCode) {
  if (rooms[roomCode]) {
    rooms[roomCode].lastActivityAt = Date.now();
  }
}

/**
 * Delete room
 * @param {string} roomCode
 */
function deleteRoom(roomCode) {
  delete rooms[roomCode];
}

/**
 * Leave a room
 * @param {string} roomCode
 * @param {string} playerRole - 'X' or 'O'
 * @returns {WebSocket|null} - The other player's socket connection if still in room
 */
function leaveRoom(roomCode, playerRole) {
  const room = rooms[roomCode];

  if (!room) {
    return null;
  }

  // Get the other player before we delete
  let otherPlayer = null;
  if (playerRole === 'X' && room.players.O) {
    otherPlayer = room.players.O;
  } else if (playerRole === 'O' && room.players.X) {
    otherPlayer = room.players.X;
  }

  // Delete room immediately when any player leaves
  deleteRoom(roomCode);

  return otherPlayer;
}

/**
 * Start cleanup interval for inactive rooms
 * @param {number} expiryMs - Milliseconds (default 5 min)
 */
function startCleanup(expiryMs = 5 * 60 * 1000) {
  setInterval(() => {
    const now = Date.now();
    for (const code in rooms) {
      if (now - rooms[code].lastActivityAt > expiryMs) {
        console.log(`Room ${code} expired due to inactivity`);
        deleteRoom(code);
      }
    }
  }, 60 * 1000); // Check every minute
}

module.exports = {
  rooms,
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  updateActivity,
  deleteRoom,
  startCleanup,
};
