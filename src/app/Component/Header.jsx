import React from 'react';

function Header() {
  return (
    <header className="container mx-auto flex justify-between items-center px-6 py-4 bg-black text-white">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center">
          <span className="text-3xl font-extrabold">AJAY</span>
          <span className="text-3xl font-extrabold text-orange-500">FRONTEND</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        <a href="#home" className="hover:text-orange-500 transition">Home</a>
        <a href="#about" className="hover:text-orange-500 transition">About Me</a>
        <a href="#services" className="hover:text-orange-500 transition">Services</a>
        <a href="#projects" className="hover:text-orange-500 transition">Projects</a>
        <a href="#contact" className="hover:text-orange-500 transition">Contact</a>
      </nav>

      {/* Download CV Button */}
      <div>
        <a
          href="Ajay_CV.pdf"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-semibold text-sm transition"
          download
        >
          Download CV
        </a>
      </div>
    </header>
  );
}

export default Header;
