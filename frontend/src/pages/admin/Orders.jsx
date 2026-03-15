import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { 
  Search, 
  ChevronRight, 
  Package, 
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  CreditCard,
  ShoppingBag
} from "lucide-react";
import toast from "react-hot-toast";

const Orders = () => {
  const { admin, axios, loading, setLoading } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/orders");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/order/update-status/${orderId}`, {
        status: newStatus,
      });

      if (data.success) {
        toast.success(data.message);
        fetchOrders();
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
      fetchOrders();
    }
  }, []);

  const filteredOrders = orders.filter(order => 
    order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-100/50";
      case "Preparing": return "bg-indigo-50 text-indigo-600 border-indigo-100/50";
      case "Delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100/50";
      default: return "bg-slate-50 text-slate-500 border-slate-100/50";
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Operation Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Logistics</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Real-time status tracking and fulfillment orchestration.</p>
        </div>

        <div className="relative group max-w-lg w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search manifests, customers or status..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Logistics Manifest Table */}
      <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-50 relative overflow-hidden">
        <div className="overflow-x-auto scroller h-[700px]">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
               <tr className="bg-slate-50/30">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Routing Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Net Amount</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Phase</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-right">Lifecycle Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="group hover:bg-slate-50/20 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-slate-200 shrink-0">
                           {order.user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 text-[15px] tracking-tight truncate">{order.user.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {order._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-slate-900 text-[13px] font-bold tracking-tight">
                          <MapPin size={14} className="text-slate-400 mr-2 shrink-0" />
                          <span className="truncate max-w-[220px]">{order.address}</span>
                        </div>
                        <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em]">
                          <CreditCard size={12} className="mr-2" />
                          {order.paymentMethod}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                         <p className="font-extrabold text-slate-900 text-lg tracking-tighter">
                          <span className="text-xs text-indigo-600 font-bold mr-1 italic">Rs.</span>
                          {order.totalAmount}
                        </p>
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{order.items.length} Units</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black border uppercase tracking-widest shadow-sm ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="relative inline-block group/select">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={loading}
                          className="appearance-none bg-slate-50 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-xl pl-4 pr-10 py-3 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white outline-none cursor-pointer transition-all shadow-sm"
                        >
                          <option value="Pending">Queue</option>
                          <option value="Preparing">Production</option>
                          <option value="Delivered">Fulfilled</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                        <ShoppingBag size={32} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">No Active Logistics Streams</p>
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

export default Orders;

