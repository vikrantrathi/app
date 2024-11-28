import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const isActiveLink = (path) => location.pathname === path;

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-lg shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                <Link to="/">BitConnect</Link>
              </h1>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveLink('/') ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                Register
              </Link>
              <a
                href="#features"
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                Features
              </a>
              <a
                href="#about"
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                About Us
              </a>
              <a
                href="#contact"
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                Contact
              </a>
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleNavbar}
                className="text-blue-600 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
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
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActiveLink('/') ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-100"
              >
                Register
              </Link>
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-100"
              >
                Features
              </a>
              <a
                href="#about"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-100"
              >
                About Us
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-100"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gray-100 pt-16">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to BitConnect
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your one-stop solution for student-teacher appointment scheduling.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-800">Efficient Scheduling</h3>
              <p className="mt-4 text-sm text-gray-600">
                Book and manage appointments seamlessly.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-800">Real-time Notifications</h3>
              <p className="mt-4 text-sm text-gray-600">
                Stay updated with email and SMS alerts.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-800">User-friendly Dashboard</h3>
              <p className="mt-4 text-sm text-gray-600">
                Manage your schedule with an intuitive interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About BitConnect</h2>
          <p className="text-lg leading-8 text-gray-600">
            BitConnect bridges the gap between students and teachers by offering a robust platform
            for easy appointment scheduling. Simplify your academic journey today!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
          <p className="text-lg leading-8 text-gray-600 mb-4">
            Have questions or need support? We're here to help.
          </p>
          <a href="mailto:support@bitconnect.com" className="text-blue-600 underline">
            support@bitconnect.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2023 BitConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
