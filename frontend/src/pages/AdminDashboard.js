import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [rejectedUsers, setRejectedUsers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const appointmentsResponse = await axios.get('http://localhost:5000/api/admin/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = usersResponse.data;
      const totalUsersCount = users.filter(user => user.isApproved && !user.isRejected).length;
      const totalStudentsCount = users.filter(user => user.role === 'student' && user.isApproved && !user.isRejected).length;
      const totalTeachersCount = users.filter(user => user.role === 'teacher' && user.isApproved && !user.isRejected).length;
      const rejectedUsersCount = users.filter(user => user.isRejected).length;
      const pendingApprovalsList = users.filter(user => !user.isApproved && !user.isRejected);
      const totalAppointmentsCount = appointmentsResponse.data.length;

      setTotalUsers(totalUsersCount);
      setTotalStudents(totalStudentsCount);
      setTotalTeachers(totalTeachersCount);
      setRejectedUsers(rejectedUsersCount);
      setPendingApprovals(pendingApprovalsList);
      setTotalAppointments(totalAppointmentsCount);
      setError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/approve/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDashboardData(); // Refresh data after approving a user
    } catch (error) {
      console.error('Error approving user:', error);
      setError('Failed to approve user. Please try again.');
    }
  };

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/reject/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDashboardData(); // Refresh data after rejecting a user
    } catch (error) {
      console.error('Error rejecting user:', error);
      setError('Failed to reject user. Please try again.');
    }
  };

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="main-content flex-1">
        <Topbar />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
          {loading ? (
            <p>Loading dashboard data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Link to="/admin/users" className="bg-white p-4 rounded shadow hover:bg-blue-50 transition">
                  <h3 className="text-lg font-semibold">Total Users</h3>
                  <p className="text-2xl">{totalUsers}</p>
                </Link>
                <Link to="/admin/students" className="bg-white p-4 rounded shadow hover:bg-blue-50 transition">
                  <h3 className="text-lg font-semibold">Total Students</h3>
                  <p className="text-2xl">{totalStudents}</p>
                </Link>
                <Link to="/admin/teachers" className="bg-white p-4 rounded shadow hover:bg-blue-50 transition">
                  <h3 className="text-lg font-semibold">Total Teachers</h3>
                  <p className="text-2xl">{totalTeachers}</p>
                </Link>
                <Link to="/admin/users" className="bg-white p-4 rounded shadow hover:bg-blue-50 transition">
                  <h3 className="text-lg font-semibold">Pending Approvals</h3>
                  <p className="text-2xl">{pendingApprovals.length}</p>
                </Link>
                <Link to="/admin/rejected" className="bg-white p-4 rounded shadow hover:bg-blue-50 transition">
                  <h3 className="text-lg font-semibold">Rejected Profiles</h3>
                  <p className="text-2xl">{rejectedUsers}</p>
                </Link>
                <Link to="/admin/appointments" className="bg-white p-4 rounded shadow hover:bg-blue-50 transition">
                  <h3 className="text-lg font-semibold">Total Appointments</h3>
                  <p className="text-2xl">{totalAppointments}</p>
                </Link>
              </div>

              <h3 className="text-lg font-bold mb-2">Pending Approvals</h3>
              {pendingApprovals.length === 0 ? (
                <p>No users pending approval.</p>
              ) : (
                <ul className="bg-white p-4 rounded shadow mb-4">
                  {pendingApprovals.map((user) => (
                    <li key={user._id} className="flex justify-between items-center p-2 border-b">
                      <span>{user.name} ({user.email}) - {user.role}</span>
                      <div>
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="bg-green-500 text-white p-2 mr-2 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(user._id)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
