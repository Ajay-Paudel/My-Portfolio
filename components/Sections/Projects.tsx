import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Section } from '../ui/Section';
import { PROJECTS, GITHUB_URL } from '../../constants';
import { useSound } from '../../hooks/useSound';

export const Projects: React.FC = () => {
  const { playHover } = useSound();

  return (
    <Section id="projects" className="bg-brand-light dark:bg-brand-dark">
      <div className="text-center mb-16">
        <h2 className="text-brand-indigo dark:text-brand-accent font-semibold tracking-wider uppercase text-sm mb-2">Portfolio</h2>
        <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white">
          Selected <span className="text-gradient">Works</span>
        </h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
        {PROJECTS.map((project) => (
          <div 
            key={project.id} 
            className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-brand-indigo/10 transition-all duration-500 hover:-translate-y-2"
            onMouseEnter={playHover}
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-brand-indigo/10 dark:bg-black/40 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center space-x-4">
                <a 
                  href={project.liveUrl} 
                  className="p-3 bg-white rounded-full text-brand-dark hover:text-brand-indigo hover:scale-110 transition-all shadow-lg"
                  title="View Live Demo"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a 
                  href={project.githubUrl} 
                  className="p-3 bg-white rounded-full text-brand-dark hover:text-brand-indigo hover:scale-110 transition-all shadow-lg"
                  title="View Code"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h4 className="font-heading font-bold text-2xl text-slate-900 dark:text-white mb-3 group-hover:text-brand-indigo dark:group-hover:text-brand-accent transition-colors">
                {project.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-brand-light dark:bg-slate-800 text-brand-indigo dark:text-brand-accent text-xs font-medium rounded-full border border-brand-indigo/10 dark:border-brand-accent/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <a 
          href={GITHUB_URL} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center text-brand-indigo dark:text-brand-accent font-medium hover:text-brand-violet transition-colors group"
        >
          View more on GitHub <ExternalLink className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </Section>
  );
};