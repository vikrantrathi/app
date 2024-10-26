import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DEFAULT_SLOTS = [
  { startTime: '09:00', endTime: '09:30' },
  { startTime: '09:30', endTime: '10:00' },
  { startTime: '10:00', endTime: '11:00' },
  { startTime: '11:00', endTime: '12:00' },
  { startTime: '12:00', endTime: '12:30' },
  { startTime: '12:30', endTime: '13:00' },
  { startTime: '13:00', endTime: '14:00' },
  { startTime: '14:00', endTime: '15:00' },
  { startTime: '15:00', endTime: '16:00' },
  { startTime: '16:00', endTime: '17:00' },
  { startTime: '17:00', endTime: '17:30' },
  { startTime: '17:30', endTime: '18:00' },
  { startTime: '18:00', endTime: '18:30' },
  { startTime: '18:30', endTime: '19:00' },
  { startTime: '19:00', endTime: '19:30' },
  { startTime: '19:30', endTime: '20:00' },
];

const ManageAvailability = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/availability`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailability(response.data);
      // toast.success('Availability data loaded successfully!');
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability. Please try again.');
    }
  };

  const toggleSlot = (slot) => {
    const exists = selectedSlots.find(
      (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
    );

    if (exists) {
      setSelectedSlots(selectedSlots.filter((s) => s !== exists));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const submitAvailability = async () => {
    if (!selectedDate) {
      toast.warn('Please select a date.');
      setError('Please select a date.');
      return;
    }

    if (selectedSlots.length === 0) {
      toast.warn('Please select at least one time slot.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/availability/add`,
        { date: selectedDate, timeSlots: selectedSlots },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAvailability();
      setSelectedSlots([]);
      toast.success('Availability saved successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      if (error.response && error.response.data.message === 'Slot already exists') {
        toast.warn('Selected slot already exists. Please choose a different slot.');
      } else {
        toast.error('Failed to update availability. Please try again.');
      }
    }
  };

  const deleteAvailabilitySlot = async (availabilityId, slot = null) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/availability/${availabilityId}/deleteSlot`,
        { slot },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAvailability();
      toast.success('Slot deleted successfully!');
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      toast.error('Failed to delete slot. Please try again.');
    }
  };

  return (
    <div className="flex">
      <Sidebar role="teacher" />
      <div className="main-content flex-1">
        <Topbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Manage Availability</h2>
          {error && <p className="text-red-500">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="border rounded p-2 w-full"
            />
          </div>

          <h3 className="text-lg font-bold mb-2">Available Slots</h3>
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_SLOTS.map((slot) => (
              <button
                key={`${slot.startTime}-${slot.endTime}`}
                onClick={() => toggleSlot(slot)}
                className={`p-2 border rounded ${
                  selectedSlots.some(
                    (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
                  )
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {slot.startTime} - {slot.endTime}
              </button>
            ))}
          </div>

          <button onClick={submitAvailability} className="bg-green-500 text-white p-2 rounded mt-4">
            Save Availability
          </button>

          <h3 className="text-lg font-bold mt-4">Your Availability</h3>
          <table className="min-w-full bg-white border mt-2">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Time Slots</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availability.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-2 border">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">
                    {item.timeSlots.map((slot) => (
                      <div key={`${slot.startTime}-${slot.endTime}`} className="flex justify-between items-center">
                        {slot.startTime} - {slot.endTime}
                        <button
                          onClick={() => deleteAvailabilitySlot(item._id, slot)}
                          className="bg-red-500 text-white p-1 rounded m-2 ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => deleteAvailabilitySlot(item._id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Delete All Slots for Day
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAvailability;
