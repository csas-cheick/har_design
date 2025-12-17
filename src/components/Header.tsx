import { FC, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Boutique", path: "/shop" },
    { name: "À Propos", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              HAR DESIGN
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors group ${
                  isActive(link.path) ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${
                    isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors" aria-label="Cart">
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-orders"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
                  >
                    <FiPackage className="w-4 h-4" />
                    Mes Commandes
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    S'inscrire
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                    Connexion
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                autoFocus
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                <FiSearch className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-4">
            <nav className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiPackage className="w-5 h-5" />
                    Mes Commandes
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-lg text-base font-medium hover:bg-gray-200 transition-colors"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-3 px-4 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    S'inscrire
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-black text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-colors"
                  >
                    <FiUser className="w-5 h-5" />
                    Connexion
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
