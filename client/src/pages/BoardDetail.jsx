import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getBoard } from '../services/boardService';
import { getColumns, createColumn, updateColumn, deleteColumn } from '../services/boardService';
import { getTasks, createTask, updateTask, deleteTask, moveTask } from '../services/boardService';
import TaskCard from '../components/TaskCard';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [editingColumn, setEditingColumn] = useState(null);
  const [addingTaskColumn, setAddingTaskColumn] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [boardRes, columnsRes] = await Promise.all([
        getBoard(id),
        getColumns(id)
      ]);
      setBoard(boardRes.data);
      setColumns(columnsRes.data);

      const tasksData = {};
      await Promise.all(
        columnsRes.data.map(async (col) => {
          const res = await getTasks(id, col._id);
          tasksData[col._id] = res.data;
        })
      );
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const sourceTasks = [...(tasks[sourceCol] || [])];
    const destTasks = sourceCol === destCol ? sourceTasks : [...(tasks[destCol] || [])];

    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceCol === destCol) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceCol]: sourceTasks });
    } else {
      destTasks.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceCol]: sourceTasks, [destCol]: destTasks });
    }

    try {
      await moveTask(id, sourceCol, draggableId, {
        columnId: destCol,
        order: destination.index
      });
    } catch (error) {
      console.error(error);
      fetchData();
    }
  };

  const handleCreateColumn = async (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    try {
      const res = await createColumn(id, { title: newColumnTitle });
      setColumns([...columns, res.data]);
      setTasks({ ...tasks, [res.data._id]: [] });
      setNewColumnTitle('');
      setShowAddColumn(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateColumn = async (columnId, title) => {
    try {
      const res = await updateColumn(id, columnId, { title });
      setColumns(columns.map(c => c._id === columnId ? res.data : c));
      setEditingColumn(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!window.confirm('ต้องการลบ Column นี้ไหม?')) return;
    try {
      await deleteColumn(id, columnId);
      setColumns(columns.filter(c => c._id !== columnId));
      const newTasks = { ...tasks };
      delete newTasks[columnId];
      setTasks(newTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (columnId) => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await createTask(id, columnId, { title: newTaskTitle });
      setTasks({ ...tasks, [columnId]: [...(tasks[columnId] || []), res.data] });
      setNewTaskTitle('');
      setAddingTaskColumn(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (columnId, taskId) => {
    if (!window.confirm('ต้องการลบ Task นี้ไหม?')) return;
    try {
      await deleteTask(id, columnId, taskId);
      setTasks({ ...tasks, [columnId]: tasks[columnId].filter(t => t._id !== taskId) });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTask = async (columnId, taskId, data) => {
    try {
      const res = await updateTask(id, columnId, taskId, data);
      setTasks({ ...tasks, [columnId]: tasks[columnId].map(t => t._id === taskId ? res.data : t) });
      setEditingTask(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">กำลังโหลด...</div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: board?.background }}>
      {/* Navbar */}
      <nav className="bg-black bg-opacity-20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded"
          >
            ← กลับ
          </button>
          <h1 className="text-xl font-bold text-white">{board?.title}</h1>
        </div>
      </nav>

      {/* Drag & Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-6 overflow-x-auto min-h-[calc(100vh-64px)]">
          {columns.map(column => (
            <div key={column._id} className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0 h-fit">
              {/* Column Header */}
              <div className="flex justify-between items-center mb-3">
                {editingColumn === column._id ? (
                  <input
                    type="text"
                    defaultValue={column.title}
                    autoFocus
                    onBlur={(e) => handleUpdateColumn(column._id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateColumn(column._id, e.target.value);
                      if (e.key === 'Escape') setEditingColumn(null);
                    }}
                    className="font-bold bg-white border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <h3
                    className="font-bold cursor-pointer hover:bg-gray-200 px-2 py-1 rounded"
                    onClick={() => setEditingColumn(column._id)}
                  >
                    {column.title}
                  </h3>
                )}
                <button
                  onClick={() => handleDeleteColumn(column._id)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  ✕
                </button>
              </div>

              {/* Droppable Tasks */}
              <Droppable droppableId={column._id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 mb-2 min-h-16 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    {(tasks[column._id] || []).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'opacity-80 rotate-1' : ''}
                          >
                            <TaskCard
                              task={task}
                              onDelete={(taskId) => handleDeleteTask(column._id, taskId)}
                              onEdit={(task) => setEditingTask({ ...task, columnId: column._id })}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Add Task */}
              {addingTaskColumn === column._id ? (
                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="ชื่อ Task..."
                    autoFocus
                    className="w-full border rounded px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateTask(column._id);
                      if (e.key === 'Escape') { setAddingTaskColumn(null); setNewTaskTitle(''); }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCreateTask(column._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      เพิ่ม
                    </button>
                    <button
                      onClick={() => { setAddingTaskColumn(null); setNewTaskTitle(''); }}
                      className="text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingTaskColumn(column._id)}
                  className="w-full text-left text-gray-500 hover:bg-gray-200 px-2 py-1 rounded text-sm mt-1"
                >
                  + เพิ่ม Task
                </button>
              )}
            </div>
          ))}

          {/* Add Column */}
          <div className="w-72 flex-shrink-0">
            {showAddColumn ? (
              <div className="bg-gray-100 rounded-lg p-3">
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="ชื่อ Column..."
                  autoFocus
                  className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateColumn(e);
                    if (e.key === 'Escape') { setShowAddColumn(false); setNewColumnTitle(''); }
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateColumn}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    เพิ่ม
                  </button>
                  <button
                    onClick={() => { setShowAddColumn(false); setNewColumnTitle(''); }}
                    className="text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddColumn(true)}
                className="w-full bg-white bg-opacity-20 text-white rounded-lg p-3 hover:bg-opacity-30 text-left"
              >
                + เพิ่ม Column
              </button>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Modal แก้ไข Task */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">แก้ไข Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อ Task</label>
                <input
                  type="text"
                  defaultValue={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">คำอธิบาย</label>
                <textarea
                  defaultValue={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateTask(editingTask.columnId, editingTask._id, {
                    title: editingTask.title,
                    description: editingTask.description
                  })}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardDetail;