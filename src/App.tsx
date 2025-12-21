import { FC } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Accueil from "./Accueil";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Cash from "./pages/admin/Cash";
import CoutureModels from "./pages/admin/CoutureModels";
import Measurements from "./pages/admin/Measurements";
import CustomOrders from "./pages/admin/CustomOrders";
import AdminProfile from "./pages/admin/AdminProfile";
import ClientOrders from "./pages/ClientOrders";
import Profile from "./pages/Profile";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Route protégée pour admin
const AdminRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Auth Routes - Sans Header/Footer */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/new" element={<ProductForm />} />
                    <Route path="/products/edit/:id" element={<ProductForm />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/cash" element={<Cash />} />
                    <Route path="/couture-models" element={<CoutureModels />} />
                    <Route path="/measurements" element={<Measurements />} />
                    <Route path="/custom-orders" element={<CustomOrders />} />
                    <Route path="/profile" element={<AdminProfile />} />
                  </Routes>
                </AdminRoute>
              }
            />
            
            {/* Main Routes - Avec Header/Footer */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Accueil />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/my-orders" element={<ClientOrders />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                  <WhatsAppButton />
                  <Footer />
                </div>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
