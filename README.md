# Task Management System

A simple, full-stack task management application built with Go backend and Next.js frontend.

## Overview

This project demonstrates a complete CRUD (Create, Read, Update, Delete) management system with a clean separation between backend and frontend.

## Architecture

### Backend (Go)
- RESTful API built with Go's `net/http` package
- In-memory data storage (can be extended to use a database)
- CORS enabled for frontend communication
- Runs on `http://localhost:8080`

### Frontend (Next.js)
- Minimal, clean UI with black and white styling
- React components for task management
- API integration with backend
- Runs on `http://localhost:3000`

## Features

- ✅ Create new tasks
- ✅ Read/View all tasks
- ✅ Update existing tasks
- ✅ Delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Responsive design

## Tech Stack

- **Backend**: Go 1.21+
- **Frontend**: Next.js 14+, React 18+
- **Styling**: Tailwind CSS (minimal)
- **API**: REST with JSON

## Project Structure

```
.
├── backend/          # Go backend
│   ├── main.go
│   ├── go.mod
│   └── go.sum
├── frontend/         # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── next.config.js
├── README.md
└── CONTRIBUTORS.md
```

## Getting Started

### Prerequisites
- Go 1.21 or higher
- Node.js 18+ and npm
- Git

### Backend Setup

```bash
cd backend
go mod download
go run main.go
```

The API will be available at `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

| Method        | Endpoint         | Description          |
|---------------|------------------|----------------------|
| GET           | `/api/tasks`     | Get all tasks        |
| POST          | `/api/tasks`     | Create a new task    |
| GET           | `/api/tasks/:id` | Get a specific task  |
| PUT           | `/api/tasks/:id` | Update a task        |
| DELETE        | `/api/tasks/:id` | Delete a task        |

## Task Model

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Development Approach

1. **Backend First**: Built a simple REST API with in-memory storage
2. **Frontend Integration**: Created a Next.js app that consumes the API
3. **CRUD Operations**: Implemented all four operations with proper error handling
4. **Minimal UI**: Clean, functional interface without unnecessary complexity

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Authentication and authorization
- Task categories/tags
- Due dates and reminders
- User accounts