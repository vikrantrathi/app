import React from "react";
import HeroSection from "../components/HeroSection";
import { useState } from "react";
const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <div className="bg-blue-700 text-white text-sm py-2 text-center">
        <p>Welcome to BitConnect - Your Appointment Management Portal</p>
      </div>

      {/* Navbar */}
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand Name */}
        <div className="md:text-3xl text-xl font-extrabold text-blue-600">BitConnect</div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-lg font-medium">
          <li>
            <a
              href="#hero"
              className="text-gray-800 hover:text-blue-500 transition duration-300"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#features"
              className="text-gray-800 hover:text-blue-500 transition duration-300"
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="text-gray-800 hover:text-blue-500 transition duration-300"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-gray-800 hover:text-blue-500 transition duration-300"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Buttons */}
        <div className="hidden md:flex space-x-4">
          <a
            href="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          >
            Register
          </a>
          <a
            href="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </a>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col space-y-4 px-6 py-4 text-lg font-medium">
            <li>
              <a
                href="#hero"
                className="text-gray-800 hover:text-blue-500 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="text-gray-800 hover:text-blue-500 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-gray-800 hover:text-blue-500 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-gray-800 hover:text-blue-500 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>

   <HeroSection/>
      {/* Hero Section
      <section
        id="hero"
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 md:py-32"
      >
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Welcome to BitConnect
            </h1>
            <p className="text-lg md:text-xl mb-8">
              The ultimate portal for students and teachers to book appointments, manage schedules,
              and foster collaboration.
            </p>
            <a
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-md text-lg font-semibold shadow-md hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </a>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://via.placeholder.com/500x400"
              alt="Hero Illustration"
              className="rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
            />
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "📅",
                title: "Appointment Booking",
                description: "Book appointments with teachers effortlessly.",
              },
              {
                icon: "⏰",
                title: "Schedule Management",
                description: "Stay on top of your meetings with schedule management.",
              },
              {
                icon: "📧",
                title: "Email Notifications",
                description: "Get notified instantly for every action or update.",
              },
              {
                icon: "🔒",
                title: "Secure Login",
                description: "Experience robust security with advanced authentication.",
              },
              {
                icon: "📊",
                title: "Insights",
                description: "Track your bookings and gain insights into your activities.",
              },
              {
                icon: "🤝",
                title: "Collaboration",
                description: "Encourage seamless collaboration between students and teachers.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition duration-300"
              >
                <div className="text-blue-600 text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">About BitConnect</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
            {/* 600*400 img  */}
              <img
                src="https://images.shiksha.com/mediadata/images/1687787632phpNV53Hq.jpeg"
                alt="About BitConnect"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="w-full md:w-1/2 text-center md:text-start">
              <p className="text-lg  text-gray-600 leading-relaxed">
                BitConnect is designed to simplify communication and appointment management between
                students and teachers. Our platform provides robust tools to ensure efficient
                collaboration, schedule tracking, and secure interactions. Whether it's booking an
                appointment or managing schedules, BitConnect streamlines your workflow like never
                before.
              </p>
              <a
                href="#features"
                className="mt-6 inline-block bg-blue-500 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
          <p className="text-lg mb-8">
            Have questions or need assistance? We're here to help you.
          </p>
          <a
            href="mailto:mca10005.23@bitmesra.ac.in"
            className="bg-white text-blue-600 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Contact Support
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-blue-600 py-6">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} BitConnect. All Rights Reserved. Designed and developed by Vikrant Rathi (MCA/10005/23).</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
