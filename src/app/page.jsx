import React from 'react';

function Page() {
  return (
    <>

      {/* Home Page */}
      <section id="home" className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Text Content */}
          <div className="flex-1">
            <p className="text-2xl">Hi I am</p>
            <h2 className="text-3xl font-bold text-orange-500 mt-1">Ajay Paudel</h2>
            <h1 className="text-6xl md:text-6xl font-extrabold mt-3 leading-tight">
              FRONTEND <br /> Developer
            </h1>
            <p className="text-gray-300 mt-6 leading-relative text-[20px] max-w-md">
              I'm a BCA graduate with a solid foundation in programming and a strong passion for front-end development.
            </p>
            <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md">
              Hire Me
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <div className="w-[400px] h-[400px] md:w-[450px] md:h-[450px] rounded-full bg-gradient-to-tr from-orange-500 to-white p-[6px]">
              <img
                src="myself.jpg"
                alt="Ajay"
                className="rounded-full w-full h-full object-cover"
              />
              <div className="flex items-center justify-center gap-4 mt-8 text-xl">
                <a href="https://www.facebook.com/AjayPaudel666"><img src="/facebook.svg" alt="Facebook" /></a>
                <a href="https://www.instagram.com/ajaypaudel12/"><img src="/instagram.svg" alt="Instagram" /></a>
                <a href="https://www.linkedin.com/in/paudelajay/"><img src="/linkedin.svg" alt="LinkedIn" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me */}
      <section id="about" className="bg-black text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-gray-300 mb-10">
          I'm Ajay Paudel, a BCA graduate with a strong foundation in programming and a deep passion for frontend development. I specialize in building clean, responsive, and user-centric websites using modern technologies like React, Next.js, and Tailwind CSS. I believe in continuous learning, paying attention to the details, and delivering high-quality web experiences that combine creativity with performance.
          </p>

          <div className="space-y-6 text-left">
            {[
              { label: 'HTML/CSS', value: 75 },
              { label: 'JavaScript', value: 70 },
              { label: 'React', value: 70 },
              { label: 'NextJS', value: 50 },
            ].map(skill => (
              <div key={skill.label}>
                <p className="font-semibold mb-1">{skill.label}</p>
                <div className="w-full h-3 bg-gray-300 rounded-full relative">
                  <div className="h-3 bg-orange-500 rounded-full" style={{ width: `${skill.value}%` }}></div>
                  <div className="absolute top-[-6px] w-5 h-5 bg-white border-4 border-orange-500 rounded-full" style={{ left: `calc(${skill.value}% - 10px)` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Services</h2>
          <p className="max-w-2xl mx-auto text-gray-300 mb-12">
            From code to performance, I offer tailored solutions to bring your digital ideas to life.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {/* Card 1 */}
            <div className="bg-white text-black rounded-xl p-6 shadow hover:shadow-md transition max-w-sm">
              <img src="/computer.svg" alt="Web Dev" className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="font-bold text-xl mb-2">Web Development</h3>
              <p className="text-sm text-gray-700">
                Building responsive, fast, and modern websites using React, Next.js.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white text-black rounded-xl p-6 shadow hover:shadow-md transition max-w-sm">
              <img src="/search.svg" alt="SEO" className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="font-bold text-xl mb-2">SEO & Performance Optimization</h3>
              <p className="text-sm text-gray-700">
                Ensuring your website is discoverable, loads fast, and ranks well on search engines.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white text-black rounded-xl p-6 shadow hover:shadow-md transition max-w-sm">
              <img src="/support.svg" alt="Support" className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="font-bold text-xl mb-2">Freelance Consulting / Tech Support</h3>
              <p className="text-sm text-gray-700">
                One-on-one consulting or ongoing tech support for startups and small businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">My Projects</h2>
          <p className="max-w-2xl mx-auto text-gray-300 mb-8">
          As a passionate frontend developer, I've worked on a variety of real-world projects that reflect my skills in design, interactivity, and performance. From travel platforms to e-commerce solutions and news portals, each project has helped me grow technically and creatively. Here's a glimpse of what I've built so far.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              {
                title: 'IME Travels',
                image: '/travel.png',
                link: 'https://ime-travels.vercel.app/',
              },
              {
                title: 'My Shop',
                image: '/e-commerce.png',
                link: 'https://my-shop-green-theta.vercel.app/',
              },
              {
                title: 'Banking Khabar',
                image: '/news.png',
                link: 'https://banking-khabar.vercel.app/',
              },
            ].map((project, idx) => (
              <a
                key={idx}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black rounded-xl overflow-hidden shadow hover:shadow-lg transition block"
              >
                <img src={project.image} alt={project.title} className="w-full h-60 object-cover" />
                <div className="p-4 text-left">
                  <p className="text-sm text-orange-500 font-semibold">Frontend</p>
                  <h3 className="font-bold text-lg mt-1">{project.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Develop Together</h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-10">
          Whether you have a startup idea or want to scale your existing project, I'm here to turn your vision into reality. With a focus on clean code, responsive design, and performance-driven development, I'll help bring your product to life—pixel by pixel, line by line.
          </p>

          <form className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full sm:w-[400px] px-4 py-3 rounded-md text-black bg-white outline-none"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition"
            >
              Contact Me
            </button>
          </form>
        </div>
      </section>

    </>
  );
}

export default Page;
