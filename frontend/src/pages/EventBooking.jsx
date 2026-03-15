import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const EventBooking = () => {
  const { axios, navigate } = useContext(AppContext);
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    guestCount: "",
    date: "",
    time: "",
    specialRequests: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/event/create", formData);
      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("You need to login to book an event");
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong!"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book an <span className="text-yellow-500">Event</span></h2>
          <p className="text-gray-500">Celebrate your special moments with us</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="e.g. Birthday Party"
                className="bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-3 w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-3 w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all"
                required
              >
                <option value="">Select Event Type</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Corporate">Corporate</option>
                <option value="Wedding">Wedding</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {formData.eventType === "Other" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">Please specify Event Name</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="Specify your event type"
                className="bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-3 w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                placeholder="Total Guest count"
                min="1"
                className="bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-3 w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-3 w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-3 w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any specific requirements (decorations, dietary, etc.)"
              rows="4"
              className="bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-3 w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-4 rounded-xl hover:bg-yellow-600 transition-all font-bold text-lg uppercase tracking-wider shadow-lg shadow-yellow-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm Event Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventBooking;
