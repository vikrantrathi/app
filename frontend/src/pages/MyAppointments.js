import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyAppointments = () => {
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
      const response = await axios.get('http://localhost:5000/api/appointments/student', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
      // toast.success('Appointments loaded successfully.');
      setError('');
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const reason = prompt('Please enter a reason for cancellation:');
    if (!reason) {
      toast.warn('Cancellation reason is required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/appointments/${appointmentId}/cancel`,
        { cancellationReason: reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Appointment cancelled successfully.');
      fetchAppointments(); // Refresh the appointment list after cancellation
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel the appointment. Please try again.');
    }
  };

  return (
    <div className="flex">
      <Sidebar role="student" />
      <div className="main-content flex-1">
        <Topbar />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">My Appointments</h2>
          {loading ? (
            <p>Loading appointments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full bg-white border mt-2">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time Slot</th>
                  <th className="px-4 py-2 border">Teacher</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-4 py-2 border">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">
                        {appointment.timeSlot || 'Time slot not available'}
                      </td>
                      <td className="px-4 py-2 border">
                        {appointment.teacherId?.name || 'Teacher not available'}
                      </td>
                      <td className="px-4 py-2 border">
                        {appointment.status}
                        {(appointment.status === 'rejected' || appointment.status === 'cancelled') && appointment.rejectionReason && (
                          <p className="text-sm text-red-600">Reason: {appointment.rejectionReason}</p>
                        )}
                        {appointment.status === 'cancelled' && appointment.cancellationReason && (
                          <p className="text-sm text-red-600">Reason: {appointment.cancellationReason}</p>
                        )}
                        {appointment.status === 'rescheduled' && appointment.rescheduleReason && (
                          <p className="text-sm text-blue-600">Reason: {appointment.rescheduleReason}</p>
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        {appointment.status === 'pending' && (
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleCancelAppointment(appointment._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default MyAppointments;
