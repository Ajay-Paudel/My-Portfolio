import React from 'react';
import { Section } from '../ui/Section';
import { HIGHLIGHTS } from '../../constants';
import { User } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

export const About: React.FC = () => {
  const { playHover } = useSound();

  return (
    <Section id="about" className="bg-brand-light dark:bg-slate-950">
      <div className="text-center mb-16">
        <h2 className="text-brand-indigo dark:text-brand-accent font-semibold tracking-wider uppercase text-sm mb-2">About Me</h2>
        <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white">
          Passion for <span className="text-gradient">Creation</span>
        </h3>
      </div>

      <div className="grid md:grid-cols-12 gap-12 items-center">
        {/* Abstract Profile Card */}
        <div className="md:col-span-5 relative">
          <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-indigo to-brand-violet group">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-[20%] left-[-20%] w-60 h-60 bg-brand-accent/30 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-700"></div>
            
            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.4)_1px,transparent_0)] bg-[length:32px_32px]"></div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              {/* Top Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <User className="w-8 h-8 text-white" />
              </div>

              {/* Large Monogram Background */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                 <span className="text-[15rem] font-heading font-bold text-white opacity-[0.03] select-none">AP</span>
              </div>

              {/* Bottom Info */}
              <div className="relative z-10">
                <div className="h-1 w-12 bg-brand-accent rounded-full mb-6"></div>
                <h3 className="font-heading font-bold text-3xl text-white mb-2 tracking-tight">Ajay Paudel</h3>
                <p className="text-white/80 font-medium tracking-wide">Frontend & UI/UX Designer</p>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white/90">Creative</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white/90">Technical</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white/90">Design</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Border Element behind */}
          <div className="absolute -z-10 -top-4 -right-4 w-full h-full border-2 border-brand-indigo/30 dark:border-brand-accent/20 rounded-2xl"></div>
        </div>

        {/* Content */}
        <div className="md:col-span-7 space-y-8">
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            <p>
              I am a dedicated developer with a keen eye for detail and a strong drive to build software that matters. My journey started with simple HTML pages and has evolved into building complex, scalable web applications using the latest technologies.
            </p>
            <p>
              I believe that great code is not just about function—it's about clarity, maintainability, and the experience it creates for the end user. When I'm not coding, I'm exploring new design trends or contributing to open-source projects.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            {HIGHLIGHTS.map((highlight, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
                onMouseEnter={playHover}
              >
                <div className="w-12 h-12 rounded-lg bg-brand-indigo/5 dark:bg-brand-accent/10 text-brand-indigo dark:text-brand-accent flex items-center justify-center mb-4 group-hover:bg-brand-indigo group-hover:text-white dark:group-hover:bg-brand-accent dark:group-hover:text-slate-900 transition-colors duration-300">
                  <highlight.icon className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-2">{highlight.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};