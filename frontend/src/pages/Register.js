// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('student');
//   const [rollNumber, setRollNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [formattedEmail, setFormattedEmail] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
//   const [isSendingOtp, setIsSendingOtp] = useState(false);
//   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // OTP verification state
//   const navigate = useNavigate();

//   // Format name and roll number before sending to the backend
//   const formatInput = () => {
//     setName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
//     setRollNumber(rollNumber.toUpperCase());
//   };

//   // Handle sending OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     formatInput(); // Format name and roll number
//     const emailWithDomain = `${email}@bitmesra.ac.in`;
//     setFormattedEmail(emailWithDomain);
//     setIsSendingOtp(true);

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/send-otp', {
//         name,
//         email: emailWithDomain,
//       });

//       toast.success(response.data.message || 'OTP sent successfully. Please verify your email.', {
//         position: 'top-right',
//       });
//       setIsOtpSent(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to send OTP. Please try again.', {
//         position: 'top-right',
//       });
//     } finally {
//       setIsSendingOtp(false);
//     }
//   };

//   // Handle OTP Verification and Registration
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setIsVerifyingOtp(true);

//     try {
//       const verifyResponse = await axios.post('http://localhost:5000/api/auth/verify-otp', {
//         email: formattedEmail,
//         otp,
//       });

//       toast.success(verifyResponse.data.message || 'OTP verified successfully!', {
//         position: 'top-right',
//       });

//       // Automatically register the user after OTP verification
//       const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
//         name,
//         email: formattedEmail,
//         password,
//         role,
//         rollNumber: role === 'student' ? rollNumber : undefined,
//       });

//       toast.success(registerResponse.data.message || 'Registration successful. Awaiting admin approval.', {
//         position: 'top-right',
//       });
//       setIsOtpVerified(true);
//       setIsModalOpen(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'OTP verification or registration failed. Please try again.', {
//         position: 'top-right',
//       });
//     } finally {
//       setIsVerifyingOtp(false);
//     }
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow-md w-96">
//         <h2 className="text-2xl mb-4">Register</h2>
//         <form>
//           <div className="mb-4">
//             <label className="block text-gray-700">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Enter your full name"
//               required
//               disabled={isOtpSent}
//             />
//           </div>
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
//                 disabled={isOtpSent}
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
//               placeholder="Enter a secure password"
//               required
//               disabled={isOtpSent}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               disabled={isOtpSent}
//             >
//               <option value="student">Student</option>
//               <option value="teacher">Teacher</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>
//           {role === 'student' && !isOtpSent && (
//             <div className="mb-4">
//               <label className="block text-gray-700">Roll Number</label>
//               <input
//                 type="text"
//                 value={rollNumber}
//                 onChange={(e) => setRollNumber(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded"
//                 placeholder="Enter your roll number"
//                 required
//               />
//             </div>
//           )}
//           {isOtpSent && (
//             <div className="mb-4">
//               <label className="block text-gray-700">Enter OTP</label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded"
//                 placeholder="Enter the OTP sent to your email"
//                 required
//                 disabled={isOtpVerified}
//               />
//             </div>
//           )}
//           {!isOtpSent && (
//             <button
//               onClick={handleSendOtp}
//               className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//               disabled={isSendingOtp}
//             >
//               {isSendingOtp ? 'Verifying...' : 'Verify Email'}
//             </button>
//           )}
//           {isOtpSent && !isOtpVerified && (
//             <button
//               onClick={handleVerifyOtp}
//               className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4"
//               disabled={isVerifyingOtp}
//             >
//               {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP'}
//             </button>
//           )}
//         </form>
//       </div>

//       {/* Modal Popup */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-md w-96 text-center">
//             <h2 className="text-xl font-bold mb-4">Registration Successful</h2>
//             <p>
//               Your profile is pending admin approval. This process may take 24-48 hours. You will be
//               notified via email once your profile is approved.
//             </p>
//             <button
//               onClick={handleModalClose}
//               className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHome } from "react-icons/fa"; // Home icon from react-icons
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [rollNumber, setRollNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [formattedEmail, setFormattedEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // OTP verification state
  const navigate = useNavigate();

  // Format name and roll number before sending to the backend
  const formatInput = () => {
    setName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
    setRollNumber(rollNumber.toUpperCase());
  };

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    formatInput(); // Format name and roll number
    const emailWithDomain = `${email}@bitmesra.ac.in`;
    setFormattedEmail(emailWithDomain);
    setIsSendingOtp(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/send-otp", {
        name,
        email: emailWithDomain,
      });

      toast.success(response.data.message || "OTP sent successfully. Please verify your email.", {
        position: "top-right",
      });
      setIsOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.", {
        position: "top-right",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP Verification and Registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsVerifyingOtp(true);

    try {
      const verifyResponse = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: formattedEmail,
        otp,
      });

      toast.success(verifyResponse.data.message || "OTP verified successfully!", {
        position: "top-right",
      });

      // Automatically register the user after OTP verification
      const registerResponse = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email: formattedEmail,
        password,
        role,
        rollNumber: role === "student" ? rollNumber : undefined,
      });

      toast.success(registerResponse.data.message || "Registration successful. Awaiting admin approval.", {
        position: "top-right",
      });
      setIsOtpVerified(true);
      setIsModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification or registration failed. Please try again.", {
        position: "top-right",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-500 to-blue-700">
      {/* Left Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center text-white px-8">
        <h1 className="md:text-6xl text-5xl font-extrabold mb-4">Join BitConnect Portal</h1>
        <p className="md:text-2xl text-lg">
          A streamlined platform for booking appointments with teachers. Sign up today and connect seamlessly!
        </p>
      </div>

      {/* Right Column - Registration Form */}
      <div className="w-full md:w-1/2 flex justify-center py-12 md:px-8 px-2">
        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
                disabled={isOtpSent}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email (Without @bitmesra.ac.in)</label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                  disabled={isOtpSent}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white">
                  @bitmesra.ac.in
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a secure password"
                required
                disabled={isOtpSent}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isOtpSent}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {role === "student" && !isOtpSent && (
              <div className="mb-4">
                <label className="block text-gray-700">Roll Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your roll number"
                  required
                />
              </div>
            )}
            {isOtpSent && (
              <div className="mb-4">
                <label className="block text-gray-700">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the OTP sent to your email"
                  required
                  disabled={isOtpVerified}
                />
              </div>
            )}
            {!isOtpSent && (
              <button
                onClick={handleSendOtp}
                className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-300"
                disabled={isSendingOtp}
              >
                {isSendingOtp ? "Sending OTP..." : "Send OTP"}
              </button>
            )}
            {isOtpSent && !isOtpVerified && (
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition duration-300 mt-4"
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP & Register"}
              </button>
            )}
            <div className="flex justify-between items-center mt-6 text-sm">
            <a
              href="/login"
              className="text-blue-500 hover:underline font-medium"
            >
              Login
            </a>
            <a
              href="/"
              className="flex items-center text-blue-500 hover:underline font-medium"
            >
              <FaHome className="mr-2" />
              Go Back to Home
            </a>
          </div>
          </form>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Registration Successful</h2>
            <p>
              Your profile is pending admin approval. This process may take 24-48 hours. You will be
              notified via email once your profile is approved.
            </p>
            <button
              onClick={handleModalClose}
              className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Register;
