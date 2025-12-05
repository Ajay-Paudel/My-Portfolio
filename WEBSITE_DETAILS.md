# Website Design & Content Specification

**Project:** Ajay Paudel Portfolio  
**Theme:** Premium, Gradient, Glassmorphism  
**Tech Stack:** React, Tailwind CSS, TypeScript

---

## 1. Visual Identity & Design Language

The website embodies a **"Modern Creative"** personality, balancing professionalism with artistic flair.

*   **Color Strategy**:
    *   **Primary Gradient**: A seamless blend of `Royal Indigo (#4F46E5)` and `Electric Violet (#9333EA)`. This is used for buttons, text gradients, and abstract backgrounds.
    *   **Background**: `Soft White (#FAFAFF)` provides a clean canvas that reduces eye strain compared to pure white.
    *   **Glassmorphism**: Panels and cards use semi-transparent white backgrounds with backdrop blur (`backdrop-filter: blur(12px)`) to create depth.

*   **Typography**:
    *   **Headings (`Poppins`)**: Bold and geometric, used for section titles and the hero name.
    *   **Body (`Inter`)**: Clean sans-serif for optimal readability.
    *   **Accents (`Space Grotesk`)**: Used for code snippets or technical tags.

*   **Animations**:
    *   **Floating Blobs**: Background elements gently move to make the site feel "alive".
    *   **Hover Lifts**: Cards translate upwards (`-translate-y-2`) with increased shadow on hover.
    *   **Scroll Reveal**: Sections fade in and move up as the user scrolls down.

---

## 2. Page-by-Page Content Breakdown

### **A. Navigation Bar**
*   **Behavior**: Fixed to top. Transparent on load, turns into a **Glass Panel** when scrolled.
*   **Links**: Home, About, Skills, Projects, Contact.
*   **Action**: A prominent "Hire Me" button.

### **B. Hero Section**
*   **Content**:
    *   Status Badge: "Available for work" (pulsing green dot).
    *   Headline: "Hello, I'm Ajay Paudel".
    *   Sub-headline: "Creating Digital Experiences That Inspire".
    *   Buttons: "View My Work" (Gradient) and "Contact Me" (Outline).
*   **Visual Feature**:
    *   Instead of a photo, the right side features a **floating 3D abstract composition**.
    *   Includes a glass card with code symbols and floating icons (🎨, 💻) to symbolize the merger of Design and Development.

### **C. About Section**
*   **Visual Feature**:
    *   **Abstract Identity Card**: A large vertical card in the left column.
    *   **Style**: Deep Indigo-Violet gradient background with a subtle dot pattern.
    *   **Elements**: A central "AP" watermark, a User icon in glass, and tags: "Creative", "Technical", "Design".
*   **Text Content**:
    *   "Passion for Creation".
    *   Bio text describing the journey from HTML to complex apps.
*   **Highlights Grid**: 4 box cards:
    *   *Creative Developer*
    *   *Problem Solver*
    *   *Fast Learner*
    *   *UI/UX Enthusiast*

### **D. Skills Section**
*   **Layout**: 3-Column Grid.
*   **Categories**:
    1.  **Frontend Development**: React, TypeScript, Tailwind, HTML/CSS.
    2.  **UI/UX Design**: Figma, Prototyping, Wireframing, User Research.
    3.  **Tools & Workflow**: Git, VS Code, Vercel, Postman.
*   **Style**: Skills are displayed as **Progress Bars** filled with the brand gradient.

### **E. Projects Section**
*   **Content**: A grid of 4 selected works (e.g., E-Commerce Dashboard, SaaS Landing Page).
*   **Card Design**:
    *   Large thumbnail image.
    *   On Hover: Image zooms slightly, and a dark overlay appears with **Live Demo** and **GitHub** circular buttons.
    *   Tech stack tags (e.g., "React", "Tailwind") listed below the description.

### **F. Contact Section**
*   **Layout**: A unified card with two panels.
*   **Left Panel (Dark)**:
    *   Background: Slate 900 with decorative blur effects.
    *   Content: Email (`hello@ajaypaudel.dev`) and Location (`Kathmandu, Nepal`).
*   **Right Panel (Light)**:
    *   **Interactive Form**: Name, Email, Message fields.
    *   **Validation**: Real-time error checking (e.g., "Name must be at least 2 characters"). shows red alert icons if invalid.

### **G. Footer**
*   **Style**: Dark Slate background.
*   **Content**: Copyright notice, Social links (GitHub, LinkedIn, Twitter), and "Made with Heart".
