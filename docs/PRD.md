# Product Requirements Document (PRD)
## Project: Real-Time Tic-Tac-Toe (Multiplayer)

### 1. Overview
A simple, real-time, 2-player Tic-Tac-Toe game playable in the browser.  
Players join using a room code and play live using WebSockets.

### 2. Goals
- Learn system design concepts
- Implement real-time communication
- Build a minimal multiplayer game
- Use React + WebSocket backend

### 3. Non-Goals
- No login or authentication
- No user accounts
- No analytics or tracking
- No AI opponent
- No persistent storage

---

### 4. Target Users
- Casual players
- Friends playing via shared room code
- Developer learning real-time systems

---

### 5. Core Features

#### 5.1 Create Room
- Player clicks “Create Room”
- Server generates a 4-digit room code
- Player becomes Player X

#### 5.2 Join Room
- Player enters room code
- Becomes Player O
- Game starts when two players connected

#### 5.3 Real-Time Gameplay
- 3x3 board
- Players take turns
- Moves update instantly for both players

#### 5.4 Game End
Game ends when:
- Player wins
- Draw occurs

#### 5.5 Restart
- Either player can restart
- Board resets

---

### 6. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR1 | User can create a room |
| FR2 | User can join a room using code |
| FR3 | Server assigns X and O |
| FR4 | Moves sync in real time |
| FR5 | Prevent invalid moves |
| FR6 | Detect win or draw |
| FR7 | Restart game resets board |
| FR8 | Room expires after 5 minutes of inactivity |

---

### 7. Non-Functional Requirements

| Type | Requirement |
|------|-------------|
| Performance | Move latency < 200ms |
| Scalability | Support 20–50 concurrent users |
| Reliability | Game state stored in server memory |
| Simplicity | Minimal UI, no login |

---

### 8. WebSocket Message Shapes (Simple)

Client → Server:
- create_room: { type: "create_room" }
- join_room: { type: "join_room", roomCode: "1234" }
- make_move: { type: "make_move", roomCode: "1234", position: 0 }
- restart_game: { type: "restart_game", roomCode: "1234" }

Server → Client:
- room_created: { type: "room_created", roomCode: "1234", player: "X" }
- room_joined: { type: "room_joined", roomCode: "1234", player: "O" }
- move_made: { type: "move_made", roomCode: "1234", board: ["X", "", ...], currentTurn: "O" }
- game_over: { type: "game_over", roomCode: "1234", winner: "X" | "O" | "draw" }
- error: { type: "error", message: "Room not found" }

---

### 9. Success Criteria
- Two players can join same room
- Moves sync instantly
- Game ends correctly
- Restart works
