# Development Plan

## 1. Project Structure

/docs
/frontend
/backend


---

## 2. Backend Setup

Steps:
1. Create backend folder
2. Initialize project

npm init -y

4. Create server.js

---

## 3. Frontend Setup

Steps:
1. Create React app

npm create vite@latest frontend

2. Select React
3. Install dependencies

cd frontend
npm install


---

## 4. Development Order

### Phase 1: Backend Core
1. Setup WebSocket server
2. Room creation logic
3. Room join logic
4. Game state logic

### Phase 2: Frontend Core
5. Basic UI layout
6. WebSocket connection
7. Room create/join screens

### Phase 3: Gameplay
8. Board UI
9. Send moves
10. Receive moves
11. Win/draw logic

### Phase 4: Polish
12. Restart game
13. Error handling
14. Room expiry after 5 minutes of inactivity

---

## 5. Testing (Simple)

1. Create room → verify 4-digit code
2. Join room → game starts
3. Make moves → turn enforcement
4. Win/draw → game ends
5. Inactivity → room expires after 5 minutes

---

## 6. Branch Strategy

For each story:

1. Create branch

git checkout -b feature/<story-name>


2. Implement feature
3. Test locally
4. Commit

git commit -m "feat: <story-name>"


---

## 7. Tracking

Use GitHub Issues:

Columns:
- Backlog
- In Progress
- Done

Each story = one issue.

---

## 8. Daily Workflow

1. Pick next issue
2. Create branch
3. Implement with Copilot
4. Test
5. Commit
6. Close issue
