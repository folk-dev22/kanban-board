import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBoard } from '../services/boardService';
import { getColumns, createColumn, updateColumn, deleteColumn } from '../services/boardService';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [editingColumn, setEditingColumn] = useState(null);

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateColumn = async (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    try {
      const res = await createColumn(id, { title: newColumnTitle });
      setColumns([...columns, res.data]);
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
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">กำลังโหลด...</div>;

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

      {/* Columns */}
      <div className="flex gap-4 p-6 overflow-x-auto">
        {columns.map(column => (
          <div
            key={column._id}
            className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0"
          >
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

            {/* Tasks จะมาใน Phase 5 */}
            <div className="min-h-16 text-gray-400 text-sm text-center py-4">
              🚧 Tasks จะมาใน Phase 5
            </div>
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
    </div>
  );
};

export default BoardDetail;