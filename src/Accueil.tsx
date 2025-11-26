import { FC, useState } from "react";
import { FiFacebook, FiInstagram, FiShoppingCart } from "react-icons/fi";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import heroImage from "./assets/hero1.png";
import parfum1 from "./assets/produits/parfum1.png";
import parfum2 from "./assets/produits/parfum2.png";
import parfum3 from "./assets/produits/parfum3.png";
import parfum4 from "./assets/produits/parfum4.png";
import chaussure1 from "./assets/produits/chaussure1.png";
import chaussure2 from "./assets/produits/chaussure2.png";
import chaussure3 from "./assets/produits/chaussure3.png";
import chaussure4 from "./assets/produits/chaussure4.png";
import couture1 from "./assets/produits/couture1.png";
import couture2 from "./assets/produits/couture2.png";

const Accueil: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState("all");

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
            {/* Product 1 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={parfum1} 
                  alt="T-Shirt Classique" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  T-Shirt Classique - Coton Premium Qualité
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">15 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={parfum2} 
                  alt="Jean Slim Fit" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  Jean Slim Fit - Denim Stretch Confortable
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">35 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={parfum3} 
                  alt="Veste en Cuir" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  Veste en Cuir Véritable Premium
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">7 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={parfum4} 
                  alt="Sneakers Premium" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  Sneakers Premium Sport Confort
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">10 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Product 5 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={chaussure1} 
                  alt="Chemise Élégante" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  Chemise Élégante Business Premium
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">5 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Product 6 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={chaussure2} 
                  alt="Montre classique" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  ساعة كلاسيكية مربعة كهربائية الساعة وباج...
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">4 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Product 7 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={chaussure3} 
                  alt="Sac à Dos" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  Sac à Dos Urbain Multi-poches Design
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">2 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Product 8 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={chaussure4} 
                  alt="Pull Col Roulé" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  Pull Col Roulé Hiver Chaud Doux
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">4 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Product 9 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={couture1} 
                  alt="Ensemble sportif" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  طقم رياضي رجالي جديد يصفحل لعام 2025
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">13 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Product 10 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={couture2} 
                  alt="Produit divers" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-800 mb-2 line-clamp-2 min-h-[32px]">
                  موجة X8 رائن من الجيل الثاني شوائب الرقفف...
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-600 text-base font-bold">1 000 FCFA</span>
                </div>
              </div>
            </div>
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