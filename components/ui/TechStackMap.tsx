import React from 'react';
import { Code2, Palette, Zap, Globe, Terminal, FileCode, GitBranch, PenTool, Cpu } from 'lucide-react';

const technologies = [
  { icon: Code2, name: 'React', color: 'text-blue-400', orbit: 'orbit-1' },
  { icon: Zap, name: 'Next.js', color: 'text-slate-800 dark:text-slate-200', orbit: 'orbit-1' },
  { icon: Globe, name: 'HTML', color: 'text-orange-500', orbit: 'orbit-2' },
  { icon: Palette, name: 'CSS', color: 'text-blue-500', orbit: 'orbit-2' },
  { icon: FileCode, name: 'JavaScript', color: 'text-yellow-500', orbit: 'orbit-2' },
  { icon: GitBranch, name: 'Git', color: 'text-red-500', orbit: 'orbit-3' },
  { icon: PenTool, name: 'Figma', color: 'text-purple-400', orbit: 'orbit-3' },
  { icon: Terminal, name: 'VS Code', color: 'text-blue-600', orbit: 'orbit-3' },
  { icon: Cpu, name: 'C', color: 'text-slate-500 dark:text-slate-400', orbit: 'orbit-1' },
];

export const TechStackMap: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-brand-light dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
      
      {/* Central Star */}
      <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-brand-indigo to-brand-violet rounded-full shadow-[0_0_40px_rgba(79,70,229,0.5)] flex items-center justify-center text-white font-bold text-xl animate-pulse-glow">
        Tech
      </div>

      {/* Orbits */}
      {[1, 2, 3].map((i) => (
        <div 
          key={i}
          className={`absolute inset-0 m-auto rounded-full border border-slate-300/30 dark:border-slate-600/20`}
          style={{ 
            width: `${i * 120 + 80}px`, 
            height: `${i * 120 + 80}px`,
            animation: `spin ${20 + i * 5}s linear infinite reverse`
          }}
        />
      ))}

      {/* Floating Icons */}
      {technologies.map((tech, idx) => {
        // Distribute icons in a semi-circle avoiding bottom area (start at -60°, spread over 300°)
        const startAngle = -60;
        const angleSpread = 300;
        const angle = startAngle + (idx / (technologies.length - 1)) * angleSpread;
        const radius = 80 + (idx % 3) * 45; // Slightly smaller radius for better fit
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <div
            key={tech.name}
            className="absolute z-20 top-1/2 left-1/2"
            style={{
              // Use transform to position relative to center, then offset by -50% to center the element itself
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
            }}
          >
            {/* Inner container for animation to avoid conflict with positioning transform */}
            <div 
              className="flex flex-col items-center group cursor-pointer"
              style={{ animation: `float ${3 + (idx % 2)}s ease-in-out infinite` }}
            >
              <div className={`p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-125 transition-transform duration-300 ${tech.color}`}>
                <tech.icon className="w-6 h-6" />
              </div>
              <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity absolute top-full whitespace-nowrap bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-md pointer-events-none">
                {tech.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};