# 📋 CollabBoard

A Trello-inspired task and project management application built with the MERN stack.

CollabBoard is designed to provide a structured workspace where users can organize projects into boards, lists, and cards. The project focuses on building a real-world full-stack application with authentication, REST APIs, and an interactive task-management interface.

## ✨ Features

* 🔐 JWT-based user authentication
* 📋 Create and manage boards
* 📝 Create and manage lists within boards
* 🎯 Create and manage task cards
* 🖱️ Drag-and-drop task organization
* 🔒 Protected API routes
* 👤 User-based board access
* 🌐 REST API architecture
* 🎨 Responsive React interface
* 🌙 Dark-mode UI
* 🧪 Backend and frontend testing setup

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* React Hooks
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

### Database

* MongoDB
* Mongoose

### Testing & Tools

* Vitest
* React Testing Library
* Supertest
* MSW
* Git
* GitHub
* Postman

## 🏗️ Application Structure

```text
CollabBoard
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── tests/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── tests/
│
└── README.md
```

## 🔐 Authentication

The application uses JWT-based authentication.

The authentication flow includes:

1. User registration
2. User login
3. JWT generation
4. Protected API requests
5. Authentication middleware
6. Automatic handling of unauthorized requests

## 📌 Core Architecture

The application follows a client-server architecture:

```text
React Client
     │
     │ HTTP / REST API
     ▼
Express.js Server
     │
     ▼
MongoDB
```

This separation keeps frontend UI logic, backend business logic, and database operations organized independently.

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/Gopika34/Collab_Board.git
cd Collab_Board
```

### Install dependencies

Install dependencies separately for the frontend and backend according to the project structure.

### Environment Variables

Create the required `.env` files and configure:

```env
MONGO_URI=
JWT_SECRET=
VITE_API_URL=
```

### Run the application

Start the backend and frontend development servers separately.

## 🧪 Testing

The project includes testing for important backend and frontend functionality using:

* Vitest
* Supertest
* React Testing Library
* MSW

## 🎯 Learning Goals

This project is being developed to gain practical experience with:

* Full-stack application architecture
* REST API design
* Authentication and authorization
* MongoDB data modeling
* React state management
* Testing full-stack applications
* Building production-oriented features

## 👩‍💻 Author

**Gopika S**

GitHub: https://github.com/Gopika34
