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

### Phase 1: Backend Core ✅
1. Setup WebSocket server ✅
2. Room creation logic ✅
3. Room join logic ✅
4. Game state logic ✅
5. Move validation ✅
6. Win/draw detection ✅

### Phase 2: Frontend Core ✅
7. Basic UI layout ✅
8. WebSocket connection ✅
9. Room create/join screens ✅
10. Material UI setup ✅

### Phase 3: Gameplay ✅
11. Board UI (3x3 grid) ✅
12. Send moves ✅
13. Receive moves ✅
14. Turn enforcement ✅
15. Real-time updates ✅

### Phase 4: Polish ✅
16. Restart game with role swap ✅
17. Error handling & modals ✅
18. Room expiry (5 min inactivity) ✅
19. Opponent disconnect notification ✅
20. Leave room functionality ✅
21. Code quality improvements ✅

### Phase 5: Real-Time Chat (Planned)
22. Floating chat widget UI
23. Message list + input UI
24. Real-time chat events (send/receive)
25. Typing indicator
26. Rate limiting (5 messages / 10 seconds)
27. Message retention (last 100)
28. Chat state persistence through restart

---

## 5. Testing (Completed)

Test Results:
1. ✅ Create room → 4-digit code generated
2. ✅ Join room → game starts immediately
3. ✅ Make moves → turn enforcement working
4. ✅ Win/draw → correct detection
5. ✅ Inactivity → rooms expire after 5 minutes
6. ✅ Restart game → roles swap correctly
7. ✅ Opponent leaves → notification shown
8. ✅ Leave waiting room → can join different code
9. ⏳ Chat send/receive (real-time)
10. ⏳ Typing indicator
11. ⏳ Rate limit enforcement
12. ⏳ Message retention (last 100)

---

## 6. Technology Stack Final

**Frontend:**
- React 19.2.0 with Vite
- Material UI (@mui/material, @emotion)
- Custom WebSocket hook
- useCallback optimization

**Backend:**
- Node.js with Express
- ws library for WebSocket
- Map for efficient room storage
- Modular architecture (4 files)

**Configuration:**
- Environment variables (VITE_WS_URL)
- Auto-cleanup of inactive rooms
- playerState tracking for cleanup

---

## 7. Known Issues & Solutions

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| Room not found on leave | Using `rooms[code]` instead of `rooms.get(code)` | Updated to Map API |
| Opponent doesn't see leave | Modal dismissed too quickly | Changed to modal.onConfirm |
| Can't leave waiting room | showClose: false on modal | Added Leave button |
| Stale playerSymbol in closure | Missing dependency array | Added all deps to useCallback |
| Duplicate function names | Code merge conflict | Removed duplicate closeModal |

---

## 8. Production Checklist

- [x] All features implemented
- [x] All bugs fixed
- [x] Code quality reviewed
- [x] No hardcoded values
- [x] Environment variables configured
- [x] Backend error handling
- [x] Frontend user feedback
- [x] WebSocket cleanup on disconnect
- [x] Room cleanup on inactivity

---

## 9. Future Enhancements

1. User authentication
2. Persistent game history
3. Statistics (wins/losses)
4. Multiplayer lobbies
5. AI opponent
6. Deployment to cloud


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
