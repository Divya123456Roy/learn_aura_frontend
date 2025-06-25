import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"> {/* Increased gap to 12 */}
          
          {/* About Us Section */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-3">About LearnAura</h2>
            <p className="text-gray-400">
              LearnAura is a Social Learning Platform designed to foster 
              collaborative learning among students and professionals.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="#facebook" className="text-blue-500"><FaFacebook size={20} /></a>
              <a href="#twitter" className="text-blue-400"><FaTwitter size={20} /></a>
              <a href="#instagram" className="text-pink-500"><FaInstagram size={20} /></a>
              <a href="#linkedin" className="text-blue-600"><FaLinkedin size={20} /></a>
            </div>
          </div>

          {/* Contact Us Section */}
          <div>
            <h6 className="text-white text-xl font-semibold mb-3">Contact Us</h6>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-gray-400 mt-1" />
                <p>Vazhithala, Thodupuzha, Idukki, Kerala</p>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-gray-400" />
                <a href="tel:+7-800-999-800" className="hover:text-white">+(21)-255-999-8888</a>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-400" />
                <a href="mailto:example@mail.com" className="hover:text-white">sccs@mail.com</a>
              </li>
            </ul>
          </div>

          {/* Useful Links Section */}
          <div>
            <h6 className="text-white text-xl font-semibold mb-3">Useful Links</h6>
            <ul className="space-y-3">
              <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
              
              {/* Add more links here if needed */}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 LearnAura. All rights reserved | Designed by{" "}
            <a href="https://w3layouts.com" className="hover:text-white">W3layouts</a>
          </p>
          <ul className="flex space-x-4 text-sm mt-4 md:mt-0">
            <li><a href="#link" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            <li><a href="#link" className="text-gray-400 hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}