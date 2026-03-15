import { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import { Server } from "../../App";
import { 
  BarChart3, 
  TrendingUp, 
  ChevronDown, 
  Search,
  Calendar,
  Filter,
  ArrowUpRight,
  Utensils
} from "lucide-react";
import toast from "react-hot-toast";

const DishSalesAnalytics = () => {
  const { axios } = useContext(AppContext);
  const [data, setData] = useState({
    monthlySales: [],
    monthlyTopDishes: [],
    dishes: []
  });
  const [selectedDish, setSelectedDish] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get(`${Server}/api/admin/dish-sales`, {
          withCredentials: true,
        });
        if (data.success) {
          setData(data);
          if (data.dishes.length > 0) {
            setSelectedDish(data.dishes[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching analytics", error);
        toast.error("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const trendData = useMemo(() => {
    if (!selectedDish) return [];
    
    // 1. Get current month and year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 2. Generate a continuous list of the last 6 months
    const lastSixMonths = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      let y = currentYear;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      lastSixMonths.push({ year: y, month: m });
    }

    // 3. Map actual sales data to these months
    const dish = data.dishes.find(d => d._id === selectedDish);
    return lastSixMonths.map(({ year, month }) => {
      const actualSale = data.monthlySales.find(item => 
        item.year === year && 
        item.month === month && 
        item.dishName === dish?.name
      );
      return {
        year,
        month,
        dishName: dish?.name || "N/A",
        totalSold: actualSale ? actualSale.totalSold : 0
      };
    });
  }, [selectedDish, data.monthlySales, data.dishes]);

  const maxTrendValue = useMemo(() => {
    return trendData.length > 0 ? Math.max(...trendData.map(d => d.totalSold)) : 0;
  }, [trendData]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Prepare data for charts
  const topDishes = [...data.monthlyTopDishes].slice(0, 5);
  const pieData = data.monthlyTopDishes.reduce((acc, curr) => {
    const existing = acc.find(d => d.name === curr.dishName);
    if (existing) {
      existing.value += curr.totalSold;
    } else {
      acc.push({ name: curr.dishName, value: curr.totalSold });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 4);

  const totalSoldAll = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 min-h-screen pb-20">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dish Order Analytics</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-medium italic">Coordinate inventory intelligence and consumption velocity orchestration.</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white/40 backdrop-blur-xl p-3 rounded-[2rem] border border-white/60 shadow-xl group transition-all hover:bg-white/60">
            <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg ring-4 ring-blue-500/10 group-hover:rotate-12 transition-transform">
                <Filter size={20} />
            </div>
            <div className="flex flex-col pr-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Focus Node</span>
              <select 
                  value={selectedDish} 
                  onChange={(e) => setSelectedDish(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 font-black text-slate-900 cursor-pointer text-sm p-0 uppercase tracking-tight"
              >
                  {data.dishes.map(dish => (
                      <option key={dish._id} value={dish._id} className="font-bold text-slate-900">{dish.name}</option>
                  ))}
              </select>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Metric Card 1: Line Chart (Trends) */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] shadow-card border border-white/80 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp size={120} className="text-blue-600" />
            </div>
            
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-100/50">
                <div className="flex items-center space-x-4">
                    <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-500">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Sales Trajectory</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Cross-month velocity</p>
                    </div>
                </div>
            </div>

            {trendData.length > 0 ? (
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 relative h-[350px] mt-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
                            <defs>
                                <linearGradient id="lineFill" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Horizontal Grid */}
                            {[0, 50, 100, 150, 200].map(p => (
                                <line key={p} x1="-20" y1={p} x2="420" y2={p} stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4 4" />
                            ))}
                            {/* Area Fill */}
                            <path 
                                d={trendData.reduce((acc, curr, i) => {
                                    const x = (i / (trendData.length > 1 ? trendData.length - 1 : 1)) * 400;
                                    const y = 200 - (maxTrendValue > 0 ? (curr.totalSold / maxTrendValue) * 160 + 20 : 100);
                                    return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                                }, "") + ` L 400 200 L 0 200 Z`}
                                fill="url(#lineFill)"
                                className="animate-in fade-in duration-[2000ms]"
                            />
                            {/* Main Line */}
                            <path 
                                d={trendData.reduce((acc, curr, i) => {
                                    const x = (i / (trendData.length > 1 ? trendData.length - 1 : 1)) * 400;
                                    const y = 200 - (maxTrendValue > 0 ? (curr.totalSold / maxTrendValue) * 160 + 20 : 100);
                                    return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                                }, "")}
                                fill="none" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
                                style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'draw 2s ease-out forwards' }}
                            />
                            {/* Points */}
                            {trendData.map((curr, i) => {
                                const x = (i / (trendData.length > 1 ? trendData.length - 1 : 1)) * 400;
                                const y = 200 - (maxTrendValue > 0 ? (curr.totalSold / maxTrendValue) * 160 + 20 : 100);
                                return (
                                    <g key={i} className="group/point cursor-pointer">
                                        <circle cx={x} cy={y} r="10" fill="white" stroke="#2563EB" strokeWidth="4" className="transition-all duration-300 group-hover/point:r-14 shadow-2xl" />
                                        <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-300">
                                            <rect x={x - 25} y={y - 45} width="50" height="25" rx="8" fill="#0F172A" />
                                            <text x={x} y={y - 28} textAnchor="middle" fill="white" fontSize="12" fontWeight="900">{curr.totalSold}</text>
                                        </g>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                    <div className="flex justify-between mt-12 px-4 italic font-black text-slate-400 text-[11px] tracking-widest uppercase">
                        {trendData.map((item, i) => <span key={i}>{monthNames[item.month]}</span>)}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 p-12">
                      <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs">Awaiting Trend Data</p>
                </div>
            )}
        </div>

        {/* Metric Card 2: Pie Chart (Distribution) */}
        <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] shadow-card border border-white/80 flex flex-col group">
             <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-100/50">
                <div className="flex items-center space-x-4">
                    <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg ring-4 ring-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                        <ArrowUpRight size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Market Share</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Inventory distribution</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <div className="relative w-56 h-56">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                       {pieData.reduce((acc, curr, i) => {
                           const startAngle = acc.currentAngle;
                           const sliceAngle = (curr.value / totalSoldAll) * 100;
                           acc.currentAngle += sliceAngle;
                           
                           acc.elements.push(
                               <circle 
                                   key={i} cx="50" cy="50" r="40" 
                                   fill="transparent" stroke={['#2563EB', '#0F172A', '#64748B', '#94A3B8'][i % 4]} 
                                   strokeWidth="15" strokeDasharray={`${sliceAngle} ${100 - sliceAngle}`} 
                                   strokeDashoffset={-startAngle}
                                   className="transition-all duration-1000 hover:stroke-blue-400 cursor-help"
                               />
                           );
                           return acc;
                       }, { currentAngle: 0, elements: [] }).elements}
                       <circle cx="50" cy="50" r="28" fill="white" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-3xl font-black text-slate-900">100<span className="text-sm opacity-30">%</span></p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    {pieData.map((d, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#2563EB', '#0F172A', '#64748B', '#94A3B8'][i % 4] }}></div>
                                <span className="text-slate-600 truncate max-w-[120px]">{d.name}</span>
                            </div>
                            <span className="text-slate-900 italic">{Math.round((d.value/totalSoldAll)*100)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Metric Card 3: Bar Chart (Top Dishes - Rank) */}
        <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl p-12 rounded-[3.5rem] shadow-card border border-white/80 group">
             <div className="flex items-center justify-between mb-16 pb-8 border-b border-slate-100/50">
                <div className="flex items-center space-x-6">
                    <div className="p-5 bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded-3xl shadow-2xl shadow-orange-100 group-hover:rotate-[360deg] transition-all duration-1000">
                        <Utensils size={32} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Dominant Assets</h3>
                        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-2">Top 5 Revenue & Volume Drivers</p>
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-end">
                    <p className="text-4xl font-black text-slate-900 leading-none">05</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Active Nodes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-end min-h-[400px]">
                {topDishes.map((item, i) => {
                    const height = (item.totalSold / Math.max(...topDishes.map(d => d.totalSold))) * 100;
                    return (
                        <div key={i} className="flex flex-col items-center group/bar relative pt-10">
                            <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-all duration-500 transform group-hover/bar:-translate-y-2">
                                <div className="bg-slate-900 text-white px-5 py-2 rounded-2xl font-black text-lg shadow-2xl">
                                    {item.totalSold}
                                </div>
                            </div>
                            <div 
                                className="w-full bg-slate-100 rounded-[2rem] relative overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-blue-200"
                                style={{ height: `${height * 3}px` }}
                            >
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-700 to-blue-500 transition-all duration-1000 ease-out" style={{ height: '0%', animation: `grow ${1 + i * 0.2}s forwards` }}>
                                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                                </div>
                            </div>
                            <div className="mt-8 text-center space-y-2">
                                <p className="font-black text-slate-900 uppercase tracking-tighter text-sm italic group-hover/bar:text-blue-600 transition-colors">{item.dishName}</p>
                                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{monthNames[item.month]} Analytics</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <style>{`
                @keyframes grow { from { height: 0%; } to { height: 100%; } }
                @keyframes draw { to { stroke-dashoffset: 0; } }
            `}</style>
        </div>
      </div>
    </div>
  );
};



export default DishSalesAnalytics;
