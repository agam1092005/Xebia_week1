'use client'

import { useState } from 'react'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggleTask, onDeleteTask, onUpdateTask }) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const handleEditStart = (task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  const handleEditSave = async (id) => {
    await onUpdateTask(id, {
      title: editTitle,
      description: editDescription,
    })
    setEditingId(null)
  }

  const handleEditCancel = () => {
    setEditingId(null)
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div>
      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{completedCount}</span> of{' '}
          <span className="font-semibold">{tasks.length}</span> tasks completed
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isEditing={editingId === task.id}
              editTitle={editTitle}
              editDescription={editDescription}
              onEditTitleChange={setEditTitle}
              onEditDescriptionChange={setEditDescription}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onEditStart={handleEditStart}
              onEditSave={handleEditSave}
              onEditCancel={handleEditCancel}
            />
          ))}
        </div>
      )}
    </div>
  )
}
