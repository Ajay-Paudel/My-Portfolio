import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  containerClass?: string;
}

export const Section: React.FC<SectionProps> = ({ id, className = "", children, containerClass = "" }) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id={id} className={`py-20 md:py-28 relative overflow-hidden transition-colors duration-300 ${className}`}>
      <div 
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        } ${containerClass}`}
      >
        {children}
      </div>
    </section>
  );
};