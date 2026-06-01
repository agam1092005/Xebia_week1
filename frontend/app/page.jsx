'use client'

import { useState, useEffect } from 'react'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'

const API_URL = 'http://localhost:8080/api/tasks'

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      setTasks(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  // Add new task
  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) throw new Error('Failed to create task')
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  // Update task
  const handleUpdateTask = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update task')
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete task')
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  // Toggle task completion
  const handleToggleTask = async (task) => {
    await handleUpdateTask(task.id, {
      ...task,
      completed: !task.completed,
    })
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Task Manager</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            Error: {error}
          </div>
        )}

        <TaskForm onAddTask={handleAddTask} />

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        )}
      </div>
    </div>
  )
}
