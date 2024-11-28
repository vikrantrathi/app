// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Append domain to email
//     const emailWithDomain = `${email}@bitmesra.ac.in`;

//     try {
//       // Attempt login
//       await login(emailWithDomain, password);
//     } catch {
//       // Error notifications and modal handling are handled in AuthContext
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow-md w-96">
//         <h2 className="text-2xl mb-4">Login</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700">Email (Without @bitmesra.ac.in)</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded"
//                 placeholder="Enter your email"
//                 required
//               />
//               <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
//                 @bitmesra.ac.in
//               </span>
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Enter your password"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//           >
//             Login
//           </button>
//         </form>
//         <p className="mt-4 text-gray-600">
//           Don't have an account?{' '}
//           <a href="/register" className="text-blue-500">
//             Register
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaHome } from "react-icons/fa"; // Home icon from react-icons
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Append domain to email
    const emailWithDomain = `${email}@bitmesra.ac.in`;

    try {
      // Attempt login
      await login(emailWithDomain, password);
    } catch {
      // Error notifications and modal handling are handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
      {/* Left Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          Welcome to BitConnect Portal
        </h1>
        <p className="text-lg md:text-2xl text-blue-200 mt-4">
          A streamlined portal for booking appointments with Teachers.
        </p>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full md:w-1/3 bg-white flex flex-col justify-center items-center md:p-12 p-5 md:rounded-3xl">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">
                Email (Without @bitmesra.ac.in)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your email"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white">
                  @bitmesra.ac.in
                </span>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Action Links */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <a href="/register" className="text-blue-500 hover:underline font-medium">
              Register
            </a>
            <a href="/" className="flex items-center text-blue-500 hover:underline font-medium">
              <FaHome className="mr-2" />
              Go Back to Home
            </a>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Login;

