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

#### 5.6 Real-Time Chat (In-room)
- Players can chat while in a room (during and after game)
- Chat closes when player leaves room
- Floating chat icon expands into a panel
- Supports text + emojis
- Typing indicator shown for opponent
- Keep last 100 messages in memory
- Rate limit: 5 messages per 10 seconds per player

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
| FR9 | Users can send/receive chat messages in real time |
| FR10 | Typing indicator appears for opponent |
| FR11 | Chat limited to last 100 messages in memory |
| FR12 | Rate limit: 5 messages per 10 seconds |
| FR13 | Chat only available while in room |

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
- leave_room: { type: "leave_room", roomCode: "1234" }
- chat_message: { type: "chat_message", roomCode: "1234", text: "Hi" }
- typing_start: { type: "typing_start", roomCode: "1234" }
- typing_stop: { type: "typing_stop", roomCode: "1234" }

Server → Client:
- room_created: { type: "room_created", roomCode: "1234", player: "X" }
- room_joined: { type: "room_joined", roomCode: "1234", player: "O" }
- move_made: { type: "move_made", roomCode: "1234", board: ["X", "", ...], currentTurn: "O" }
- game_over: { type: "game_over", roomCode: "1234", winner: "X" | "O" | "draw" }
- opponent_left: { type: "opponent_left", message: "Opponent left" }
- chat_message: { type: "chat_message", text: "Hi", senderId: "connection-id" }
- typing_start: { type: "typing_start", senderId: "connection-id" }
- typing_stop: { type: "typing_stop", senderId: "connection-id" }
- error: { type: "error", message: "Room not found" }

---

### 9. Success Criteria
- Two players can join same room
- Moves sync instantly
- Game ends correctly
- Restart works
