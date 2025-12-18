import { FC } from "react";
import { motion } from "framer-motion";
import { FiAward, FiTruck, FiShield } from "react-icons/fi";
import boutiqueImage from "../assets/boutique.jpeg";
import { Link } from "react-router-dom";

const About: FC = () => {
  const values = [
    {
      icon: FiAward,
      title: "L'Excellence",
      description: "Chaque pièce est le fruit d'une recherche rigoureuse de la perfection, alliant savoir-faire traditionnel et design contemporain.",
      delay: 0
    },
    {
      icon: FiTruck,
      title: "Le Service",
      description: "Une expérience client sans compromis, de la commande à la livraison, pensée pour votre tranquillité d'esprit.",
      delay: 0.2
    },
    {
      icon: FiShield,
      title: "La Confiance",
      description: "La transparence et l'intégrité sont au cœur de notre démarche. Nous nous engageons à vous offrir le meilleur.",
      delay: 0.4
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              À Propos de HAR DESIGN
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg lg:text-xl text-gray-300"
            >
              HAR DESIGN n'est pas seulement une marque de vêtements. C'est une vision, une esthétique, une promesse de qualité pour ceux qui ne font aucun compromis.
            </motion.p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mb-32"></div>
      </div>

      {/* Manifesto Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <img 
                  src={boutiqueImage} 
                  alt="Atelier HAR DESIGN" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gray-50 -z-10 hidden md:block"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-8 leading-tight">
                "Nous croyons que le style est la forme la plus pure de l'expression personnelle."
              </h2>
              <div className="space-y-6 text-gray-600 text-lg font-light leading-relaxed">
                <p>
                  Fondée à Niamey, HAR DESIGN est née d'une ambition simple : redéfinir les standards de la mode locale en y insufflant une touche de modernité internationale.
                </p>
                <p>
                  Notre atelier est un lieu de création où chaque tissu est touché, chaque coupe est étudiée, et chaque détail est validé. Nous ne vendons pas simplement des vêtements, nous proposons une allure.
                </p>
                <p>
                  Que ce soit pour nos collections de prêt-à-porter ou nos créations sur mesure, notre engagement reste le même : vous sublimer.
                </p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 flex gap-12">
                <div>
                  <span className="block text-3xl font-serif font-bold text-black mb-1">500+</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wider">Clients Satisfaits</span>
                </div>
                <div>
                  <span className="block text-3xl font-serif font-bold text-black mb-1">50+</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wider">Créations Uniques</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">Nos Piliers</h2>
            <p className="text-gray-500 font-light text-lg">
              Ce qui guide chacune de nos décisions et façonne chacune de nos créations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: value.delay }}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto bg-white border border-gray-100 rounded-full flex items-center justify-center mb-8 group-hover:border-black transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-gray-400 group-hover:text-black transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-500 font-light leading-relaxed px-4">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img src="/images/boutique_1.jpeg" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-medium text-white mb-8">
            Votre Style, Notre Signature
          </h2>
          <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto">
            Découvrez nos dernières créations et laissez-vous séduire par l'excellence.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-black px-12 py-4 text-sm font-bold tracking-[0.2em] hover:bg-gray-200 transition-colors uppercase"
          >
            Explorer la Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
