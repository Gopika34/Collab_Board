# CollabBoard

> **Real-time collaborative task management — built with the MERN stack + Socket.IO**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat&logo=vercel)](https://collabboard.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://collabboard-api.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## What makes this different from a tutorial project

| Feature | What it shows interviewers |
|---|---|
| **Socket.IO real-time sync** | Two browser windows, one board — drag a card in Browser A and it moves instantly in Browser B |
| **Zod validation** | Every endpoint has typed schemas; invalid input gets a `400` with per-field errors before hitting business logic |
| **Structured HTTP errors** | 400 / 401 / 403 / 404 / 409 / 500 — all intentional, all meaningful |
| **DnD-kit drag-and-drop** | Cross-list card moves persisted to DB, broadcast over WebSocket to all collaborators |
| **JWT auth + ownership middleware** | Board-level membership enforced at every route; Socket.IO room join also verifies the JWT |
| **Centralized error handling** | Global Express error handler prevents leaking stack traces; logs include timestamp + route |

---

## Architecture

```
Browser A                Browser B
   │                        │
   │  REST + WebSocket       │  REST + WebSocket
   ▼                        ▼
Express.js + Socket.IO Server
          │
          ▼
       MongoDB
```

When a user creates, edits, moves, or deletes a card/list, the controller:
1. Writes the change to MongoDB
2. Calls `emitToBoard(boardId, event, payload)` → broadcasts to all sockets in that board room

Every other connected browser receives the event and applies the state diff locally — no polling, no page reload.

---

## Tech Stack

### Backend
- **Node.js** + **Express.js** (v5)
- **Socket.IO** v4 — real-time bidirectional communication
- **MongoDB** + **Mongoose** — data persistence
- **Zod** — runtime schema validation
- **bcryptjs** + **jsonwebtoken** — auth
- **express-rate-limit** — brute-force protection

### Frontend
- **React** 19 + **Vite** 8
- **Socket.IO Client** — real-time event listeners
- **@dnd-kit/react** — accessible drag-and-drop
- **Tailwind CSS** v4
- **Axios** with interceptors for auth + 401 auto-logout

---

## Features

- [x] JWT authentication (signup / login / auto-logout on 401)
- [x] Create, rename, and delete boards
- [x] Drag-and-drop cards within and across lists (persisted to DB)
- [x] **Real-time sync** — all changes broadcast to collaborators instantly
- [x] **Zod validation** on every mutating endpoint
- [x] Structured HTTP error codes (400 / 401 / 403 / 404 / 409 / 500)
- [x] Board membership — only members can view/edit a board
- [x] Rate limiting on auth endpoints
- [ ] RBAC — owner / editor / viewer roles *(Phase 2)*
- [ ] Search & filters *(Phase 2)*
- [ ] Optimistic UI + conflict handling *(Phase 2)*

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### Clone & install

```bash
git clone https://github.com/Gopika34/Collab_Board.git
cd Collab_Board
```

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd frontend
npm install
```

### Environment variables

**`backend/.env`**
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/collabboard
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Run locally

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open `http://localhost:5173`.

To test real-time sync: open two browser tabs, log in with different accounts, join the same board, and make changes.

---

## API Reference

### Auth
| Method | Route | Body | Response |
|---|---|---|---|
| `POST` | `/api/auth/signup` | `{ userName, email, password }` | `201 { message }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `200 { token }` |

### Boards *(Auth required)*
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/boards` | List user's boards |
| `POST` | `/api/boards` | Create board |
| `GET` | `/api/boards/:id` | Get board (member only) |
| `PATCH` | `/api/boards/:id` | Rename board (owner only) |
| `DELETE` | `/api/boards/:id` | Delete board + cascade (owner only) |

### Lists *(Auth + board membership)*
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/lists/:boardId` | Get all lists for a board |
| `POST` | `/api/lists` | Create list |
| `PATCH` | `/api/lists/:id` | Rename list |
| `DELETE` | `/api/lists/:id` | Delete list |

### Cards *(Auth + board membership)*
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/cards/:listId` | Get cards in a list |
| `POST` | `/api/cards` | Create card |
| `PATCH` | `/api/cards/:id` | Edit / move card |
| `DELETE` | `/api/cards/:id` | Delete card |

### Socket.IO Events

**Client → Server**
| Event | Payload | Description |
|---|---|---|
| `board:join` | `{ boardId }` | Join a board room (JWT verified server-side) |
| `board:leave` | `{ boardId }` | Leave a board room |

**Server → Client** (all members of a board room)
| Event | Payload |
|---|---|
| `list:created` | `{ list, boardId }` |
| `list:updated` | `{ list, boardId }` |
| `list:deleted` | `{ listId, boardId }` |
| `card:created` | `{ card, listId, boardId }` |
| `card:updated` | `{ card, listId, boardId }` |
| `card:deleted` | `{ cardId, listId, boardId }` |

---

## Deployment

| Layer | Platform | Config |
|---|---|---|
| Frontend | **Vercel** | Build: `npm run build`, Output: `dist` |
| Backend | **Render** | Start: `npm start`, Node env: `production` |

Set environment variables on both platforms as shown in the `.env` section above.

---

## Author

**Gopika S** — [github.com/Gopika34](https://github.com/Gopika34)
