import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <h2 className="text-2xl font-bold text-gray-500">
          🚧 Boards จะมาใน Phase 3!
        </h2>
      </div>
    </div>
  );
};

export default Home;