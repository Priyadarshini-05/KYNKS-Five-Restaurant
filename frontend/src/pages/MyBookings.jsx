import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const MyBookings = () => {
  const { axios, user, authLoading } = useContext(AppContext);
  const [tableBookings, setTableBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("table");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [tableRes, eventRes] = await Promise.all([
        axios.get("/api/booking/my-bookings"),
        axios.get("/api/event/my-events"),
      ]);

      if (tableRes.data.success) {
        setTableBookings(tableRes.data.bookings);
      }
      if (eventRes.data.success) {
        setEventBookings(eventRes.data.events);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">My <span className="text-yellow-500">Bookings</span></h2>
          <p className="text-gray-500">Please login to view your bookings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            My <span className="text-yellow-500">Bookings</span>
          </h2>
          <p className="text-gray-500">Manage your upcoming dining and event experiences</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10 space-x-4">
          <button
            onClick={() => setActiveTab("table")}
            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === "table"
                ? "bg-yellow-500 text-white shadow-lg shadow-yellow-100 scale-105"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Table Bookings
          </button>
          <button
            onClick={() => setActiveTab("event")}
            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === "event"
                ? "bg-yellow-500 text-white shadow-lg shadow-yellow-100 scale-105"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Event Bookings
          </button>
        </div>

        {/* Table Bookings List */}
        {activeTab === "table" && (
          <div className="space-y-6">
            {tableBookings.length === 0 ? (
              <div className="text-center py-16 bg-white shadow-sm border border-gray-100 rounded-3xl">
                <p className="text-gray-500 text-lg">You have no table bookings yet</p>
              </div>
            ) : (
              tableBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-yellow-200 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-50 pb-4 gap-4">
                    <h3 className="text-2xl font-bold text-gray-900">{booking.name}</h3>
                    <span
                      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${
                        booking.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                          : booking.status === "Approved"
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-600">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-gray-900 font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                      <p className="text-gray-900 font-medium">{booking.time}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Guests</p>
                      <p className="text-gray-900 font-medium">{booking.numberOfPeople} People</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-gray-900 font-medium">{booking.phone}</p>
                    </div>
                    
                    {booking.note && (
                      <div className="col-span-1 sm:grid-cols-2 lg:col-span-4 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <span className="text-yellow-700 font-bold text-xs uppercase tracking-wider block mb-1">Special Note</span>
                        <p className="text-gray-700 italic">"{booking.note}"</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 text-xs text-gray-400 font-medium text-right">
                    Booked on: {new Date(booking.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Event Bookings List */}
        {activeTab === "event" && (
          <div className="space-y-6">
            {eventBookings.length === 0 ? (
              <div className="text-center py-16 bg-white shadow-sm border border-gray-100 rounded-3xl">
                <p className="text-gray-500 text-lg">You have no event bookings yet</p>
              </div>
            ) : (
              eventBookings.map((event) => (
                <div
                  key={event._id}
                  className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-yellow-200 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-50 pb-4 gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{event.eventName}</h3>
                      <span className="text-sm text-yellow-600 font-bold uppercase tracking-wider">{event.eventType}</span>
                    </div>
                    <span
                      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${
                        event.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                          : event.status === "Approved"
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-600">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-gray-900 font-medium">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                      <p className="text-gray-900 font-medium">{event.time}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Guests</p>
                      <p className="text-gray-900 font-medium">{event.guestCount} People</p>
                    </div>

                    {event.specialRequests && (
                      <div className="col-span-1 sm:grid-cols-2 lg:col-span-3 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <span className="text-yellow-700 font-bold text-xs uppercase tracking-wider block mb-1">Special Requests</span>
                        <p className="text-gray-700 italic">"{event.specialRequests}"</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 text-xs text-gray-400 font-medium text-right">
                    Booked on: {new Date(event.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
