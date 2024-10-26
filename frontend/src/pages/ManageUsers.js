import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    if (location.pathname.includes('/admin/students')) {
      setFilter('students');
    } else if (location.pathname.includes('/admin/teachers')) {
      setFilter('teachers');
    } else if (location.pathname.includes('/admin/rejected')) {
      setFilter('rejected');
    } else {
      setFilter('all');
    }
    fetchUsers();
  }, [location]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === 'students') return user.role === 'student' && user.isApproved && !user.isRejected;
    if (filter === 'teachers') return user.role === 'teacher' && user.isApproved && !user.isRejected;
    if (filter === 'rejected') return user.isRejected;
    return user.isApproved && !user.isRejected; // Default to showing all approved users
  });

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="main-content flex-1">
        <Topbar />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Manage Users</h2>
          <nav className="mb-4 flex space-x-4">
            <Link to="/admin/users" className={`${filter === 'all' ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-600`}>
              All Users
            </Link>
            <Link to="/admin/students" className={`${filter === 'students' ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-600`}>
              All Students
            </Link>
            <Link to="/admin/teachers" className={`${filter === 'teachers' ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-600`}>
              All Teachers
            </Link>
            <Link to="/admin/rejected" className={`${filter === 'rejected' ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-600`}>
              Rejected Users
            </Link>
          </nav>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="bg-white p-4 rounded shadow">
              {filteredUsers.length === 0 ? (
                <p>No users found.</p>
              ) : (
                <table className="min-w-full table-auto">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
