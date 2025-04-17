import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ setIsAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); // ✅ Remove admin state from storage
    setIsAdmin(false); // ✅ Reset admin state
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="bg-[#000000] text-[#FFFFFF] p-4 flex flex-wrap items-center justify-between w-full">
      <div className="text-2xl font-bold">
        <span className="text-[#1E8449]">Smart</span>
        <span className="text-[#3498DB]">Waste</span>
      </div>
      <h1 className="text-xl font-bold text-center flex-1 md:flex-none">Admin Panel</h1>
      <div className="mt-2 md:mt-0">
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
