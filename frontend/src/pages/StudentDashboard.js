import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchStudentStats();
    fetchTodayAppointments();
  }, []);

  const fetchStudentStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/student/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching student stats:', error);
      setError('Failed to load stats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/student/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodayAppointments(response.data);
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="student" />
      <div className="main-content flex-1">
        <Topbar />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Student Dashboard</h2>
          {loading ? (
            <p>Loading stats...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">Total Appointments</h3>
                <p className="text-2xl">{stats.totalAppointments}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">Total Cancelled Appointments</h3>
                <p className="text-2xl">{stats.totalCancelled}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">Appointments in Last 30 Days</h3>
                <p className="text-2xl">{stats.last30DaysAppointments}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">Appointments in Next 7 Days</h3>
                <p className="text-2xl">{stats.next7DaysAppointments}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">Total Rescheduled Appointments</h3>
                <p className="text-2xl">{stats.totalRescheduled}</p>
              </div>
            </div>
          )}

          <h3 className="text-xl font-bold mt-8 mb-4">Today's Appointments</h3>
          {todayAppointments.length > 0 ? (
            <table className="min-w-full bg-white border mt-2">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Teacher</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time Slot</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-4 py-2 border">{appointment.teacherId.name}</td>
                    <td className="px-4 py-2 border">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">{appointment.timeSlot}</td>
                    <td className="px-4 py-2 border">{appointment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Today appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
