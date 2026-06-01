# Quick Start Guide

## Option 1: Docker Compose (Recommended - One Command)

### Prerequisites
- Docker
- Docker Compose

### Run Everything

```bash
docker-compose up --build
```

That's it! The application will be available at `http://localhost:3000` once both services are running.

To stop:
```bash
docker-compose down
```

---

## Option 2: Local Development (Manual Setup)

### Prerequisites

- Go 1.21 or higher
- Node.js 18+ and npm
- Two terminal windows

### Terminal 1: Start the Backend

```bash
cd backend
go run main.go
```

You should see:
```
Server running on http://localhost:8080
```

### Terminal 2: Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Access the Application

Open your browser and navigate to: **http://localhost:3000**

### Docker Logs

To view logs from a specific service:
```bash
docker-compose logs backend
docker-compose logs frontend
```

To follow logs in real-time:
```bash
docker-compose logs -f
```

## Testing CRUD Operations

### Create a Task
1. Enter a title in the "Task Title" field
2. Optionally add a description
3. Click "Add Task"

### Read Tasks
- All tasks are displayed in the list below the form
- Tasks show title, description, creation date, and status

### Update a Task
1. Click the "Edit" button on any task
2. Modify the title or description
3. Click "Save" to update or "Cancel" to discard changes

### Delete a Task
1. Click the "Delete" button on any task
2. The task will be removed immediately

### Mark as Complete
- Click the checkbox next to any task to mark it as complete/incomplete
- Completed tasks show with strikethrough text and gray background

## API Endpoints (for reference)

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks?id=<id>` - Get a specific task
- `PUT /api/tasks?id=<id>` - Update a task
- `DELETE /api/tasks?id=<id>` - Delete a task
- `GET /health` - Health check

## Stopping the Application

### Docker
```bash
docker-compose down
```

### Local Development
Press `Ctrl+C` in both terminal windows to stop the servers.

## Troubleshooting

**Docker issues?**
- Ensure Docker and Docker Compose are installed: `docker --version` and `docker-compose --version`
- If ports are in use, modify ports in `docker-compose.yml`
- Rebuild images: `docker-compose build --no-cache`

**Port already in use?**
- Backend: Change port in `docker-compose.yml` (backend service)
- Frontend: Change port in `docker-compose.yml` (frontend service)
- Or modify `backend/main.go` and `frontend/app/page.jsx` for local development

**CORS errors?**
- Ensure the backend is running on `http://localhost:8080`
- Check that the frontend API_URL in `app/page.jsx` matches

**Dependencies not installing?**
- Backend: Run `go mod download`
- Frontend: Delete `node_modules` and `package-lock.json`, then run `npm install` again
