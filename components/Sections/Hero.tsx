import React, { useRef } from 'react';
import { ArrowDown, Github, Linkedin, Facebook } from 'lucide-react';
import { BRAND_NAME, TAGLINE, GITHUB_URL, LINKEDIN_URL, FACEBOOK_URL } from '../../constants';
import { Button } from '../ui/Button';
import { useSound } from '../../hooks/useSound';
import { ResumeButton } from '../ui/ResumeModal';

export const Hero: React.FC = () => {
  const { playClick, playHover } = useSound();
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const x = (window.innerWidth - clientX) / 50;
    const y = (window.innerHeight - clientY) / 50;
    
    const floaters = heroRef.current.querySelectorAll('.parallax');
    floaters.forEach((el) => {
      const speed = (el as HTMLElement).dataset.speed || '1';
      (el as HTMLElement).style.transform = `translate(${x * Number(speed)}px, ${y * Number(speed)}px)`;
    });
  };

  return (
    <section 
      id="hero" 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-brand-light dark:bg-brand-dark transition-colors duration-300"
    >
      {/* Background Blobs */}
      <div className="parallax absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-indigo/20 rounded-full blur-3xl animate-float -z-10" data-speed="2"></div>
      <div className="parallax absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-brand-violet/20 rounded-full blur-3xl animate-float-delayed -z-10" data-speed="-1"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="space-y-8 text-center md:text-left z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full glass-card border-brand-indigo/20 dark:border-white/10 dark:bg-white/5">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            <span className="text-xs font-medium text-brand-indigo dark:text-brand-accent uppercase tracking-wider">Available for work</span>
          </div>

          <div className="space-y-4">
            <p className="text-xl md:text-2xl font-medium text-slate-500 dark:text-slate-400">
              Hello, I'm
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {BRAND_NAME}
            </h1>
            <p className="text-xl md:text-2xl md:leading-relaxed font-light text-slate-600 dark:text-slate-300 max-w-lg mx-auto md:mx-0">
              <span className="text-gradient font-medium">{TAGLINE}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto md:mx-0 leading-relaxed">
              A creative Web Developer & UI/UX Designer crafting modern, responsive, and user-centric digital solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Button icon onClick={() => { playClick(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
              View My Work
            </Button>
            <Button variant="outline" onClick={() => { playClick(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Contact Me
            </Button>
            <div className="sm:hidden">
              <ResumeButton variant="mobile" />
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-6 pt-4">
            <SocialLink href={GITHUB_URL} icon={<Github className="w-5 h-5" />} label="GitHub" />
            <SocialLink href={LINKEDIN_URL} icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
            <SocialLink href={FACEBOOK_URL} icon={<Facebook className="w-5 h-5" />} label="Facebook" />
          </div>
        </div>

        {/* Visual Content */}
        <div className="relative hidden md:block h-full min-h-[500px]">
           {/* Abstract Composition */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <div className="parallax w-[400px] h-[500px] glass-card rounded-[40px] rotate-3 border-white/60 dark:border-white/10 shadow-2xl z-10 flex items-center justify-center overflow-hidden transition-all duration-300 hover:rotate-0 hover:scale-105" data-speed="1.5">
               {/* Gradient overlay for placeholder image effect */}
               <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-brand-violet/10 dark:from-brand-indigo/20 dark:to-brand-violet/20"></div>
             
               {/* Code Decoration */}
               <div className="absolute top-8 left-8 right-8">
                 <div className="flex space-x-2 mb-4">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 </div>
                 <div className="space-y-2 opacity-50 dark:opacity-30">
                   <div className="h-2 w-3/4 bg-slate-300 dark:bg-slate-600 rounded"></div>
                   <div className="h-2 w-1/2 bg-slate-300 dark:bg-slate-600 rounded"></div>
                   <div className="h-2 w-full bg-slate-300 dark:bg-slate-600 rounded"></div>
                   <div className="h-2 w-2/3 bg-slate-300 dark:bg-slate-600 rounded"></div>
                 </div>
               </div>
             
               {/* Center Card */}
               <div className="relative z-20 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-[200px] animate-float">
                 <div className="w-12 h-12 bg-brand-indigo rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-brand-indigo/30">
                   <span className="font-bold text-xl">Aj</span>
                 </div>
                 <div className="space-y-2">
                   <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                   <div className="h-2 w-full bg-slate-100 dark:bg-slate-600 rounded"></div>
                   <div className="h-2 w-24 bg-slate-100 dark:bg-slate-600 rounded"></div>
                 </div>
               </div>
             </div>
           </div>
           
           {/* Floating Elements */}
           <div className="parallax absolute top-20 right-10 p-4 glass-card rounded-2xl animate-float-delayed z-20" data-speed="3">
             <span className="text-2xl filter drop-shadow-md">🎨</span>
           </div>
           <div className="parallax absolute bottom-40 left-10 p-4 glass-card rounded-2xl animate-float z-20" data-speed="-2">
             <span className="text-2xl filter drop-shadow-md">💻</span>
           </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-brand-indigo/50 dark:text-brand-accent/50 cursor-pointer" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
};

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-3 text-slate-500 dark:text-slate-400 hover:text-brand-indigo dark:hover:text-brand-accent hover:bg-brand-indigo/5 dark:hover:bg-brand-indigo/10 rounded-full transition-all duration-300 border border-transparent hover:border-brand-indigo/10 dark:hover:border-brand-indigo/20 transform hover:-translate-y-1"
    aria-label={label}
  >
    {icon}
  </a>
);