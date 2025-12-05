import React from 'react';
import { Navbar } from './components/Layout/Navbar';
import { Hero } from './components/Sections/Hero';
import { About } from './components/Sections/About';
import { Skills } from './components/Sections/Skills';
import { Projects } from './components/Sections/Projects';
import { Contact } from './components/Sections/Contact';
import { Footer } from './components/Layout/Footer';
import { CursorGlow } from './components/ui/CursorGlow';
import { ChatWidget } from './components/ui/ChatWidget';
import { ScrollToTop } from './components/ui/ScrollToTop';

function App() {
  return (
    <div className="font-sans text-brand-dark bg-brand-light dark:bg-brand-dark antialiased selection:bg-brand-indigo selection:text-white transition-colors duration-300">
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
      <ScrollToTop />
    </div>
  );
}

export default App;