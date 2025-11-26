import { FC } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-4 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
          {/* Left - Designed by */}
          <div className="text-gray-400">
            <p>Conçu par <span className="text-white font-medium"><a href="https://csascheick.vercel.app/" target="_blank" rel="noopener noreferrer">csas_cheick</a></span></p>
          </div>

          {/* Center - Copyright */}
          <div className="text-gray-400">
            <p>Copyright © {currentYear} HAR DESIGN. Tous droits réservés.</p>
          </div>

          {/* Right - Social Icons */}
          <div className="flex gap-4">
            <a
              href="https://github.com/csas-cheick"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <FaGithub className="text-lg" />
            </a>
            <a
              href="https://www.linkedin.com/in/csas-cheick"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <FaLinkedin className="text-lg" />
            </a>
            <a
              href="https://www.instagram.com/csas_cheick"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <FaInstagram className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
