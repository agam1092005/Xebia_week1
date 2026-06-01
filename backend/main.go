package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
)

// Task represents a task in the system
type Task struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// TaskStore manages tasks in memory
type TaskStore struct {
	mu    sync.RWMutex
	tasks map[string]*Task
}

var store = &TaskStore{
	tasks: make(map[string]*Task),
}

// enableCORS adds CORS headers to response
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

// handleOptions handles preflight requests
func handleOptions(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		enableCORS(w)
		w.WriteHeader(http.StatusOK)
		return
	}
}

// getTasks returns all tasks
func getTasks(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	handleOptions(w, r)
	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	store.mu.RLock()
	tasks := make([]*Task, 0, len(store.tasks))
	for _, task := range store.tasks {
		tasks = append(tasks, task)
	}
	store.mu.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

// createTask creates a new task
func createTask(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	handleOptions(w, r)
	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if task.Title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	task.ID = uuid.New().String()
	task.CreatedAt = time.Now()
	task.UpdatedAt = time.Now()
	task.Completed = false

	store.mu.Lock()
	store.tasks[task.ID] = &task
	store.mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

// getTask returns a specific task
func getTask(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	handleOptions(w, r)
	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	store.mu.RLock()
	task, exists := store.tasks[id]
	store.mu.RUnlock()

	if !exists {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

// updateTask updates an existing task
func updateTask(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	handleOptions(w, r)
	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	var updates Task
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	store.mu.Lock()
	task, exists := store.tasks[id]
	if !exists {
		store.mu.Unlock()
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	if updates.Title != "" {
		task.Title = updates.Title
	}
	if updates.Description != "" {
		task.Description = updates.Description
	}
	task.Completed = updates.Completed
	task.UpdatedAt = time.Now()

	store.mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

// deleteTask deletes a task
func deleteTask(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	handleOptions(w, r)
	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	store.mu.Lock()
	_, exists := store.tasks[id]
	if !exists {
		store.mu.Unlock()
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}
	delete(store.tasks, id)
	store.mu.Unlock()

	w.WriteHeader(http.StatusNoContent)
}

// healthCheck returns API status
func healthCheck(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func main() {
	http.HandleFunc("/health", healthCheck)
	http.HandleFunc("/api/tasks", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("id") == "" {
			if r.Method == http.MethodGet {
				getTasks(w, r)
			} else if r.Method == http.MethodPost {
				createTask(w, r)
			} else if r.Method == http.MethodOptions {
				enableCORS(w)
				w.WriteHeader(http.StatusOK)
			} else {
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			}
		} else {
			if r.Method == http.MethodGet {
				getTask(w, r)
			} else if r.Method == http.MethodPut {
				updateTask(w, r)
			} else if r.Method == http.MethodDelete {
				deleteTask(w, r)
			} else if r.Method == http.MethodOptions {
				enableCORS(w)
				w.WriteHeader(http.StatusOK)
			} else {
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			}
		}
	})

	port := ":8080"
	fmt.Printf("Server running on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
