// Message handlers

const roomManager = require("./roomManager");
const { checkWin, checkDraw } = require("./gameLogic");

/**
 * Handle create_room message
 */
function handleCreateRoom(ws, data, playerState) {
  if (playerState.playerRoom) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Already in a room",
      })
    );
    return;
  }

  const roomCode = roomManager.createRoom(ws);
  playerState.playerRoom = roomCode;
  playerState.playerRole = "X";

  ws.send(
    JSON.stringify({
      type: "room_created",
      roomCode: roomCode,
      player: "X",
    })
  );

  console.log(`Room ${roomCode} created`);
}

/**
 * Handle join_room message
 */
function handleJoinRoom(ws, data, playerState) {
  if (playerState.playerRoom) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Already in a room",
      })
    );
    return;
  }

  const roomCode = data.roomCode;

  if (!roomCode || typeof roomCode !== "string") {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Invalid room code format",
      })
    );
    return;
  }

  const result = roomManager.joinRoom(roomCode, ws);

  if (typeof result === "string") {
    // Error message
    ws.send(
      JSON.stringify({
        type: "error",
        message: result,
      })
    );
    return;
  }

  // Success
  const room = result;
  playerState.playerRoom = roomCode;
  playerState.playerRole = "O";

  ws.send(
    JSON.stringify({
      type: "room_joined",
      roomCode: roomCode,
      player: "O",
      board: room.board,
      currentTurn: room.currentTurn,
    })
  );

  room.players.X.send(
    JSON.stringify({
      type: "game_started",
      roomCode: roomCode,
      board: room.board,
      currentTurn: "X",
    })
  );

  console.log(`Player O joined room ${roomCode}`);
}

/**
 * Handle make_move message
 */
function handleMakeMove(ws, data, playerState) {
  const { playerRoom, playerRole } = playerState;

  if (!playerRoom || !roomManager.getRoom(playerRoom)) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Not in a room",
      })
    );
    return;
  }

  const room = roomManager.getRoom(playerRoom);
  const position = data.position;

  // Validate position
  if (typeof position !== "number" || position < 0 || position > 8) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Invalid position",
      })
    );
    return;
  }

  // Check if cell is empty
  if (room.board[position] !== "") {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Cell already occupied",
      })
    );
    return;
  }

  // Check if correct player's turn
  if (room.currentTurn !== playerRole) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Not your turn",
      })
    );
    return;
  }

  // Make the move
  room.board[position] = playerRole;
  room.currentTurn = playerRole === "X" ? "O" : "X";
  roomManager.updateActivity(playerRoom);

  // Check for win
  const isWin = checkWin(room.board, playerRole);

  if (isWin) {
    room.status = "finished";

    const gameOverMessage = JSON.stringify({
      type: "game_over",
      roomCode: playerRoom,
      winner: playerRole,
      board: room.board,
    });

    room.players.X.send(gameOverMessage);
    room.players.O.send(gameOverMessage);

    console.log(`Game over in room ${playerRoom}. Winner: ${playerRole}`);
  } else if (checkDraw(room.board)) {
    room.status = "finished";

    const gameOverMessage = JSON.stringify({
      type: "game_over",
      roomCode: playerRoom,
      winner: "draw",
      board: room.board,
    });

    room.players.X.send(gameOverMessage);
    room.players.O.send(gameOverMessage);

    console.log(`Game over in room ${playerRoom}. Result: Draw`);
  } else {
    const moveMessage = JSON.stringify({
      type: "move_made",
      roomCode: playerRoom,
      position: position,
      player: playerRole,
      board: room.board,
      currentTurn: room.currentTurn,
    });

    room.players.X.send(moveMessage);
    room.players.O.send(moveMessage);

    console.log(
      `Move at position ${position} by ${playerRole} in room ${playerRoom}`
    );
  }
}

/**
 * Route incoming message to correct handler
 */
function handleMessage(ws, message, playerState, playerStates) {
  try {
    const data = JSON.parse(message);
    console.log("Received:", data);

    switch (data.type) {
      case "create_room":
        handleCreateRoom(ws, data, playerState);
        break;
      case "join_room":
        handleJoinRoom(ws, data, playerState);
        break;
      case "make_move":
        handleMakeMove(ws, data, playerState);
        break;
      case "leave_room":
        handleLeaveRoom(ws, data, playerState, playerStates);
        break;
      default:
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Unknown message type",
          })
        );
    }
  } catch (error) {
    console.error("Error processing message:", error);
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Invalid message format",
      })
    );
  }
}

/**
 * Handle leave_room message
 */
function handleLeaveRoom(ws, data, playerState, playerStates) {
  const roomCode = playerState.playerRoom;
  const playerRole = playerState.playerRole;

  if (!roomCode) {
    return;
  }

  // Get the other player before room is deleted
  const otherPlayer = roomManager.leaveRoom(roomCode, playerRole);

  // Notify and clean up the other player
  if (otherPlayer) {
    otherPlayer.send(
      JSON.stringify({
        type: "opponent_left",
        message: "Opponent left the game",
      })
    );
    // Clear their playerState
    const otherPlayerState = playerStates.get(otherPlayer);
    if (otherPlayerState) {
      otherPlayerState.playerRoom = null;
      otherPlayerState.playerRole = null;
    }
  }

  playerState.playerRoom = null;
  playerState.playerRole = null;

  console.log(`Player ${playerRole} left room ${roomCode}`);
}

/**
 * Handle disconnect
 */
function handleDisconnect(playerState, playerStates) {
  const roomCode = playerState.playerRoom;
  const playerRole = playerState.playerRole;

  if (roomCode && playerRole) {
    // Get the other player before room is deleted
    const otherPlayer = roomManager.leaveRoom(roomCode, playerRole);

    // Notify and clean up the other player
    if (otherPlayer) {
      otherPlayer.send(
        JSON.stringify({
          type: "opponent_left",
          message: "Opponent disconnected",
        })
      );
      // Clear their playerState
      const otherPlayerState = playerStates.get(otherPlayer);
      if (otherPlayerState) {
        otherPlayerState.playerRoom = null;
        otherPlayerState.playerRole = null;
      }
    }
  }
}

module.exports = {
  handleMessage,
  handleDisconnect,
};
