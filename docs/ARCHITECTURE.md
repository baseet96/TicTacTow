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
- UI rendering with Material UI components
- WebSocket connection management
- Sending moves and game actions
- Receiving real-time updates
- Room creation/joining
- Game state management

Key Screens:
- Home (Create/Join room)
- Game Board (3x3 grid, player symbols, turn status)

Key Features:
- Reusable Modal component for notifications
- useWebSocket custom hook for connection management
- useCallback optimization for all event handlers
- Environment-based WebSocket URL configuration
- Floating chat widget (expand/collapse)
- Chat message alignment (mine/right, theirs/left)
- Typing indicator UI

Components:
- App.jsx (main state & WebSocket logic)
- HomeScreen (create/join UI)
- GameBoard (game display)
- Modal (reusable dialog)
- ChatWidget (floating icon + panel)
- ChatPanel (messages + input)
- TypingIndicator (inline status)
- useWebSocket hook

---

#### 3.2 Backend
Responsibilities:
- WebSocket connection management
- Room management (create, join, leave, delete)
- Game state validation
- Move validation and processing
- Win/draw detection
- Auto-cleanup of inactive rooms

Architecture:
- server.js - WebSocket server setup and routing
- handlers.js - Message handlers for all events
- roomManager.js - Room lifecycle management
- gameLogic.js - Win/draw detection algorithms

Key Features:
- Map data structure for efficient room storage
- PlayerStates tracking for proper cleanup
- 5-minute inactivity cleanup
- Role swapping on game restart
- Proper opponent notification on leave/disconnect
- In-memory chat history (last 100 messages)
- Rate limiting (5 messages per 10 seconds)

---

### 4. Data Model

Room:
```javascript
{
  code: "1234",
  players: {
    X: WebSocketConnection,
    O: WebSocketConnection
  },
  board: ["", "", "", "", "", "", "", "", ""],
  currentTurn: "X",
  status: "waiting" | "playing" | "finished",
  lastActivityAt: timestamp,
  chatMessages: [
    { id: "uuid", senderId: "connection-id", text: "Hi" }
  ],
  typing: {
    X: false,
    O: false
  }
}
```

PlayerState:
```javascript
{
  playerRoom: "1234",
  playerRole: "X" | "O"
}
```

Room cleanup:
- Inactive rooms deleted after 5 minutes
- Rooms deleted immediately when both players leave

---

### 5. WebSocket Events

Client → Server:
- create_room
- join_room
- make_move
- restart_game
- leave_room
- chat_message
- typing_start
- typing_stop

Server → Client:
- room_created
- room_joined
- game_started
- move_made
- restart_game
- game_over
- opponent_left
- chat_message
- typing_start
- typing_stop
- error

---

### 6. Game Flow

1. Player A creates room
2. Server returns room code
3. Player B joins with code
4. Server starts game for both players
5. Players alternate moves
6. Server detects win/draw
7. Players can restart game (roles swap)
8. If player leaves, opponent sees notification
9. Both can return to home and create/join new rooms
