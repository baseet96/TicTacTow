# Epics and User Stories

---

## Epic 1: Backend Setup

### Story 1.1: Initialize backend project
- Setup Node.js project
- Install dependencies

### Story 1.2: Setup WebSocket server
- Create WebSocket endpoint
- Accept client connections

---

## Epic 2: Room System

### Story 2.1: Create room
As a player,  
I want to create a room,  
So that a friend can join.

Acceptance:
- Server generates room code
- Player assigned X

---

### Story 2.2: Join room
As a player,  
I want to join using room code,  
So that I can play.

Acceptance:
- Valid code allows join
- Player assigned O

---

### Story 2.3: Handle invalid room
Acceptance:
- Show error if room not found
- Show error if room full

---

## Epic 3: Game Logic

### Story 3.1: Initialize board
Acceptance:
- Board starts empty
- Turn starts with X

---

### Story 3.2: Make a move
Acceptance:
- Only current player can move
- Cannot overwrite cell
- Board updates for both players

---

### Story 3.3: Detect win/draw
Acceptance:
- Server detects win
- Server detects draw

---

## Epic 4: Frontend UI

### Story 4.1: Project setup
As a developer,
I want to setup React with Vite and Material UI,
So that I can build the frontend.

Acceptance:
- React + Vite initialized
- Material UI installed

---

### Story 4.2: Home screen
As a player,
I want a home screen with Create/Join options,
So that I can start or join a game.

Acceptance:
- Create room button
- Join room input field
- Clean UI with Material UI

---

### Story 4.3: Game board UI
As a player,
I want to see the game board,
So that I can play the game.

Acceptance:
- Render 3x3 grid
- Show player symbols (X/O)
- Display room code and turn status
- Leave game button

---

### Story 4.4: WebSocket integration
As a player,
I want real-time communication with the server,
So that moves sync instantly.

Acceptance:
- Connect to WebSocket server
- Send create_room, join_room, make_move messages
- Receive and handle server updates
- Update board in real-time

---

## Epic 5: Game Controls

### Story 5.1: Restart game
Acceptance:
- Board resets
- Same players continue

---

### Story 5.2: Handle disconnect
Acceptance:
- Show message if player leaves
