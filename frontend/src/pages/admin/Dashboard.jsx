import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Server } from "../../App";
import { 
  ShoppingCart, 
  ShoppingBag,
  DollarSign, 
  Utensils, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Package, 
  ArrowUpRight, 
  Activity 
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios } = useContext(AppContext);
  const [salesData, setSalesData] = useState([]);
  const [highestSoldDish, setHighestSoldDish] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalDishes: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, statsRes] = await Promise.all([
          axios.get(`${Server}/api/order/sales-data`, { withCredentials: true }),
          axios.get(`${Server}/api/admin/stats`, { withCredentials: true })
        ]);

        if (salesRes.data.success) {
          setSalesData(salesRes.data.salesData);
          setHighestSoldDish(salesRes.data.highestSoldDish);
        }
        
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
       <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  const maxSales = salesData.length > 0 ? Math.max(...salesData.map(d => d.totalSold)) : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time operational metrics and performance analytics.</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2 rounded-2xl shadow-lg shadow-slate-200 text-xs font-bold uppercase tracking-widest">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-1"></div>
          <span>Systems Active</span>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Gross Orders", value: stats.totalOrders, icon: Package, color: "indigo", gradient: "from-indigo-500/10 to-indigo-600/5" },
          { label: "Net Revenue", value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "emerald", gradient: "from-emerald-500/10 to-emerald-600/5" },
          { label: "Menu Asset Count", value: stats.totalDishes, icon: Utensils, color: "amber", gradient: "from-amber-500/10 to-amber-600/5" },
          { label: "Verified Users", value: stats.totalUsers, icon: Users, color: "sky", gradient: "from-sky-500/10 to-sky-600/5" }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-500 group border border-white/80 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-150`}></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={24} className={`text-${stat.color}-600`} />
              </div>
              <div className={`px-2.5 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-600 text-[9px] font-black uppercase tracking-widest border border-${stat.color}-100/50`}>
                Live Trace
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Refined Bestseller Card */}
        {highestSoldDish && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-card flex flex-col justify-between relative overflow-hidden group border border-slate-50 min-h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-50 group-hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors">
                <TrendingUp size={24} className="text-indigo-600 group-hover:text-white" />
              </div>
              <p className="text-[10px] font-black text-slate-400 group-hover:text-indigo-200 uppercase tracking-[0.2em] mt-8 mb-2">Inventory Peak</p>
              <h3 className="text-4xl font-extrabold text-slate-900 group-hover:text-white leading-[1.1] tracking-tighter">
                {highestSoldDish.dishName}
              </h3>
            </div>

            <div className="relative z-10 mt-12">
               <div className="flex items-baseline space-x-3">
                 <span className="text-6xl font-black text-slate-900 group-hover:text-indigo-100 tracking-tighter">{highestSoldDish.totalSold}</span>
                 <span className="text-slate-500 group-hover:text-indigo-300 text-xs font-bold uppercase tracking-widest">Units Sold</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 group-hover:bg-white/20 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-indigo-600 group-hover:bg-emerald-400 w-full transition-all duration-1000"></div>
               </div>
            </div>
          </div>
        )}

        {/* Minimal Performance Chart */}
        <div className={`bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] shadow-card border border-white/60 ${highestSoldDish ? 'lg:col-span-2' : 'lg:col-span-3'} group relative overflow-hidden`}>
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={120} className="text-indigo-600" />
            </div>

          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Operational Velocity</h3>
              <p className="text-slate-400 text-sm mt-1 font-medium italic">Cross-sectional analysis of menu throughput.</p>
            </div>
          </div>
          
          {salesData.length > 0 ? (
            <div className="relative h-[250px] flex items-end justify-between gap-6 px-4 relative z-10">
              {salesData.map((data, index) => {
                const heightPercentage = maxSales > 0 ? (data.totalSold / maxSales) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group/bar relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-6 px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all duration-300 translate-y-4 group-hover/bar:translate-y-0 z-30 whitespace-nowrap shadow-2xl uppercase tracking-widest">
                      <div className="flex items-center space-x-2">
                         <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                         <span>{data.totalSold} Units Shipped</span>
                      </div>
                    </div>
                    
                    {/* Bar container */}
                    <div className="w-full max-w-[48px] bg-slate-100/30 rounded-[1.5rem] h-full flex flex-col justify-end group-hover/bar:bg-white/80 transition-all duration-500 border border-transparent group-hover/bar:border-white/60 overflow-hidden shadow-inner">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover/bar:from-indigo-500 group-hover/bar:to-indigo-300 rounded-2xl transition-all duration-1000 ease-out relative shadow-lg shadow-indigo-100/50"
                        style={{ height: `${heightPercentage}%`, minHeight: '12px' }}
                      >
                         <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    
                    {/* Label */}
                    <p className="text-[10px] font-black text-slate-400 mt-6 text-center truncate w-full group-hover/bar:text-indigo-600 transition-all uppercase tracking-tighter italic">
                      {data.dishName}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-white/20 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-slate-200 relative z-10">
              <Package size={32} className="text-slate-200 mb-4" />
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">No Velocity Data Available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
