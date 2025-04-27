"use client"
import React from 'react';

function Footer() {
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Me', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleScrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1D1D1D] text-white pt-16 pb-6 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Name */}
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-extrabold tracking-widest text-gray-300">
            AJAY<span className="text-orange-500">FRONTEND</span>
          </h2>
          <span className="text-sm text-gray-400 font-semibold">DEVELOPER</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 text-white mt-8 mb-6">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection(link.href.replace('#', ''));
              }}
              className="hover:text-orange-500 transition"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 text-xl mb-8">
          <a
            href="https://www.facebook.com/AjayPaudel666"
            className="hover:text-orange-500 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/facebook.svg" alt="Facebook" />
          </a>
          <a
            href="https://www.instagram.com/ajaypaudel12/"
            className="hover:text-orange-500 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/instagram.svg" alt="Instagram" />
          </a>
          <a
            href="https://www.linkedin.com/in/paudelajay/"
            className="hover:text-orange-500 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/linkedin.svg" alt="LinkedIn" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} <span className="text-orange-500 font-semibold">Ajay Paudel</span> All Rights Reserved, Inc.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
