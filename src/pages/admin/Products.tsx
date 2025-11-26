import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp,
  FiLogOut,
  FiSettings,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiX
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

const Products: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Données de démonstration
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "T-Shirt Classique Premium", category: "Vêtements", price: 15000, stock: 45, image: "", description: "T-shirt en coton de qualité supérieure" },
    { id: 2, name: "Jean Slim Fit Denim", category: "Vêtements", price: 35000, stock: 30, image: "", description: "Jean stretch confortable" },
    { id: 3, name: "Veste en Cuir Véritable", category: "Vêtements", price: 75000, stock: 12, image: "", description: "Veste en cuir premium" },
    { id: 4, name: "Sneakers Sport Premium", category: "Chaussures", price: 45000, stock: 25, image: "", description: "Chaussures de sport confortables" },
    { id: 5, name: "Montre Classique Élégante", category: "Accessoires", price: 55000, stock: 18, image: "", description: "Montre élégante" },
  ]);

  const categories = ["Tous", "Vêtements", "Chaussures", "Accessoires"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HAR DESIGN</h1>
              <p className="text-sm text-gray-600">Dashboard Administrateur</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Déconnexion"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiTrendingUp className="w-5 h-5" />
              <span>Tableau de bord</span>
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-gray-900 bg-gray-100 rounded-lg font-medium"
            >
              <FiPackage className="w-5 h-5" />
              <span>Produits</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiShoppingBag className="w-5 h-5" />
              <span>Commandes</span>
            </Link>
            <Link
              to="/admin/customers"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiUsers className="w-5 h-5" />
              <span>Clients</span>
            </Link>
            <Link
              to="/admin/measurements"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiSettings className="w-5 h-5" />
              <span>Mesures Couture</span>
            </Link>
            <Link
              to="/admin/cash"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiDollarSign className="w-5 h-5" />
              <span>Caisse</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Produits</h2>
              <p className="text-gray-600 mt-1">Gérez votre catalogue de produits</p>
            </div>
            <Link
              to="/admin/products/new"
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Ajouter un produit
            </Link>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                      Produit
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                      Catégorie
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                      Prix
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                      Stock
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <FiPackage className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-900">
                            {formatPrice(product.price)} FCFA
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                              product.stock > 20
                                ? "bg-green-100 text-green-800"
                                : product.stock > 10
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock} unités
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              aria-label="Modifier"
                            >
                              <FiEdit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Supprimer"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FiPackage className="w-12 h-12 mb-3" />
                          <p className="font-medium">Aucun produit trouvé</p>
                          <p className="text-sm">Essayez de modifier vos filtres</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-1">Total Produits</p>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-1">Valeur Stock</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(products.reduce((sum, p) => sum + p.price * p.stock, 0))} FCFA
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-1">Stock Total</p>
              <p className="text-3xl font-bold text-gray-900">
                {products.reduce((sum, p) => sum + p.stock, 0)} unités
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer le produit <strong>{productToDelete.name}</strong> ? 
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
