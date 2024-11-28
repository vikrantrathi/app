import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for approval modal
  const [modalMessage, setModalMessage] = useState(''); // Message for the modal
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
          navigate('/login');
        });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const login = async (email, password) => {
    try {
      setError('');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);

      switch (response.data.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'student':
          navigate('/student');
          break;
        default:
          navigate('/');
          break;
      }
    } catch (err) {
      // Check if the account is awaiting approval
      if (err.response?.data?.message === 'Your account is awaiting approval or email verification.') {
        setModalMessage('Your account is pending admin approval. This process may take 24-48 hours.');
        setIsModalOpen(true);
      } else {
        // Handle invalid credentials and other errors
        const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage, { position: 'top-right' });
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {children}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Account Approval Pending</h2>
            <p>{modalMessage}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
