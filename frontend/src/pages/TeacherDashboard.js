import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherDashboard = () => {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalCancelledAppointments, setTotalCancelledAppointments] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [next7DaysAppointments, setNext7DaysAppointments] = useState(0);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/teacher/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const appointments = response.data;
  
      // Get the current time and define todayStart and todayEnd
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0); // Start of today (00:00:00)
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999); // End of today (23:59:59)
  
      const next7Days = new Date();
      next7Days.setDate(now.getDate() + 7);
  
      // Calculate stats
      const total = appointments.length;
      const cancelled = appointments.filter(appointment => appointment.status === 'cancelled').length;
      const todayAppts = appointments.filter(
        appointment =>
          new Date(appointment.date) >= todayStart &&
          new Date(appointment.date) <= todayEnd
      ).length;
      const next7DaysAppts = appointments.filter(
        appointment =>
          new Date(appointment.date) > todayEnd &&
          new Date(appointment.date) <= next7Days
      ).length;
  
      const todayScheduleList = appointments.filter(
        appointment =>
          new Date(appointment.date) >= todayStart &&
          new Date(appointment.date) <= todayEnd
      );
  
      setTotalAppointments(total);
      setTotalCancelledAppointments(cancelled);
      setTodayAppointments(todayAppts);
      setNext7DaysAppointments(next7DaysAppts);
      setTodaySchedule(todayScheduleList);
      setError('');
    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex">
      <Sidebar role="teacher" />
      <div className="main-content flex-1">
        <Topbar />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Teacher Dashboard</h2>
          {loading ? (
            <p>Loading dashboard data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">Total Appointments</h3>
                  <p className="text-2xl">{totalAppointments}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">Total Cancelled Appointments</h3>
                  <p className="text-2xl">{totalCancelledAppointments}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">Today's Appointments</h3>
                  <p className="text-2xl">{todayAppointments}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">Next 7 Days Appointments</h3>
                  <p className="text-2xl">{next7DaysAppointments}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2">Today's Schedule</h3>
              {todaySchedule.length === 0 ? (
                <p>No appointments for today.</p>
              ) : (
                <table className="min-w-full bg-white border mt-2">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Student</th>
                      <th className="px-4 py-2 border">Time Slot</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaySchedule.map((appointment) => (
                      <tr key={appointment._id}>
                        <td className="px-4 py-2 border">{appointment.studentId?.name}</td>
                        <td className="px-4 py-2 border">{appointment.timeSlot}</td>
                        <td className="px-4 py-2 border">{appointment.status}</td>
                        <td className="px-4 py-2 border">
                          {appointment.status === 'rejected' && appointment.rejectionReason && (
                            <span className="text-sm text-red-600">Reason: {appointment.rejectionReason}</span>
                          )}
                          {appointment.status === 'cancelled' && appointment.cancellationReason && (
                            <span className="text-sm text-red-600">Reason: {appointment.cancellationReason}</span>
                          )}
                          {appointment.status === 'rescheduled' && appointment.rescheduleReason && (
                            <span className="text-sm text-blue-600">Reason: {appointment.rescheduleReason}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default TeacherDashboard;
