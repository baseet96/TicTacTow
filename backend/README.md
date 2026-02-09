# Backend - Real-Time Tic-Tac-Toe

WebSocket server for multiplayer Tic-Tac-Toe game.

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

Server runs on `http://localhost:3000`

## Features ✅

### Room System (Epic 1, 2)
- ✅ Generate 4-digit room codes
- ✅ Create room (player X)
- ✅ Join room (player O)
- ✅ Error handling (room not found, full, already in room)
- ✅ 5-minute inactivity cleanup

### Game Logic (Epic 3)
- ✅ Move validation (position, empty cell, correct turn)
- ✅ Win detection (3 rows, 3 cols, 2 diagonals)
- ✅ Draw detection (board full)
- ✅ Real-time move broadcasting

## Architecture

```
server.js          - Setup & WebSocket server
├── gameLogic.js   - Win/draw checking
├── roomManager.js - Room CRUD operations
└── handlers.js    - Message handlers
```

## Testing WebSocket

### Using Web Tool
Visit https://piehost.com/websocket-tester

1. **URL:** `ws://localhost:3000`
2. **Connect** both tabs (Player X and Player O)
3. **Player X:** Send `{"type":"create_room"}`
4. **Player O:** Send `{"type":"join_room","roomCode":"1234"}`
5. **Make moves:** `{"type":"make_move","position":4}`

## API Messages

See [../docs/PRD.md](../docs/PRD.md) for detailed message shapes.

| Type | Direction | Purpose |
|------|-----------|---------|
| create_room | C→S | Start new game |
| join_room | C→S | Join existing room |
| make_move | C→S | Play move at position |
| room_created | S→C | Room created response |
| room_joined | S→C | Join successful |
| game_started | S→C | Both players ready |
| move_made | S→C | Move broadcast |
| game_over | S→C | Game end (winner/draw) |
| error | S→C | Error response |
