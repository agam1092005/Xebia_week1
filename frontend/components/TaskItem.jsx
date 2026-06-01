'use client'

export default function TaskItem({
  task,
  isEditing,
  editTitle,
  editDescription,
  onEditTitleChange,
  onEditDescriptionChange,
  onToggle,
  onDelete,
  onEditStart,
  onEditSave,
  onEditCancel,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (isEditing) {
    return (
      <div className="p-4 border border-black rounded bg-gray-50">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-black rounded mb-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Task title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => onEditDescriptionChange(e.target.value)}
          className="w-full px-3 py-2 border border-black rounded mb-3 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Task description"
          rows="2"
        />
        <div className="flex gap-2">
          <button
            onClick={() => onEditSave(task.id)}
            className="flex-1 px-3 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
          >
            Save
          </button>
          <button
            onClick={onEditCancel}
            className="flex-1 px-3 py-2 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`p-4 border border-black rounded transition ${
        task.completed ? 'bg-gray-100' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className="mt-1 w-5 h-5 cursor-pointer accent-black"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-lg ${
              task.completed ? 'line-through text-gray-500' : 'text-black'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`text-sm mt-1 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Created: {formatDate(task.createdAt)}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEditStart(task)}
            className="px-3 py-1 text-sm bg-gray-200 text-black font-semibold rounded hover:bg-gray-300 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 font-semibold rounded hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
