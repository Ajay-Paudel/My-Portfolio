import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Download } from 'lucide-react';
import { BRAND_NAME, NAV_LINKS, RESUME_URL } from '../../constants';
import { useTheme } from '../../hooks/useTheme';
import { useSound } from '../../hooks/useSound';
import { ResumeButton } from '../ui/ResumeModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { playClick, playHover } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'glass-panel py-3 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="relative group" onMouseEnter={playHover} onClick={playClick}>
          <span className="font-heading font-bold text-2xl tracking-tight text-brand-dark dark:text-white">
            Ajay<span className="text-brand-indigo">.</span>
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-indigo to-brand-violet transition-all duration-300 group-hover:w-full"></span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-indigo dark:hover:text-brand-accent transition-colors relative group"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-indigo dark:bg-brand-accent opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100"></span>
            </a>
          ))}
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

          {/* Theme Toggle */}
          <button 
            onClick={() => { toggleTheme(); playClick(); }}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Resume Button */}
          <ResumeButton variant="navbar" />

          <a 
            href="#contact"
            className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/20"
            onClick={playClick}
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden space-x-4">
           <button 
            onClick={() => { toggleTheme(); playClick(); }}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-indigo"
            onClick={() => { setIsMenuOpen(!isMenuOpen); playClick(); }}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-panel border-t border-slate-100 dark:border-slate-800 shadow-xl p-6 flex flex-col space-y-4 animate-fade-in-up">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-brand-indigo"
              onClick={() => { setIsMenuOpen(false); playClick(); }}
            >
              {link.label}
            </a>
          ))}
          <ResumeButton variant="mobile" />
           <a 
            href="#contact"
            className="w-full text-center px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Hire Me
          </a>
        </div>
      )}
    </nav>
  );
};