import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const Cart: FC = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 2000 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.id,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        items: cartItems,
        subtotal,
        shipping,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      clearCart();
      alert("Commande passée avec succès !");
      navigate("/shop");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Une erreur est survenue lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              Panier
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300">
              Vérifiez vos articles avant de passer commande
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mb-32"></div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto px-6 py-12">
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Articles ({cartItems.length})
              </h2>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="w-32 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {item.category}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-xl font-bold text-gray-900">
                        {formatPrice(item.price)} FCFA
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Diminuer la quantité"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-6 py-2 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Augmenter la quantité"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Supprimer l'article"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Résumé
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Sous-total</span>
                    <span className="font-medium">
                      {formatPrice(subtotal)} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Livraison</span>
                    <span className="font-medium">
                      {formatPrice(shipping)} FCFA
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(total)} FCFA</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate("/login");
                    } else {
                      setShowCheckout(true);
                    }
                  }}
                  className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-4"
                >
                  {isAuthenticated ? "Passer la commande" : "Se connecter pour commander"}
                </button>

                <Link
                  to="/shop"
                  className="block w-full text-center py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8">
              Découvrez notre collection et ajoutez des articles à votre panier
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <FiShoppingBag className="w-5 h-5" />
              Découvrir la boutique
            </Link>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Finaliser la commande</h3>
              <form onSubmit={handleCheckout} className="space-y-4">
                {/* Si l'utilisateur est connecté, on affiche ses infos en lecture seule ou pré-remplies */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${user ? 'bg-gray-100' : ''}`}
                    readOnly={!!user}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${user ? 'bg-gray-100' : ''}`}
                    readOnly={!!user}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison</label>
                  <textarea
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    rows={3}
                    placeholder="Quartier, Ville, Indications..."
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Envoi..." : "Commander"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
