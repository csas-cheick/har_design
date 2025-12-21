import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiPackage, 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiSearch, 
  FiX 
} from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import { db } from "../../firebase";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

const Products: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Categories
  const categories = ["Tous", "Vêtements", "Chaussures", "Accessoires", "Couture"];

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

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteDoc(doc(db, "products", productToDelete.id));
        setShowDeleteModal(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <AdminLayout>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Produits</h2>
              <p className="text-sm md:text-base text-gray-600 mt-1">Gérez votre catalogue de produits</p>
            </div>
            <Link
              to="/admin/products/new"
              className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-gray-800 transition-colors w-full md:w-auto"
            >
              <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
              Ajouter un produit
            </Link>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
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
                    <th className="text-left py-3 px-2 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-900">
                      Produit
                    </th>
                    <th className="hidden md:table-cell text-left py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-900">
                      Catégorie
                    </th>
                    <th className="text-left py-3 px-2 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-900">
                      Prix
                    </th>
                    <th className="text-left py-3 px-2 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-900">
                      Stock
                    </th>
                    <th className="text-right md:text-left py-3 px-2 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">Chargement...</td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 md:py-4 md:px-6">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <FiPackage className="w-4 h-4 md:w-6 md:h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-xs md:text-base text-gray-900 truncate max-w-[100px] md:max-w-none">{product.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell py-3 px-4 md:py-4 md:px-6">
                          <span className="px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 text-xs md:text-sm font-medium rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-6">
                          <span className="font-semibold text-xs md:text-base text-gray-900 whitespace-nowrap">
                            {formatPrice(product.price)} <span className="hidden md:inline">FCFA</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-6">
                          <span
                            className={`px-2 py-1 md:px-3 md:py-1 text-[10px] md:text-sm font-medium rounded-full whitespace-nowrap ${
                              product.stock > 20
                                ? "bg-green-100 text-green-800"
                                : product.stock > 10
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock} <span className="hidden md:inline">unités</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-6 text-right md:text-left">
                          <div className="flex items-center justify-end md:justify-start gap-1 md:gap-2">
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <p className="text-gray-600 text-xs md:text-sm mb-1">Total Produits</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <p className="text-gray-600 text-xs md:text-sm mb-1">Valeur Stock</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900 truncate">
                {formatPrice(products.reduce((sum, p) => sum + p.price * p.stock, 0))} FCFA
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 col-span-2 md:col-span-1">
              <p className="text-gray-600 text-xs md:text-sm mb-1">Stock Total</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">
                {products.reduce((sum, p) => sum + p.stock, 0)} unités
              </p>
            </div>
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
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Products;
