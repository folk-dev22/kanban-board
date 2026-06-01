import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBoards, createBoard, deleteBoard } from '../services/boardService';

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', background: '#0079bf' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const colors = ['#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91'];

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await getBoards();
      setBoards(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createBoard(form);
      setBoards([...boards, res.data]);
      setShowModal(false);
      setForm({ title: '', description: '', background: '#0079bf' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ต้องการลบ Board นี้ไหม?')) return;
    try {
      await deleteBoard(id);
      setBoards(boards.filter(b => b._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Kanban Board 🗂️</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">สวัสดี, {user?.username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            ออกจากระบบ
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Boards ของฉัน</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + สร้าง Board ใหม่
          </button>
        </div>

        {/* Board Grid */}
        {loading ? (
          <p className="text-gray-500">กำลังโหลด...</p>
        ) : boards.length === 0 ? (
          <p className="text-gray-500">ยังไม่มี Board กดสร้างเลย!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map(board => (
              <div
                key={board._id}
                className="rounded-lg p-4 text-white cursor-pointer hover:opacity-90 relative"
                style={{ backgroundColor: board.background }}
                onClick={() => navigate(`/boards/${board._id}`)}
              >
                <h3 className="font-bold text-lg">{board.title}</h3>
                {board.description && (
                  <p className="text-sm opacity-80 mt-1">{board.description}</p>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(board._id); }}
                  className="absolute top-2 right-2 bg-black bg-opacity-20 rounded px-2 py-1 text-xs hover:bg-opacity-40"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal สร้าง Board */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">สร้าง Board ใหม่</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อ Board</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">คำอธิบาย</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">สีพื้นหลัง</label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <div
                      key={color}
                      onClick={() => setForm({ ...form, background: color })}
                      className={`w-8 h-8 rounded cursor-pointer ${form.background === color ? 'ring-2 ring-offset-2 ring-gray-800' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  สร้าง
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boards;