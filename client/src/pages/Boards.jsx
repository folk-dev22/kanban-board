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

  const colors = [
    '#0079bf', '#d29034', '#519839',
    '#b04632', '#89609e', '#cd5a91',
    '#00aecc', '#838c91'
  ];

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗂️</span>
          <h1 className="text-xl font-bold text-white">Kanban Board</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-500 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-white text-sm font-medium">{user?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            ออกจากระบบ
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Boards ของฉัน</h2>
            <p className="text-gray-500 text-sm mt-1">มีทั้งหมด {boards.length} Board</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2"
          >
            <span>+</span> สร้าง Board ใหม่
          </button>
        </div>

        {/* Board Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-lg">⏳ กำลังโหลด...</div>
          </div>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl font-medium">ยังไม่มี Board</p>
            <p className="text-sm mt-1">กดปุ่ม "สร้าง Board ใหม่" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map(board => (
              <div
                key={board._id}
                className="rounded-xl p-5 text-white cursor-pointer hover:opacity-90 hover:scale-105 transition-all relative shadow-md"
                style={{ backgroundColor: board.background }}
                onClick={() => navigate(`/boards/${board._id}`)}
              >
                <h3 className="font-bold text-lg">{board.title}</h3>
                {board.description && (
                  <p className="text-sm opacity-80 mt-1">{board.description}</p>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(board._id); }}
                  className="absolute top-3 right-3 bg-black bg-opacity-20 rounded-lg px-2 py-1 text-xs hover:bg-opacity-40 transition"
                >
                  ลบ
                </button>
                <div className="mt-8 text-xs opacity-60">
                  คลิกเพื่อเปิด →
                </div>
              </div>
            ))}

            {/* Create Board Card */}
            <div
              onClick={() => setShowModal(true)}
              className="rounded-xl p-5 bg-gray-200 hover:bg-gray-300 cursor-pointer transition flex items-center justify-center h-32"
            >
              <div className="text-center text-gray-500">
                <div className="text-3xl mb-1">+</div>
                <p className="text-sm font-medium">สร้าง Board ใหม่</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-5">สร้าง Board ใหม่</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ Board</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="เช่น งานประจำสัปดาห์"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="อธิบาย Board นี้ (ไม่บังคับ)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สีพื้นหลัง</label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => (
                    <div
                      key={color}
                      onClick={() => setForm({ ...form, background: color })}
                      className={`w-9 h-9 rounded-lg cursor-pointer transition hover:scale-110 ${
                        form.background === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div
                className="rounded-lg p-4 text-white"
                style={{ backgroundColor: form.background }}
              >
                <p className="font-bold">{form.title || 'ชื่อ Board'}</p>
                <p className="text-sm opacity-80">{form.description || 'คำอธิบาย'}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  สร้าง Board
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 font-medium transition"
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