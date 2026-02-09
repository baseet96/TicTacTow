# System Architecture
## Real-Time Tic-Tac-Toe

### 1. High-Level Architecture

Frontend (React)
    |
WebSocket Connection
    |
Backend (Node.js + WebSocket Server)
    |
In-Memory Room Store

---

### 2. Tech Stack

Frontend:
- React
- Vite
- WebSocket client

Backend:
- Node.js
- Express
- ws (WebSocket library)

Hosting:
- Local or single VPS

---

### 3. Components

#### 3.1 Frontend
Responsibilities:
- UI rendering
- Sending moves
- Receiving updates
- Room creation/join

Key Screens:
- Home (Create/Join)
- Game Board

---

#### 3.2 Backend
Responsibilities:
- WebSocket connections
- Room management
- Game state
- Move validation

---

### 4. Data Model

Room:
{
code: "1234",
players: {
X: socketId,
O: socketId
},
board: ["", "", "", "", "", "", "", "", ""],
currentTurn: "X",
status: "waiting" | "playing" | "finished",
lastActivityAt: "timestamp"
}

Room cleanup:
- Delete room after 5 minutes of inactivity

---

### 5. WebSocket Events

Client → Server:
- create_room
- join_room
- make_move
- restart_game

Server → Client:
- room_created
- room_joined
- move_made
- game_over
- error

---

### 6. Game Flow

1. Player A creates room
2. Server returns room code
3. Player B joins
4. Server starts game
5. Players alternate moves
6. Server detects win/draw
7. Game ends
