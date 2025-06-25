import { useState } from "react";
import { FaBook, FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className={`w-full py-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} shadow-md`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaBook className="text-blue-500" /> LearnAura
          </h1>

          {/* Navbar links (Hidden on mobile) */}
          <ul className={`md:flex md:items-center space-x-6 absolute md:static top-16 left-0 w-full bg-white md:bg-transparent shadow-md md:shadow-none md:w-auto px-6 md:px-0 ${isOpen ? "block" : "hidden"}`}>
            <li><a href="/" className="hover:text-blue-500">Home</a></li>
            <li><a href="/about" className="hover:text-blue-500">About</a></li>
            <li><a href="/services" className="hover:text-blue-500">Services</a></li>
            {/* <li><a href="contact.html" className="hover:text-blue-500">Contact</a></li> */}
          </ul>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Dark Mode Toggle */}
          <button className="ml-4 text-2xl" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </nav>
      </div>
    </header>
  );
}
