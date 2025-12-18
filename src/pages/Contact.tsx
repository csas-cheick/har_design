import { FC, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiArrowRight } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebookF } from "react-icons/fa";

const Contact: FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Numéro WhatsApp (format international sans +)
    const phoneNumber = "22780896022";
    
    // Construction du message
    const text = `*Nouveau message de contact*\n\n` +
      `*Nom:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Sujet:* ${formData.subject}\n\n` +
      `*Message:*\n${formData.message}`;
      
    // Création de l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    
    // Ouverture dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: FiPhone,
      title: "Téléphone",
      content: "+227 80 89 60 22",
      link: "tel:+22780896022"
    },
    {
      icon: FiMail,
      title: "Email",
      content: "contact@hardesign.com",
      link: "mailto:contact@hardesign.com"
    },
    {
      icon: FiMapPin,
      title: "Adresse",
      content: "Niamey, Niger",
      link: "#"
    }
  ];

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
              Contactez-nous
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg lg:text-xl text-gray-300"
            >
              Une question ? Un projet sur mesure ? Nous sommes à votre écoute.
            </motion.p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mb-32"></div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Info & Socials */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-serif font-medium mb-8">Parlons de votre style</h2>
            <p className="text-gray-500 font-light mb-12 leading-relaxed">
              Que ce soit pour une commande personnalisée, une question sur nos collections ou simplement pour dire bonjour, notre équipe est là pour vous accompagner.
            </p>

            <div className="space-y-8 mb-16">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-1">{item.title}</h3>
                    <a href={item.link} className="text-lg text-gray-600 hover:text-black transition-colors font-serif">
                      {item.content}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Suivez-nous</h3>
              <div className="flex gap-4">
                {[
                  { icon: FaInstagram, link: "https://instagram.com" },
                  { icon: FaFacebookF, link: "https://facebook.com" },
                  { icon: FaTiktok, link: "https://tiktok.com" },
                  { icon: FaWhatsapp, link: "https://wa.me/22780896022" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 p-8 md:p-12 rounded-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500">Nom complet</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-500">Sujet</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-500">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 group"
              >
                ENVOYER LE MESSAGE
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
