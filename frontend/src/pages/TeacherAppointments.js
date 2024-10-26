import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/appointments/teacher', {
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

  const approveAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/appointments/${appointmentId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Appointment approved successfully.');
      fetchAppointments();
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast.error('Failed to approve appointment.');
    }
  };

  const rejectAppointment = async () => {
    if (!rejectionReason.trim()) {
      toast.warn('Please provide a reason for rejection.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/appointments/${selectedAppointment._id}/reject`,
        { reason: rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Appointment rejected with reason.');
      fetchAppointments();
      setShowRejectPopup(false);
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Failed to reject appointment.');
    }
  };

  const rescheduleAppointment = async () => {
    if (!rescheduleDate || !rescheduleTimeSlot || !rescheduleReason.trim()) {
      toast.warn('Please provide a new date, time slot, and reason for rescheduling.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/appointments/${selectedAppointment._id}/reschedule`,
        { newDate: rescheduleDate, newTimeSlot: rescheduleTimeSlot, rescheduleReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Appointment rescheduled successfully.');
      fetchAppointments();
      setShowReschedulePopup(false);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error('Failed to reschedule appointment.');
    }
  };

  return (
    <div className="flex">
      <Sidebar role="teacher" />
      <div className="main-content flex-1">
        <Topbar />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Manage Appointments</h2>
          {loading ? (
            <p>Loading appointments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full bg-white border mt-2">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Student</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time Slot</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-4 py-2 border">{appointment.studentId?.name}</td>
                    <td className="px-4 py-2 border">{new Date(appointment.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{appointment.timeSlot}</td>
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
                        <>
                          <button
                            className="bg-green-500 text-white p-1 rounded mr-2"
                            onClick={() => approveAppointment(appointment._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white p-1 rounded mr-2"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowRejectPopup(true);
                            }}
                          >
                            Reject
                          </button>
                          <button
                            className="bg-blue-500 text-white p-1 rounded"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowReschedulePopup(true);
                            }}
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Reject Popup */}
          {showRejectPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <h3 className="text-lg font-bold">Enter Rejection Reason</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="border p-2 w-full mt-2"
                />
                <div className="mt-4 flex justify-end">
                  <button onClick={rejectAppointment} className="bg-red-500 text-white p-2 rounded mr-2">
                    Submit
                  </button>
                  <button
                    onClick={() => setShowRejectPopup(false)}
                    className="bg-gray-300 p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reschedule Popup */}
          {showReschedulePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <h3 className="text-lg font-bold">Reschedule Appointment</h3>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="border p-2 w-full mt-2"
                />
                <input
                  type="time"
                  value={rescheduleTimeSlot}
                  onChange={(e) => setRescheduleTimeSlot(e.target.value)}
                  className="border p-2 w-full mt-2"
                />
                <textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Enter reschedule reason"
                  className="border p-2 w-full mt-2"
                />
                <div className="mt-4 flex justify-end">
                  <button onClick={rescheduleAppointment} className="bg-blue-500 text-white p-2 rounded mr-2">
                    Submit
                  </button>
                  <button
                    onClick={() => setShowReschedulePopup(false)}
                    className="bg-gray-300 p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default TeacherAppointments;
