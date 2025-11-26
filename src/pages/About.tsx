import { FC } from "react";
import { motion } from "framer-motion";
import { FiAward, FiTruck, FiShield, FiHeadphones } from "react-icons/fi";
import boutiqueImage from "../assets/boutique.jpeg";

const About: FC = () => {
  const values = [
    {
      icon: FiAward,
      title: "Qualité Premium",
      description: "Des matériaux soigneusement sélectionnés et une fabrication artisanale pour une qualité exceptionnelle.",
      delay: 0,
      x: -50,
      y: 0
    },
    {
      icon: FiTruck,
      title: "Livraison Rapide",
      description: "Expédition rapide et sécurisée pour que vous receviez vos commandes dans les meilleurs délais.",
      delay: 0.2,
      x: 0,
      y: -50
    },
    {
      icon: FiShield,
      title: "Paiement Sécurisé",
      description: "Vos transactions sont protégées avec les dernières technologies de sécurité.",
      delay: 0.4,
      x: 0,
      y: 50
    },
    {
      icon: FiHeadphones,
      title: "Support 24/7",
      description: "Notre équipe est toujours disponible pour répondre à vos questions et vous assister.",
      delay: 0.6,
      x: 50,
      y: 0
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              À Propos de HAR DESIGN
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300">
              Votre destination pour la mode et le style. Nous créons des vêtements 
              qui reflètent votre personnalité unique et votre confiance.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mb-32"></div>
      </div>

      {/* Notre Histoire */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed">
                <p>
                  Fondée avec une passion pour la mode et le design, HAR DESIGN 
                  s'engage à offrir des vêtements de qualité exceptionnelle qui 
                  allient style, confort et durabilité.
                </p>
                <p>
                  Chaque pièce de notre collection est soigneusement sélectionnée 
                  pour répondre aux attentes de nos clients les plus exigeants. 
                  Nous croyons que la mode doit être accessible à tous, tout en 
                  maintenant les plus hauts standards de qualité.
                </p>
                <p>
                  Notre mission est de vous aider à exprimer votre style personnel 
                  à travers des vêtements qui vous font sentir bien et confiant.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg shadow-xl overflow-hidden">
                <img 
                  src={boutiqueImage} 
                  alt="HAR DESIGN Boutique à Niamey" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Ce qui nous distingue et guide notre travail quotidien
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: value.x, y: value.y }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: value.delay, 
                  type: "spring", 
                  stiffness: 50,
                  damping: 15
                }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 mx-auto">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Des passionnés dédiés à votre satisfaction
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Membre 1 */}
            <div className="text-center group">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 mx-auto flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <p className="text-gray-500">Photo</p>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nom du membre
              </h3>
              <p className="text-gray-600">
                Fondateur & Designer
              </p>
            </div>

            {/* Membre 2 */}
            <div className="text-center group">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 mx-auto flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <p className="text-gray-500">Photo</p>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nom du membre
              </h3>
              <p className="text-gray-600">
                Responsable Collection
              </p>
            </div>

            {/* Membre 3 */}
            <div className="text-center group">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 mx-auto flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <p className="text-gray-500">Photo</p>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nom du membre
              </h3>
              <p className="text-gray-600">
                Service Client
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-6">
            Prêt à Découvrir Notre Collection ?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explorez notre boutique et trouvez les pièces parfaites pour votre style.
          </p>
          <a
            href="/shop"
            className="inline-block bg-white text-black px-8 py-4 font-semibold tracking-wider hover:bg-gray-100 transition-colors"
          >
            VOIR LA BOUTIQUE
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
