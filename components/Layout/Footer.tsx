import React from 'react';
import { Github, Linkedin, Facebook, Heart } from 'lucide-react';
import { BRAND_NAME, GITHUB_URL, LINKEDIN_URL, FACEBOOK_URL } from '../../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-400 py-12 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          
          <div className="text-center md:text-left">
             <span className="font-heading font-bold text-2xl tracking-tight text-white">
              Ajay<span className="text-brand-indigo dark:text-brand-accent">.</span>
            </span>
            <p className="mt-2 text-sm">Building digital experiences that matter.</p>
          </div>

          <div className="flex space-x-6">
            <FooterIcon href={GITHUB_URL} icon={<Github className="w-5 h-5" />} />
            <FooterIcon href={LINKEDIN_URL} icon={<Linkedin className="w-5 h-5" />} />
            <FooterIcon href={FACEBOOK_URL} icon={<Facebook className="w-5 h-5" />} />
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2025 {BRAND_NAME}. All rights reserved.</p>
          <p className="flex items-center mt-4 md:mt-0">
            Made with <Heart className="w-3 h-3 text-red-500 mx-1 fill-current animate-pulse" /> using React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterIcon: React.FC<{ href: string; icon: React.ReactNode }> = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-400 hover:text-white hover:text-brand-indigo dark:hover:text-brand-accent transition-all duration-300 transform hover:scale-110"
  >
    {icon}
  </a>
);