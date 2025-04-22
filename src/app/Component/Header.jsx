"use client"
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <span className="text-3xl font-extrabold">AJAY</span>
            <span className="text-3xl font-extrabold text-orange-500">FRONTEND</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="#home" className="hover:text-orange-500 transition">Home</a>
          <a href="#about" className="hover:text-orange-500 transition">About Me</a>
          <a href="#services" className="hover:text-orange-500 transition">Services</a>
          <a href="#projects" className="hover:text-orange-500 transition">Projects</a>
          <a href="#contact" className="hover:text-orange-500 transition">Contact</a>
        </nav>

        {/* Download CV Button (desktop only) */}
        <div className="hidden md:flex space-x-2">
          <a
            href="Ajay_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold text-sm transition"
          >
            Preview CV
          </a>
          <a
            href="Ajay_CV.pdf"
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-semibold text-sm transition"
            download
          >
            Download CV
          </a>
        </div>


        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black px-6 pb-4 space-y-3 text-sm font-medium">
          <a href="#home" className="block hover:text-orange-500 transition">Home</a>
          <a href="#about" className="block hover:text-orange-500 transition">About Me</a>
          <a href="#services" className="block hover:text-orange-500 transition">Services</a>
          <a href="#projects" className="block hover:text-orange-500 transition">Projects</a>
          <a href="#contact" className="block hover:text-orange-500 transition">Contact</a>
          <a
            href="Ajay_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold text-sm transition"
          >
            Preview CV
          </a>

          <a
            href="Ajay_CV.pdf"
            download
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-semibold text-sm transition"
          >
            Download CV
          </a>
        </div>
      )}
    </header>
  );
}

export default Header;