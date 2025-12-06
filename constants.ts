import { Code2, Palette, Zap, Brain, Rocket, Globe, Database, Smartphone } from 'lucide-react';
import { Project, SkillCategory, Highlight, NavLink } from './types';

// OpenRouter Configuration - loaded from environment variables
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'amazon/nova-2-lite-v1:free';

// Firebase Configuration - for Visitor Counter
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const BRAND_NAME = "Ajay Paudel";
export const TAGLINE = "Creating Digital Experiences That Inspire";
export const RESUME_URL = "/image/MY_CV.pdf";
export const GITHUB_URL = "https://github.com/Ajay-Paudel";
export const LINKEDIN_URL = "https://www.linkedin.com/in/paudelajay/";
export const FACEBOOK_URL = "https://www.facebook.com/AjayPaudel666";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const HIGHLIGHTS: Highlight[] = [
  {
    icon: Code2,
    title: "Creative Developer",
    description: "Blending code with artistic vision to build unique web experiences.",
  },
  {
    icon: Zap,
    title: "Problem Solver",
    description: "Turning complex requirements into simple, elegant technical solutions.",
  },
  {
    icon: Rocket,
    title: "Fast Learner",
    description: "Constantly adapting to the latest technologies and frameworks.",
  },
  {
    icon: Palette,
    title: "UI/UX Enthusiast",
    description: "Deeply caring about the user journey and visual aesthetics.",
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "C", level: 80 },
    ],
  },
  {
    title: "Web Development",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 92 },
      { name: "HTML", level: 98 },
      { name: "CSS", level: 95 },
      { name: "JavaScript", level: 90 },
    ],
  },
  {
    title: "Tools & Frameworks",
    skills: [
      { name: "Git", level: 88 },
      { name: "Figma", level: 90 },
      { name: "VS Code", level: 95 },
      { name: "Next.js", level: 92 },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "My Shop",
    description: "A fully responsive e-commerce platform built with Next.js, featuring dynamic product listings integrated via FakeStoreAPI.",
    tags: ["Next.js", "FakeStoreAPI", "Responsive Design"],
    imageUrl: "image/e-commerce.png",
    liveUrl: "https://my-shop-green-theta.vercel.app/",
    githubUrl: "https://github.com/Ajay-Paudel/My-Shop",
  },
  {
    id: 2,
    title: "News Portal",
    description: "A real-time news aggregation application using Next.js. Features an intuitive UI/UX for seamless readability and fetching data from BankingKhabar.",
    tags: ["Next.js", "API Integration", "UI/UX"],
    imageUrl: "image/news.png",
    liveUrl: "https://banking-khabar.vercel.app/",
    githubUrl: "https://github.com/Ajay-Paudel/BankingKhabar",
  },
  {
    id: 3,
    title: "Travel & Tour",
    description: "A mobile-first travel booking site designed with Next.js to provide an immersive and user-friendly experience for travelers.",
    tags: ["Next.js", "Mobile-First", "Travel Tech"],
    imageUrl: "image/travel.png",
    liveUrl: "https://ime-travels.vercel.app/",
    githubUrl: "https://github.com/Ajay-Paudel/IMETravels",
  },
];

// Context for the AI Assistant
export const AI_CONTEXT = `
You are an AI assistant for Ajay Paudel's portfolio website. Your goal is to be helpful, friendly, and professional.
Information about Ajay:
- Role: Frontend Developer & UI/UX Designer
- Programming Languages: C, JavaScript
- Web Development: HTML, CSS, JavaScript, React, Next.js
- Tools/Frameworks: Git, Figma, Next.js, VS Code
- Experience: Specializes in building modern, responsive, and aesthetic web applications.
- Location: Kathmandu, Nepal.
- GitHub: https://github.com/Ajay-Paudel
- Contact: ajayindrapaudel@gmail.com
- Brand Tone: Modern, clean, creative, confident.

Projects:
1. "My Shop": E-commerce platform (Next.js, FakeStoreAPI).
   - Live: https://my-shop-green-theta.vercel.app/
   - Code: https://github.com/Ajay-Paudel/My-Shop

2. "News Portal": Real-time news site (Next.js).
   - Live: https://banking-khabar.vercel.app/
   - Code: https://github.com/Ajay-Paudel/BankingKhabar

3. "Travel & Tour": Travel booking site (Next.js).
   - Live: https://ime-travels.vercel.app/
   - Code: https://github.com/Ajay-Paudel/IMETravels

If a user wants to hire Ajay, guide them to the contact section or provide the email.
Keep answers concise (under 50 words unless asked for details).
`;