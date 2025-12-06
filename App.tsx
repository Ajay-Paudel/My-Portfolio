import React, { Suspense, lazy } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { Hero } from './components/Sections/Hero';
import { CursorGlow } from './components/ui/CursorGlow';
import { ScrollToTop } from './components/ui/ScrollToTop';

// Lazy load below-the-fold components to improve FCP/LCP
const About = lazy(() => import('./components/Sections/About').then(module => ({ default: module.About })));
const Skills = lazy(() => import('./components/Sections/Skills').then(module => ({ default: module.Skills })));
const Projects = lazy(() => import('./components/Sections/Projects').then(module => ({ default: module.Projects })));
const Contact = lazy(() => import('./components/Sections/Contact').then(module => ({ default: module.Contact })));
const Footer = lazy(() => import('./components/Layout/Footer').then(module => ({ default: module.Footer })));
const ChatWidget = lazy(() => import('./components/ui/ChatWidget').then(module => ({ default: module.ChatWidget })));

function App() {
  return (
    <div className="font-sans text-brand-dark bg-brand-light dark:bg-brand-dark antialiased selection:bg-brand-indigo selection:text-white transition-colors duration-300">
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<div className="min-h-screen"></div>}>
          <About />
          <Skills />
          <Projects />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <ChatWidget />
      </Suspense>
      <ScrollToTop />
    </div>
  );
}

export default App;