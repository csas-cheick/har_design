import { FC } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: FC = () => {
  // Remplacez par votre numéro de téléphone (avec le code pays, sans + ni 00)
  // Exemple: 22790000000 pour le Niger
  const phoneNumber = "22780896022"; 
  const message = "Bonjour, je suis intéressé par vos produits.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 group"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <span className="absolute w-full h-full bg-green-500 rounded-full opacity-75 animate-ping"></span>
      <FaWhatsapp className="w-8 h-8 relative z-10" />
      
      {/* Tooltip on hover - hidden on mobile */}
      <span className="hidden md:block absolute right-full mr-3 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Discutez avec nous
      </span>
    </a>
  );
};

export default WhatsAppButton;
