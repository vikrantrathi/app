import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teacher/appointments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/teacher/appointments/${appointmentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status } : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content flex-1">
        <Topbar />
        <div className="p-4">
          <h2 className="text-2xl mb-4">Manage Appointments</h2>
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment._id} className="mb-4 p-4 bg-white shadow rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>Student:</strong> {appointment.studentName}</p>
                    <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appointment.timeSlot}</p>
                    <p><strong>Status:</strong> {appointment.status}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => updateStatus(appointment._id, 'approved')}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(appointment._id, 'rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
