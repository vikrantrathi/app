import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const BookAppointment = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/teacher/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (teacherId, selectedDate) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/teacher/teachers/${teacherId}/slots?date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data || response.data.length === 0) {
        toast.info('No slots available for the selected date. Please choose another date.');
        setAvailableSlots([]);
      } else {
        setAvailableSlots(response.data);
      }
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.info('No slots available for the selected date. Please choose another date.');
        setAvailableSlots([]);
      } else {
        console.error('Error fetching available slots:', error);
        setError('Failed to load available slots. Please try again.');
      }
    }
  };

  const handleBookAppointment = async (teacherId, slot) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/appointments`,
        {
          teacherId,
          date: selectedDate,
          timeSlot: `${slot.startTime} - ${slot.endTime}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Appointment booked successfully.');
      setSelectedTeacher(null);
      setAvailableSlots([]);
      closeModal();
      fetchTeachers(); 
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  const openModal = (teacher) => {
    setSelectedTeacher(teacher);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedTeacher(null);
    setSelectedDate('');
    setAvailableSlots([]);
    setModalIsOpen(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar role="student" />
      <div className="main-content flex-1">
        <Topbar />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
          <input
            type="text"
            placeholder="Search for a teacher..."
            value={searchQuery}
            onChange={handleSearch}
            className="border p-2 mb-4 w-full"
          />
          {loading ? (
            <p>Loading teachers...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeachers.map((teacher) => (
                <div key={teacher._id} className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-bold">{teacher.name}</h3>
                  <p>{teacher.email}</p>
                  <button
                    className="bg-blue-500 text-white p-2 rounded mt-2"
                    onClick={() => openModal(teacher)}
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Modal for booking an appointment */}
          {modalIsOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative overflow-auto h-full">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
                <h3 className="text-lg font-bold mb-4">
                  Book Appointment with {selectedTeacher.name}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <button
                  className="bg-green-500 text-white p-2 rounded mb-4"
                  onClick={() => fetchAvailableSlots(selectedTeacher._id, selectedDate)}
                >
                  Check Availability
                </button>

                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.startTime}
                        onClick={() => handleBookAppointment(selectedTeacher._id, slot)}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                ) : (
                  selectedDate && <p>No available slots for the selected date.</p>
                )}
              </div>
            </div>
          )}

          <ToastContainer position="top-right" />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
