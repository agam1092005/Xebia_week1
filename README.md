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

### Option 1: Docker Compose with Blue-Green Deployment (Recommended)

#### Prerequisites
- Docker
- Docker Compose

#### Run

```bash
docker-compose up --build
```

This starts both blue and green deployments with load balancers for zero-downtime updates.

#### Check Deployment Status

```bash
./scripts/deployment-status.sh
```

#### Switch Active Deployment

```bash
./scripts/switch-deployment.sh blue   # Switch to blue
./scripts/switch-deployment.sh green  # Switch to green
```

To stop:
```bash
docker-compose down
```

---

### Option 2: Local Development

#### Prerequisites
- Go 1.21 or higher
- Node.js 20+ and npm
- Git

#### Backend Setup

```bash
cd backend
go mod download
go run main.go
```

The API will be available at `http://localhost:8080`

#### Frontend Setup

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
5. **Blue-Green Deployment**: Added zero-downtime deployment strategy

## Blue-Green Deployment Strategy

This project implements a blue-green deployment pattern for zero-downtime updates:

### Architecture
- **Backend**: Two instances (blue on 8080, green on 8081) behind Nginx load balancer
- **Frontend**: Two instances (blue and green) behind Nginx load balancer
- **Load Balancers**: Route traffic to healthy instances only

### Benefits
- ✅ **Zero Downtime**: Switch between deployments instantly
- ✅ **Easy Rollback**: Revert to previous version with one command
- ✅ **Testing**: Test new version before switching traffic
- ✅ **Health Checks**: Automatic failover if deployment becomes unhealthy

### Workflow
1. Deploy new version to inactive (green) environment
2. Run health checks on green deployment
3. Switch traffic from blue to green using `./scripts/switch-deployment.sh green`
4. Blue becomes standby for next deployment

### CI/CD Integration
GitHub Actions automatically:
- Builds and tests on every commit
- Builds Docker images for both backend and frontend
- Pushes images to container registry
- Provides deployment status summary

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Authentication and authorization
- Task categories/tags
- Due dates and reminders
- User accounts
- Kubernetes deployment manifests
- Automated health checks and rollback