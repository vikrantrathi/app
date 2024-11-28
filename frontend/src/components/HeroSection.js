import React from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie } from "react-icons/fa"; // Icons for roles

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 md:py-24 overflow-hidden">
      <div className="container mx-auto flex flex-col justify-center items-center text-center px-6">
        {/* Hero Content */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Welcome to BitConnect
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Your gateway to seamless scheduling and effortless collaboration with
          teachers, students, and administrators.
        </p>
        <a
          href="/register"
          className="bg-white text-blue-600 px-8 py-4 rounded-md text-lg font-semibold shadow-md hover:bg-gray-100 transition duration-300"
        >
          Get Started
        </a>

        {/* Role Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-4xl">
          {/* Student Box */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-xl ">
            <FaUserGraduate className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Student</h3>
            <p className="text-gray-600">
              Effortlessly book appointments with teachers and manage your
              schedule.
            </p>
          </div>

          {/* Teacher Box */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-xl p-6 text-center">
            <FaChalkboardTeacher className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Teacher</h3>
            <p className="text-gray-600">
              Manage appointments, communicate with students, and stay
              organized.
            </p>
          </div>

          {/* Admin Box */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-xl p-6 text-center">
            <FaUserTie className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Admin</h3>
            <p className="text-gray-600">
              Oversee the platform, manage users, and ensure smooth operations.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white bg-opacity-20 rounded-full blur-3xl hidden md:block"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white bg-opacity-20 rounded-full blur-3xl hidden md:block"></div>

      {/* Marquee Line */}
      <div className="absolute bottom-0 w-full bg-blue-600 py-3 overflow-hidden">
        <div className="marquee whitespace-nowrap text-white text-lg font-medium">
          <span className="inline-block px-6">
            A streamlined appointment booking portal
          </span>
          <span className="inline-block px-6">
            A streamlined appointment booking portal
          </span>
          <span className="inline-block px-6">
            A streamlined appointment booking portal
          </span>
        </div>
      </div>

      {/* Marquee Animation */}
      <style>{`
        .marquee {
          display: inline-block;
          animation: marquee 35s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
