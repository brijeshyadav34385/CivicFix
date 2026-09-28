import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-navy text-paper sticky top-0 z-[9999]">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <span className="w-3 h-3 bg-signal rounded-full inline-block" />
          CivicFix
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link to="/" className="hover:text-signal transition-colors">
            Map
          </Link>
          {user && (
            <Link to="/report" className="hover:text-signal transition-colors">
              Report Issue
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-signal transition-colors">
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-signal text-navy font-semibold px-3 py-1.5 rounded-md hover:bg-orange-400 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-signal transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-signal text-navy font-semibold px-3 py-1.5 rounded-md hover:bg-orange-400 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
