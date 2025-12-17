import { FC, useState, useEffect } from "react";
import { FiFacebook, FiInstagram, FiShoppingCart } from "react-icons/fi";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import heroImage from "./assets/hero1.png";
import { db } from "./firebase";
import { collection, onSnapshot, query, limit, orderBy } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isModel?: boolean;
}

const Accueil: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState("all");
  const [regularProducts, setRegularProducts] = useState<Product[]>([]);
  const [coutureModels, setCoutureModels] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isModel: false
      })) as Product[];
      setRegularProducts(data);
      setLoading(false);
    });

    const qModels = query(collection(db, "couture_models"), limit(5));
    const unsubscribeModels = onSnapshot(qModels, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        category: "Couture", // Force category
        isModel: true
      })) as Product[];
      setCoutureModels(data);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeModels();
    };
  }, []);

  const products = [...regularProducts, ...coutureModels];

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "Tous" && product.category !== selectedCategory) {
      return false;
    }
    // Add price filtering logic if needed
    return true;
  });

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-[90vh]">
        <div className="container mx-auto px-6 h-full">
          <div className="grid md:grid-cols-2 gap-12 items-start md:items-center min-h-[90vh] pt-8 md:pt-0">
            {/* Left Content */}
            <div className="space-y-8 z-10">
              <div className="space-y-4">
                <p className="text-red-400 uppercase tracking-widest text-sm font-semibold">
                  BIENVENU SUR HAR DESIGN
                </p>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  HAR Design<br />
                  Niamey - Niger
                </h1>
                <p className="text-gray-300 text-base md:text-lg max-w-lg leading-relaxed">
                  Découvrez notre collection exclusive de vêtements et accessoires. 
                  Des créations soigneusement sélectionnées pour votre style unique.
                </p>
              </div>
              
              <Link
                to="/shop"
                className="inline-flex items-center bg-white text-black px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold tracking-wider hover:bg-gray-100 transition-colors group"
              >
                DÉCOUVRIR
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative">
              {/* Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-80 md:h-80 bg-white opacity-10 rounded-full"></div>
              
              {/* Model Image */}
              <div className="relative z-10 flex justify-center">
                <img 
                  src={heroImage} 
                  alt="HAR DESIGN Collection" 
                  className="w-2/3 md:w-full max-w-[240px] md:max-w-sm h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="absolute left-6 right-6 md:right-auto bottom-6 md:bottom-12 flex justify-between md:justify-start md:space-x-6">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
            <div className="flex space-x-4 md:hidden">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Pinterest">
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>
            <a href="#" className="hidden md:block text-gray-400 hover:text-white transition-colors" aria-label="Pinterest">
              <FaWhatsapp className="w-5 h-5" />
            </a>
            <a href="#" className="hidden md:block text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
              <FiInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Nos Produits
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de vêtements tendance pour tous les styles
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Catégorie
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Tous", "Vêtements", "Chaussures", "Accessoires"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-black text-white"
                          : "bg-white text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label htmlFor="price-range" className="block text-sm font-semibold text-gray-900 mb-3">
                  Gamme de prix
                </label>
                <select
                  id="price-range"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="all">Tous les prix</option>
                  <option value="0-20000">0 - 20,000 FCFA</option>
                  <option value="20000-50000">20,000 - 50,000 FCFA</option>
                  <option value="50000-100000">50,000 - 100,000 FCFA</option>
                  <option value="100000+">100,000+ FCFA</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label htmlFor="sort-by" className="block text-sm font-semibold text-gray-900 mb-3">
                  Trier par
                </label>
                <select
                  id="sort-by"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="newest">Plus récent</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="popular">Plus populaire</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {loading ? (
              <div className="col-span-full text-center py-10">Chargement...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-10">Aucun produit trouvé</div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
                  <div className="relative aspect-square bg-gray-50">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={`w-full h-full ${product.isModel ? 'object-contain p-4' : 'object-cover'}`}
                    />
                    {!product.isModel && (
                      <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <FiShoppingCart className="w-4 h-4 text-gray-700" />
                      </button>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                      {product.name}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-red-600 text-base font-bold">{product.price.toLocaleString()} FCFA</span>
                      {product.isModel && <span className="text-xs text-gray-500 ml-auto">Sur mesure</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 md:px-10 md:py-4 text-sm md:text-base font-semibold tracking-wider hover:bg-gray-800 transition-colors"
            >
              VOIR TOUS LES PRODUITS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;