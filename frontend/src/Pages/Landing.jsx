import React from "react";
import { Link } from "react-router-dom";
import { DiReact, DiNodejs, DiMongodb } from "react-icons/di";
import { SiExpress, SiTailwindcss, SiSocketdotio } from "react-icons/si";
import { VscWorkspaceTrusted } from "react-icons/vsc";

const Landing = () => {
  const techStack = [
    { icon: <DiReact className="w-12 h-12 text-blue-500" />, name: "React" },
    {
      icon: <DiNodejs className="w-12 h-12 text-green-500" />,
      name: "Node.js",
    },
    {
      icon: (
        <SiExpress className="w-12 h-12 text-gray-800 dark:text-gray-200" />
      ),
      name: "Express",
    },
    {
      icon: <DiMongodb className="w-12 h-12 text-green-700" />,
      name: "MongoDB",
    },
    {
      icon: <SiTailwindcss className="w-12 h-12 text-blue-400" />,
      name: "Tailwind CSS",
    },
    {
      icon: (
        <SiSocketdotio className="w-12 h-12 text-white bg-black rounded-full p-2" />
      ),
      name: "Socket.IO",
    },
    {
      icon: <VscWorkspaceTrusted className="w-12 h-12 text-purple-500" />,
      name: "WebContainer",
    },
    {
      icon: (
        <img src="/images/gemini.png" className="w-12 h-12 text-yellow-500" />
      ),
      name: "Google AI",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <img src="/images/logo.jpg" alt="Logo" className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DevinAI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all 
              shadow-lg hover:shadow-blue-500/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Collaborative AI-Powered Development
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Build, test, and deploy applications in real-time with AI assistance
            and team collaboration.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all 
              shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
            >
              <VscWorkspaceTrusted />
              Start Creating
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powered By Modern Technology
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  {tech.icon}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 justify-center items-center">
            <div className="space-y-8">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <SiSocketdotio className="text-blue-500" />
                  Real-Time Collaboration
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Work simultaneously with your team using live code editing,
                  chat, and shared terminals.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <img
                    src='/images/gemini.png'
                    alt="AI Logo"
                    className="w-8 h-8 object-contain"
                  />
                  AI Code Generation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate boilerplate code, fix errors, and get suggestions
                  through natural language prompts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <VscWorkspaceTrusted className="text-blue-500 text-xl" />
              <span className="font-medium">DevinAI</span>
            </div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
