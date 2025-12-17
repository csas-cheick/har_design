import { FC, useState, useEffect } from "react";
import { FiShoppingCart, FiX, FiGrid, FiList, FiHeart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isModel?: boolean;
}

const Shop: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Listen to regular products
    const qProducts = query(collection(db, "products"), orderBy("name"));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isModel: false
      })) as Product[];
      
      // We need to merge with current models state, but since we can't easily access it here without another state,
      // let's use two separate states and merge them.
      setRegularProducts(productsData);
    });

    // Listen to couture models
    const qModels = query(collection(db, "couture_models"), orderBy("name"));
    const unsubscribeModels = onSnapshot(qModels, (snapshot) => {
      const modelsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        category: "Couture", // Ensure category is set
        isModel: true
      })) as Product[];
      setCoutureModels(modelsData);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeModels();
    };
  }, []);

  const [regularProducts, setRegularProducts] = useState<Product[]>([]);
  const [coutureModels, setCoutureModels] = useState<Product[]>([]);

  useEffect(() => {
    setProducts([...regularProducts, ...coutureModels]);
  }, [regularProducts, coutureModels]);

  const categories = ["Tous", "Vêtements", "Chaussures", "Accessoires", "Couture"];

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "Tous" && product.category !== selectedCategory) {
      return false;
    }

    if (priceRange !== "all") {
      if (priceRange === "0-20000" && product.price > 20000) return false;
      if (priceRange === "20000-50000" && (product.price < 20000 || product.price > 50000)) return false;
      if (priceRange === "50000-100000" && (product.price < 50000 || product.price > 100000)) return false;
      if (priceRange === "100000+" && product.price < 100000) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              Notre Boutique
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300">
              Découvrez notre collection exclusive de produits de qualité
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mb-32"></div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer">Accueil</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Boutique</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 text-sm md:text-base font-medium rounded-full transition-all ${
                  selectedCategory === cat
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b">
          <p className="text-gray-600 font-medium">
            {sortedProducts.length} produit{sortedProducts.length > 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-4">
            {/* View Toggle - Desktop */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Trier par"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-sm"
            >
              <option value="newest">Plus récent</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="popular">Plus populaire</option>
            </select>

            {/* Price Filter */}
            <button
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:border-black transition-colors text-sm font-medium"
            >
              Prix
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
            : "space-y-6"
          }>
            {sortedProducts.map((product) => (
              viewMode === "grid" ? (
                // Grid View
                <div
                  key={product.id}
                  className="group cursor-pointer border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full ${product.isModel ? 'object-contain p-4' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                        <FiHeart className="w-5 h-5" />
                      </button>
                      {!product.isModel && (
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        >
                          <FiShoppingCart className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm text-gray-500">{product.category}</p>
                      {product.isModel && <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Sur mesure</span>}
                    </div>
                    <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)} FCFA
                    </p>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={product.id}
                  className="flex gap-6 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="w-48 h-48 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full ${product.isModel ? 'object-contain p-4' : 'object-cover'}`}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-gray-500">{product.category}</p>
                        {product.isModel && <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Sur mesure</span>}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)} FCFA
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {!product.isModel && (
                        <button 
                          onClick={() => addToCart(product)}
                          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <FiShoppingCart className="w-5 h-5" />
                          Ajouter au panier
                        </button>
                      )}
                      <button className="p-3 border border-gray-300 rounded-lg hover:border-black transition-colors">
                        <FiHeart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">Aucun produit trouvé</p>
            <p className="text-gray-500">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>

      {/* Price Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Filtrer par prix</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {[
                  { value: "all", label: "Tous les prix" },
                  { value: "0-20000", label: "0 - 20,000 FCFA" },
                  { value: "20000-50000", label: "20,000 - 50,000 FCFA" },
                  { value: "50000-100000", label: "50,000 - 100,000 FCFA" },
                  { value: "100000+", label: "100,000+ FCFA" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      priceRange === option.value
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      value={option.value}
                      checked={priceRange === option.value}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-5 h-5 text-black"
                    />
                    <span className="ml-3 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
