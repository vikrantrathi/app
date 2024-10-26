// frontend/src/pages/ViewAppointments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/appointments/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
      setError('');
      // toast.success('Appointments loaded successfully.');
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="main-content flex-1">
        <Topbar />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">View Appointments</h2>
          {loading ? (
            <p>Loading appointments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full bg-white border mt-2">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Student</th>
                  <th className="px-4 py-2 border">Teacher</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time Slot</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-4 py-2 border">{appointment.studentId?.name}</td>
                      <td className="px-4 py-2 border">{appointment.teacherId?.name}</td>
                      <td className="px-4 py-2 border">{new Date(appointment.date).toLocaleDateString()}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center px-4 py-2">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default ViewAppointments;
