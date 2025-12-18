import { FC, useState, useEffect } from "react";
import { FiFacebook, FiInstagram, FiArrowRight, FiScissors, FiAward, FiTruck } from "react-icons/fi";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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
  const [regularProducts, setRegularProducts] = useState<Product[]>([]);
  const [coutureModels, setCoutureModels] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch more products for the showcase
    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(12));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isModel: false
      })) as Product[];
      setRegularProducts(data);
      setLoading(false);
    });

    const qModels = query(collection(db, "couture_models"), limit(6));
    const unsubscribeModels = onSnapshot(qModels, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        category: "Couture",
        isModel: true
      })) as Product[];
      setCoutureModels(data);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeModels();
    };
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-[90vh]">
        <div className="container mx-auto px-6 h-full">
          <div className="grid md:grid-cols-2 gap-12 items-start md:items-center min-h-[90vh] pt-8 md:pt-0">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 z-10"
            >
              <div className="space-y-4">
                <p className="text-red-400 uppercase tracking-widest text-sm font-semibold">
                  BIENVENU SUR HAR DESIGN
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  L'Élégance <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                    Redéfinie
                  </span>
                </h1>
                <p className="text-gray-300 text-base md:text-lg max-w-lg leading-relaxed">
                  Une fusion parfaite entre tradition et modernité. Découvrez des créations uniques qui subliment votre style.
                </p>
              </div>
              
              <Link
                to="/shop"
                className="inline-flex items-center bg-white text-black px-8 py-4 text-sm md:text-base font-semibold tracking-wider hover:bg-gray-100 transition-all transform hover:scale-105 group"
              >
                EXPLORER LA COLLECTION
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[500px] md:h-[500px] bg-gradient-to-tr from-gray-800 to-transparent rounded-full opacity-20 blur-3xl"></div>
              <div className="relative z-10 flex justify-center">
                <img 
                  src={heroImage} 
                  alt="HAR DESIGN Collection" 
                  className="w-3/4 md:w-full max-w-md h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>

          {/* Social Icons */}
          <div className="absolute left-6 bottom-12 flex space-x-6 z-20">
            {[
              { icon: FiFacebook, href: "#" },
              { icon: FaTiktok, href: "#" },
              { icon: FaWhatsapp, href: "#" },
              { icon: FiInstagram, href: "#" }
            ].map((social, index) => (
              <a 
                key={index}
                href={social.href} 
                className="text-gray-400 hover:text-white transition-colors transform hover:-translate-y-1"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-black text-white py-6 overflow-hidden border-t border-gray-800">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xl md:text-2xl font-light tracking-[0.2em] mx-8">
              HAR DESIGN • NOUVELLE COLLECTION • ÉLÉGANCE • NIAMEY • LUXE • 
            </span>
          ))}
        </motion.div>
      </div>

      {/* Editorial Section - L'Art du Détail */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <span className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4 block">Notre Philosophie</span>
              <h2 className="text-4xl md:text-6xl font-serif font-medium mb-8 leading-tight text-gray-900">
                L'Art du <br/>
                <span className="italic font-light">Détail</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                Chaque pièce raconte une histoire. Nos créations sur mesure sont le fruit d'un savoir-faire artisanal d'exception, alliant traditions nigériennes et design contemporain. Nous ne créons pas seulement des vêtements, nous sculptons votre élégance.
              </p>
              <Link 
                to="/shop" 
                className="inline-block border-b border-black pb-1 text-black hover:text-gray-600 hover:border-gray-600 transition-all tracking-widest text-sm"
              >
                DÉCOUVRIR L'ATELIER
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 relative h-[600px] w-full"
            >
              <div className="absolute inset-0 bg-gray-100">
                {coutureModels.length > 0 ? (
                  <img 
                    src={coutureModels[0].image} 
                    alt="Couture Model" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    Chargement...
                  </div>
                )}
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl max-w-xs hidden md:block">
                <p className="font-serif text-xl italic text-gray-900">"L'élégance est la seule beauté qui ne se fane jamais."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Minimalist Product Grid - Sélection Exclusive */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <h3 className="text-2xl font-light uppercase tracking-[0.3em] text-center mb-4">Sélection Exclusive</h3>
            <div className="w-12 h-0.5 bg-black"></div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              speed={1000}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full !pb-12"
            >
              {regularProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-gray-200">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
                      
                      {/* Hover Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Link 
                          to="/shop"
                          className="bg-white text-black px-8 py-3 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-500"
                        >
                          VOIR LE PRODUIT
                        </Link>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <h4 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-gray-500 font-light tracking-wide">
                        {product.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          
          <div className="text-center mt-16">
            <Link 
              to="/shop" 
              className="inline-block border border-black px-10 py-4 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition-all duration-300"
            >
              TOUTE LA COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* Categories / Large Visuals */}
      <section className="grid md:grid-cols-2 h-[70vh] min-h-[500px]">
        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-gray-900">
            {coutureModels[1] && (
              <img 
                src={coutureModels[1].image} 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" 
                alt="Sur Mesure"
              />
            )}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
            <h3 className="text-3xl md:text-5xl font-serif italic mb-4 transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">Sur Mesure</h3>
            <p className="max-w-md text-gray-200 mb-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
              Des créations uniques adaptées à votre morphologie et à vos envies.
            </p>
            <Link to="/shop" className="border-b border-white pb-1 tracking-widest text-sm hover:text-gray-300 hover:border-gray-300 transition-colors">
              EXPLORER
            </Link>
          </div>
        </div>
        
        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-gray-800">
            {regularProducts[3] && (
              <img 
                src={regularProducts[3].image} 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" 
                alt="Prêt-à-porter"
              />
            )}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
            <h3 className="text-3xl md:text-5xl font-serif italic mb-4 transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">Prêt-à-porter</h3>
            <p className="max-w-md text-gray-200 mb-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
              Une collection tendance disponible immédiatement pour votre style quotidien.
            </p>
            <Link to="/shop" className="border-b border-white pb-1 tracking-widest text-sm hover:text-gray-300 hover:border-gray-300 transition-colors">
              DÉCOUVRIR
            </Link>
          </div>
        </div>
      </section>

      {/* Services / Brand Promise */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiScissors className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest">Sur Mesure</h3>
              <p className="text-gray-500 font-light leading-relaxed max-w-xs mx-auto">
                Une coupe parfaite adaptée à votre silhouette. Chaque vêtement est ajusté avec précision.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiAward className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest">Qualité Premium</h3>
              <p className="text-gray-500 font-light leading-relaxed max-w-xs mx-auto">
                Des tissus d'exception sélectionnés avec soin pour leur durabilité et leur élégance.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTruck className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest">Livraison Rapide</h3>
              <p className="text-gray-500 font-light leading-relaxed max-w-xs mx-auto">
                Expédition soignée partout au Niger et à l'international.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;