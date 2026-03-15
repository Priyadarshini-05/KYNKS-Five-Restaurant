import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Package, ChevronRight } from "lucide-react";

const EventBookings = () => {
  const { admin, axios, loading, setLoading } = useContext(AppContext);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get("/api/event/all-events");
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/event/update-status/${eventId}`,
        { status: newStatus }
      );

      if (data.success) {
        toast.success(data.message);
        fetchEvents();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchEvents();
    }
  }, [admin]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Event Architecture Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Event Management</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Coordinate high-scale hospitality and corporate engagement logistics.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-50 relative overflow-hidden">
        <div className="overflow-x-auto scroller h-[700px]">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
               <tr className="bg-slate-50/30">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Engagement Subject</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Type</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Volume</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Schedule</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Protocols</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-right">State Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {events.length > 0 ? (
                events.map((item) => (
                  <tr key={item._id} className="group hover:bg-slate-50/20 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-slate-200 shrink-0">
                           {item?.eventName?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 text-[15px] tracking-tight truncate">{item?.eventName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Host: {item.user?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="inline-flex items-center px-3 py-1 bg-indigo-50/50 text-indigo-700 text-[10px] font-black border border-indigo-100/50 rounded-lg uppercase tracking-wider">
                        {item?.eventType}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-flex flex-col items-center">
                         <p className="font-extrabold text-slate-900 text-lg tracking-tighter">{item?.guestCount}</p>
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Invites</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex flex-col items-center">
                        <p className="font-bold text-slate-900 text-[13px] uppercase tracking-widest">
                          {new Date(item?.date).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1 italic">{item?.time}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-[11px] text-slate-500 font-bold leading-relaxed line-clamp-2 max-w-[200px]">
                         {item.specialRequests || "Standard Logistics"}
                       </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="relative inline-block group/select">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          disabled={loading}
                          className="appearance-none bg-slate-50 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-xl pl-4 pr-10 py-3 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white outline-none cursor-pointer transition-all shadow-sm"
                        >
                          <option value="Pending">Queue</option>
                          <option value="Approved">Verified</option>
                          <option value="Cancelled">Archived</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                        <Package size={32} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">Zero Event Pipeline</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default EventBookings;
