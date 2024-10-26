import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  // Check if the user or user.role is not available
  if (!user || !user.role) {
    return null; // Or render a placeholder
  }

  const links = {
    admin: [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Manage Users', path: '/admin/users' },
      { name: 'View Appointments', path: '/admin/appointments' },
    ],
    student: [
      { name: 'Dashboard', path: '/student' },
      { name: 'Book Appointment', path: '/student/book' },
      { name: 'My Appointments', path: '/student/appointments' },
    ],
    teacher: [
      { name: 'Dashboard', path: '/teacher' },
      { name: 'Manage Availability', path: '/teacher/availability' },
      { name: 'Appointments', path: '/teacher/appointments' },
    ],
  };

  return (
    <div className="bg-blue-800 text-white h-screen fixed top-0 left-0 p-4">
      <h2 className="text-xl font-bold mb-4">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel</h2>
      <nav>
        <ul className="space-y-2">
          {links[user.role].map((link) => (
            <li key={link.path}>
              <Link to={link.path} className="block p-2 hover:bg-blue-600 rounded">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
