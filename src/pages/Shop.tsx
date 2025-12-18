import { FC, useState, useEffect } from "react";
import { FiX, FiGrid, FiList, FiHeart, FiFilter } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

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
  const [regularProducts, setRegularProducts] = useState<Product[]>([]);
  const [coutureModels, setCoutureModels] = useState<Product[]>([]);

  useEffect(() => {
    // Listen to regular products
    const qProducts = query(collection(db, "products"), orderBy("name"));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isModel: false
      })) as Product[];
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
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              La Boutique
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg lg:text-xl text-gray-300"
            >
              Une sélection rigoureuse de pièces d'exception pour sublimer votre quotidien.
            </motion.p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mb-32"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Toolbar & Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 sticky top-0 bg-white/90 backdrop-blur-md z-30 py-4 -mx-6 px-6 border-b border-gray-100 lg:static lg:bg-transparent lg:border-none lg:p-0">
          {/* Categories */}
          <div className="flex flex-wrap gap-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm uppercase tracking-widest transition-colors relative pb-2 ${
                  selectedCategory === cat
                    ? "text-black font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <p className="text-gray-400 text-sm font-light">
              {sortedProducts.length} RÉSULTATS
            </p>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center border-r border-gray-200 pr-4 gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "text-black" : "text-gray-300 hover:text-gray-500"}`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "text-black" : "text-gray-300 hover:text-gray-500"}`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>

              <select
                aria-label="Trier par"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer hover:text-gray-600"
              >
                <option value="newest">Nouveautés</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="popular">Populaire</option>
              </select>

              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 text-sm font-medium hover:text-gray-600 transition-colors"
              >
                <FiFilter className="w-4 h-4" />
                FILTRER
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {sortedProducts.length > 0 ? (
            <div 
              className={viewMode === "grid" 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12" 
                : "grid grid-cols-1 md:grid-cols-2 gap-8"
              }
            >
              {sortedProducts.map((product) => (
                viewMode === "grid" ? (
                  // Grid View Card
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={product.id}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] bg-gray-100 mb-2 md:mb-4 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full ${product.isModel ? 'object-contain p-4 md:p-8' : 'object-cover'} transition-transform duration-700 ease-out group-hover:scale-105`}
                      />
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 justify-center">
                        {!product.isModel && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="bg-white text-black px-6 py-3 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors shadow-lg hidden md:block"
                          >
                            AJOUTER
                          </button>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isModel && (
                          <span className="bg-black text-white text-[8px] md:text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                            Sur Mesure
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 font-light">
                        {formatPrice(product.price)} FCFA
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  // List View Card
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={product.id}
                    className="flex gap-6 group cursor-pointer border-b border-gray-100 pb-8"
                  >
                    <div className="w-40 aspect-[3/4] bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full ${product.isModel ? 'object-contain p-4' : 'object-cover'} transition-transform duration-700 group-hover:scale-105`}
                      />
                    </div>
                    <div className="flex-1 py-2 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{product.category}</span>
                          {product.isModel && <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Sur Mesure</span>}
                        </div>
                        <h3 className="text-xl font-serif font-medium text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-lg text-gray-900 font-light mb-4">
                          {formatPrice(product.price)} FCFA
                        </p>
                        <p className="text-gray-500 font-light text-xs max-w-xs line-clamp-2 mb-4">
                          Une pièce d'exception conçue avec les meilleurs matériaux pour garantir élégance et durabilité.
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        {!product.isModel && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="bg-black text-white px-6 py-2 text-[10px] font-bold tracking-widest hover:bg-gray-800 transition-colors"
                          >
                            AJOUTER
                          </button>
                        )}
                        <button className="border border-gray-200 px-3 py-2 hover:border-black transition-colors">
                          <FiHeart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <p className="text-2xl font-serif text-gray-400 mb-4">Aucun produit trouvé</p>
              <button 
                onClick={() => {
                  setSelectedCategory("Tous");
                  setPriceRange("all");
                }}
                className="text-sm font-bold border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
              >
                RÉINITIALISER LES FILTRES
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Sidebar (Modal) */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-serif font-medium">Filtres</h2>
                <button onClick={() => setShowFilters(false)}>
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Prix</h3>
                  <div className="space-y-3">
                    {[
                      { value: "all", label: "Tous les prix" },
                      { value: "0-20000", label: "Moins de 20,000 FCFA" },
                      { value: "20000-50000", label: "20,000 - 50,000 FCFA" },
                      { value: "50000-100000", label: "50,000 - 100,000 FCFA" },
                      { value: "100000+", label: "Plus de 100,000 FCFA" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer group">
                        <div className={`w-5 h-5 border border-gray-300 flex items-center justify-center mr-3 transition-colors ${priceRange === option.value ? "bg-black border-black" : "group-hover:border-black"}`}>
                          {priceRange === option.value && <div className="w-2 h-2 bg-white" />}
                        </div>
                        <input
                          type="radio"
                          name="priceRange"
                          value={option.value}
                          checked={priceRange === option.value}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="hidden"
                        />
                        <span className={`text-sm ${priceRange === option.value ? "text-black font-medium" : "text-gray-500"}`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-black text-white py-4 text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors"
                >
                  VOIR LES RÉSULTATS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
