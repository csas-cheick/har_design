import { FC } from "react";
import { FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

const Contact: FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300">
              Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mb-32"></div>
      </div>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Email */}
              <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FiMail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <a href="mailto:contact@hardesign.com" className="text-gray-600 hover:text-black transition-colors">
                  contact@hardesign.com
                </a>
              </div>

              {/* Téléphone */}
              <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FiPhone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Téléphone</h3>
                <a href="tel:+33123456789" className="text-gray-600 hover:text-black transition-colors">
                  +33 1 23 45 67 89
                </a>
              </div>

              {/* Adresse */}
              <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FiMapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Adresse</h3>
                <p className="text-gray-600">
                  123 Rue de la Mode<br />
                  75001 Niamey, Niger
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Retrouvez-nous sur
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-12">
              Suivez-nous sur nos réseaux sociaux pour découvrir nos dernières collections et actualités
            </p>

            {/* Social Icons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FiFacebook className="w-8 h-8 text-white" />
                </div>
                <span className="text-gray-900 font-medium">Facebook</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FiInstagram className="w-8 h-8 text-white" />
                </div>
                <span className="text-gray-900 font-medium">Instagram</span>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/33123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaWhatsapp className="w-8 h-8 text-white" />
                </div>
                <span className="text-gray-900 font-medium">WhatsApp</span>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaTiktok className="w-8 h-8 text-white" />
                </div>
                <span className="text-gray-900 font-medium">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Envoyez-nous un message
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Vous avez une question ? N'hésitez pas à nous écrire
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-900 font-medium mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-900 font-medium mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-900 font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white px-8 py-4 font-semibold tracking-wider hover:bg-gray-800 transition-colors"
              >
                ENVOYER LE MESSAGE
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
