import React from 'react';
import Head from 'next/head';

function Page() {
  return (
    <>
      <Head>
        <title>Ajay Paudel - Web Developer Portfolio</title>
        <meta name="description" content="Ajay Paudel's web developer portfolio showcasing skills in React, Next.js, and Tailwind CSS." />
      </Head>

      {/* Background Gradient */}
      <main className="bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 py-20 text-white">
        {/* About Section */}
        <section id="about" className="text-center py-12 px-6">
          <h2 className="text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Hello! I am Ajay Paudel, a passionate web developer specializing in creating fast, responsive websites using modern technologies like <span className="font-semibold">React</span>, <span className="font-semibold">Next.js</span>, and <span className="font-semibold">Tailwind CSS</span>. I love building intuitive, user-friendly web applications.
          </p>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-12 px-6 bg-white text-gray-900">
          <h2 className="text-4xl font-semibold text-center mb-8">My Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold">Project 1</h3>
              <p className="mt-2 text-gray-700">This is a brief description of project 1, where I built an interactive web application.</p>
            </div>
            {/* Project 2 */}
            <div className="bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold">Project 2</h3>
              <p className="mt-2 text-gray-700">This is a brief description of project 2, where I developed a custom WordPress theme with responsive design.</p>
            </div>
            {/* Project 3 */}
            <div className="bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold">Project 3</h3>
              <p className="mt-2 text-gray-700">This is a brief description of project 3, where I used React to build a dynamic web application.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="text-center py-12 px-6 bg-gray-100">
          <h2 className="text-4xl font-semibold mb-4 text-gray-800">Contact Me</h2>
          <p className="text-xl mb-6 text-gray-700">You can reach me via email or through my social media links below:</p>
          <p className="text-xl text-black">
            Email: <a href="mailto:paudelajay525@gmail.com" className="text-blue-500 hover:underline">paudelajay525@gmail.com</a>
          </p>
        </section>
      </main>
    </>
  );
}

export default Page;
