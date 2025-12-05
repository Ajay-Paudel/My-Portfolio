import React from 'react';
import { Section } from '../ui/Section';
import { SKILL_CATEGORIES } from '../../constants';
import { TechStackMap } from '../ui/TechStackMap';
import { CodeTerminal } from '../ui/CodeTerminal';

export const Skills: React.FC = () => {
  return (
    <Section id="skills" className="bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="text-center mb-16">
        <h2 className="text-brand-indigo dark:text-brand-accent font-semibold tracking-wider uppercase text-sm mb-2">My Expertise</h2>
        <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white">
          Tools & <span className="text-gradient">Technologies</span>
        </h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Visual Tech Map */}
        <div className="flex flex-col space-y-4">
           <h4 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-4 text-center lg:text-left">Tech Galaxy</h4>
           <TechStackMap />
           <p className="text-sm text-slate-500 dark:text-slate-400 text-center italic mt-2">
             A visual representation of my core technical stack.
           </p>
        </div>

        {/* Interactive Terminal */}
        <div className="flex flex-col space-y-4">
           <h4 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-4 text-center lg:text-left">Interactive Terminal</h4>
           <CodeTerminal />
           <p className="text-sm text-slate-500 dark:text-slate-400 text-center italic mt-2">
             Try typing <span className="text-brand-indigo dark:text-brand-accent font-mono">help</span> to explore via CLI.
           </p>
        </div>
      </div>

      {/* Traditional List */}
      <div className="grid md:grid-cols-3 gap-8">
        {SKILL_CATEGORIES.map((category, idx) => (
          <div key={idx} className="bg-brand-light dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 hover:border-brand-indigo/20 dark:hover:border-brand-accent/20 transition-all duration-300 hover:-translate-y-1">
            <h4 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
              {category.title}
            </h4>
            <div className="space-y-6">
              {category.skills.map((skill, sIdx) => (
                <div key={sIdx}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                    <span className="text-xs font-semibold text-brand-indigo dark:text-brand-accent">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-indigo to-brand-violet rounded-full relative overflow-hidden"
                      style={{ width: `${skill.level}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};