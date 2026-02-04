import { FC, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag, FiHeart, FiShare2, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  stock?: number;
  isModel?: boolean;
}

const ProductDetail: FC = () => {
  const { id, type } = useParams<{ id: string; type?: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Déterminer la collection en fonction du type
        const collectionName = type === "couture" ? "couture_models" : "products";
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            name: data.name,
            price: data.price,
            image: data.image,
            category: data.category || (type === "couture" ? "Couture" : ""),
            description: data.description || "",
            stock: data.stock,
            isModel: type === "couture"
          });
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, type]);

  const handleAddToCart = () => {
    if (!product || product.isModel) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Découvrez ${product?.name} sur HAR DESIGN`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
        <Link
          to="/shop"
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <FiArrowLeft />
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline">Retour</span>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Partager"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Ajouter aux favoris"
              >
                <FiHeart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full ${product.isModel ? 'object-contain p-8' : 'object-cover'}`}
              />
            </div>
            {/* Badges */}
            {product.isModel && (
              <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                Sur Mesure
              </span>
            )}
            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && !product.isModel && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                Plus que {product.stock} !
              </span>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Category */}
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-xl md:text-2xl text-gray-900 mb-6">
              {formatPrice(product.price)} <span className="text-base text-gray-500">FCFA</span>
            </p>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock info */}
            {!product.isModel && product.stock !== undefined && (
              <div className="mb-6">
                <span className={`inline-flex items-center gap-2 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
                </span>
              </div>
            )}

            {/* Quantity & Add to cart */}
            {!product.isModel ? (
              <div className="space-y-4">
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Quantité</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                    addedToCart
                      ? 'bg-green-600'
                      : product.stock === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 active:scale-[0.98]'
                  }`}
                >
                  <FiShoppingBag className="w-5 h-5" />
                  {addedToCart ? 'Ajouté au panier !' : product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                </button>

                {/* Total */}
                <p className="text-center text-gray-500 text-sm">
                  Total: <span className="font-semibold text-gray-900">{formatPrice(product.price * quantity)} FCFA</span>
                </p>
              </div>
            ) : (
              /* Sur Mesure - Contact */
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Commande sur mesure</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Ce modèle est réalisé sur mesure. Contactez-nous pour passer commande et prendre vos mesures.
                  </p>
                  <Link
                    to="/contact"
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            )}

            {/* Additional info */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Livraison</h4>
                  <p className="text-sm text-gray-500">Livraison disponible à Niamey et environs</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Qualité garantie</h4>
                  <p className="text-sm text-gray-500">Tous nos produits sont soigneusement sélectionnés</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
