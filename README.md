# 🚀 Ajay Paudel - Portfolio

A modern, interactive portfolio website built with React, TypeScript, and Vite. Features a stunning UI with dark mode, AI-powered chat assistant, interactive terminal, and seamless contact form with email integration.

## ✨ Features

- **🎨 Modern UI/UX** - Glass-morphism design with smooth animations
- **🌙 Dark/Light Mode** - Toggle between themes with persistence
- **🤖 AI Chat Assistant** - Powered by OpenRouter API
- **💻 Interactive Terminal** - Fun terminal with commands and games
- **📧 Contact Form** - Email integration with Nodemailer (Vercel) or mailto fallback
- **🎯 Tech Stack Galaxy** - Interactive visualization of skills
- **📄 Resume Preview** - PDF preview modal with download option
- **📱 Fully Responsive** - Works on all devices
- **⚡ Fast Performance** - Built with Vite for optimal speed

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** OpenRouter API
- **Email:** Nodemailer (for Vercel deployment)
- **Deployment:** Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ajay-Paudel/my-portfolio.git
   cd my-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Update the values in `.env.local`:

   ```env
   # OpenRouter API (for AI Chat)
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_MODEL=your_preferred_model

   # Email Configuration (for Vercel deployment)
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_APP_PASSWORD=your_16_char_app_password
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Visit [http://localhost:5173](http://localhost:5173)

## 📧 Email Configuration (Gmail)

To enable the contact form email functionality on Vercel:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Search for "App passwords" in Google Account settings
4. Create a new app password for "Mail"
5. Copy the 16-character password
6. Add to your environment variables:
   - `EMAIL_USER` - Your Gmail address
   - `EMAIL_APP_PASSWORD` - The 16-character app password

> **Note:** Locally, the contact form falls back to `mailto:` which opens your email client.

## 🤖 AI Chat Configuration

The AI chat assistant uses [OpenRouter](https://openrouter.ai/):

1. Create an account at [OpenRouter](https://openrouter.ai/)
2. Generate an API key
3. Add to your environment variables:
   - `OPENROUTER_API_KEY` - Your API key
   - `OPENROUTER_MODEL` - Model name (e.g., `amazon/nova-2-lite-v1:free`)

## 📁 Project Structure

```
├── api/
│   └── send-email.ts      # Vercel serverless function for emails
├── components/
│   ├── Layout/
│   │   ├── Navbar.tsx     # Navigation with resume dropdown
│   │   └── Footer.tsx     # Footer component
│   ├── Sections/
│   │   ├── Hero.tsx       # Landing section with parallax
│   │   ├── About.tsx      # About me section
│   │   ├── Skills.tsx     # Skills with tech galaxy
│   │   ├── Projects.tsx   # Project showcase
│   │   └── Contact.tsx    # Contact form
│   └── ui/
│       ├── ChatWidget.tsx # AI chat assistant
│       ├── CodeTerminal.tsx # Interactive terminal
│       ├── TechStackMap.tsx # Skills visualization
│       ├── ResumeModal.tsx  # Resume preview/download
│       └── ScrollToTop.tsx  # Scroll button
├── hooks/
│   ├── useTheme.ts        # Theme management
│   └── useSound.ts        # Sound effects
├── constants.ts           # App configuration
├── types.ts              # TypeScript types
└── App.tsx               # Main app component
```

## 🎨 Customization

### Personal Information

Edit `constants.ts` to update:

- Name, tagline, and bio
- Social links (GitHub, LinkedIn, Facebook)
- Resume URL
- Projects list
- Skills and experience

### Colors & Theme

Modify `index.html` for Tailwind theme colors:

- `brand-indigo` - Primary color
- `brand-violet` - Accent color
- `brand-accent` - Dark mode accent

### Projects

Add your projects in `constants.ts`:

```typescript
export const PROJECTS = [
  {
    id: 1,
    title: "Project Name",
    description: "Project description...",
    tags: ["React", "TypeScript"],
    imageUrl: "image/project.png",
    liveUrl: "https://project-url.com",
    githubUrl: "https://github.com/username/project",
  },
];
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL`
   - `EMAIL_USER`
   - `EMAIL_APP_PASSWORD`
4. Deploy!

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## 📝 Available Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Ajay Paudel**

- GitHub: [@Ajay-Paudel](https://github.com/Ajay-Paudel)
- LinkedIn: [paudelajay](https://www.linkedin.com/in/paudelajay/)
- Email: ajayindrapaudel@gmail.com

---

<div align="center">
  <p>⭐ Star this repo if you find it helpful!</p>
  <p>Made with ❤️ by Ajay Paudel</p>
</div>
