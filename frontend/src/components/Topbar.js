import React from 'react';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white p-4 shadow flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
