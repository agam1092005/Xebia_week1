'use client'

import { useState } from 'react'

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
      })
      setTitle('')
      setDescription('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 border border-black rounded">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-semibold text-black mb-2">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-semibold text-black mb-2">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows="3"
          className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full px-4 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 transition"
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  )
}
