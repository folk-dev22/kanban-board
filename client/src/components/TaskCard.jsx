const TaskCard = ({ task, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer group">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-800 flex-1">{task.title}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="text-gray-400 hover:text-blue-500 text-xs px-1"
          >
            ✏️
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
            className="text-gray-400 hover:text-red-500 text-xs px-1"
          >
            🗑️
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 mt-1">{task.description}</p>
      )}
    </div>
  );
};

export default TaskCard;