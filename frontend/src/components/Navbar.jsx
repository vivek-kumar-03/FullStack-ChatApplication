// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Menu, X, ArrowLeft } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== "/" && authUser;

  const handleBack = () => {
    if (location.pathname === "/profile" || location.pathname === "/settings") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="fixed w-full top-0 z-40 border-b border-primary bg-base-100">
      <div className="container mx-auto px-3 sm:px-4 h-16">
        <div className="flex items-center justify-between h-full gap-4">
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 transition-colors p-2 hover:bg-primary/10 rounded-lg flex-shrink-0 text-primary"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:block text-sm">Back</span>
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all min-w-0">
              <div className="w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center flex-shrink-0 bg-primary border border-primary">
                <MessageSquare className="w-6 h-6 text-primary-content" />
              </div>
              <h1 className="text-xl font-bold hidden sm:block truncate text-primary">Kinnect</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              to="/settings"
              className="btn btn-secondary backdrop-blur-sm transition-all duration-200 px-3 lg:px-4 bg-base-100 border border-primary text-primary hover:bg-primary/10"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline ml-1">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link 
                  to="/profile" 
                  className="btn btn-secondary backdrop-blur-sm transition-all duration-200 px-3 lg:px-4 bg-base-100 border border-primary text-primary hover:bg-primary/10"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline ml-1">Profile</span>
                </Link>

                <button 
                  className="btn btn-danger transition-all duration-200 px-3 lg:px-4 bg-error border-error text-white hover:bg-error/80"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline ml-1">Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden btn btn-secondary backdrop-blur-sm transition-all duration-200 p-2 bg-base-100 border border-primary text-primary hover:bg-primary/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-sm shadow-lg bg-base-100 border-b border-primary">
            <div className="flex flex-col p-4 space-y-2">
              <Link
                to="/settings"
                className="flex items-center gap-3 p-3 rounded-lg transition-colors text-primary hover:bg-primary/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>

              {authUser && (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors text-primary hover:bg-primary/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>

                  <button 
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors text-error hover:bg-primary/10 text-left"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
