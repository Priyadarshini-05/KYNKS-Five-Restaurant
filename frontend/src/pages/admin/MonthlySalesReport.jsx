import { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import { Server } from "../../App";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  FileText,
  DollarSign,
  ShoppingCart,
  Award,
  ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";

const MonthlySalesReport = () => {
  const { axios } = useContext(AppContext);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      console.log(`Fetching report for ${selectedYear}-${selectedMonth} from ${Server}/api/admin/monthly-sales-report`);
      const { data } = await axios.get(`${Server}/api/admin/monthly-sales-report`, {
        params: { year: selectedYear, month: selectedMonth },
        withCredentials: true,
      });
      console.log("Report Data Received:", data);
      if (data.success) {
        setReportData(data.data);
      } else {
        toast.error(data.message || "Failed to fetch sales report");
      }
    } catch (error) {
      console.error("Error fetching report", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch sales report";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const downloadCSV = () => {
    if (!reportData) return;

    const headers = ["Dish Name", "Quantity Sold"];
    const rows = reportData.dishSales.map(item => [item.dishName, item.totalQuantity]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sales_Report_${selectedYear}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (loading && !reportData) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 min-h-screen pb-20">
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Monthly Sales Report</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-medium italic">Strategic revenue intelligence and market performance orchestration.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-4 bg-white/40 backdrop-blur-xl p-3 rounded-[2rem] border border-white/60 shadow-xl group transition-all hover:bg-white/60">
            <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg ring-4 ring-blue-500/10 group-hover:rotate-12 transition-transform">
              <Calendar size={20} />
            </div>
            <div className="flex space-x-4 pr-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Month</span>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-transparent border-none focus:ring-0 font-black text-slate-900 cursor-pointer text-sm p-0 uppercase tracking-tight"
                >
                  {months.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Year</span>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent border-none focus:ring-0 font-black text-slate-900 cursor-pointer text-sm p-0 uppercase tracking-tight"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <button 
              onClick={fetchReport}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {loading ? "..." : "Generate"}
            </button>
          </div>

          <button 
            onClick={downloadCSV}
            className="flex items-center space-x-2 px-6 py-4 bg-slate-900 text-white rounded-[2rem] hover:bg-slate-800 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 group"
          >
            <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-card group hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg">
                  <ShoppingCart size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Volume</span>
              </div>
              <h3 className="text-4xl font-black text-slate-900">{reportData.stats.totalOrders}</h3>
              <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest">Total Successful Orders</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-card group hover:-translate-y-1 transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-100/50">
              <DollarSign size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Revenue</span>
          </div>
          <h3 className="text-4xl font-black text-slate-900 leading-tight">Rs. {reportData.stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest italic">Net Sales Liquidity</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-card group hover:-translate-y-1 transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl shadow-sm border border-orange-100/50">
              <Award size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Top Node</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 truncate uppercase mt-1 tracking-tighter">
            {reportData.mostOrderedDish?.dishName || "N/A"}
          </h3>
          <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest italic">Market Velocity Leader</p>
        </div>
      </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Daily Trend Chart */}
            <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-card border border-white/80 flex flex-col group overflow-hidden">
              <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-slate-100/50">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Daily Revenue Velocity</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Timeline fluctuation</p>
                </div>
              </div>
              <div className="relative h-64 mt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="revenueFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  {[0, 50, 100, 150, 200].map(h => (
                    <line key={h} x1="0" y1={h} x2="400" y2={h} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                  ))}
                  
                  {reportData.dailyTrend.length > 0 && (
                    <>
                      <path
                        d={reportData.dailyTrend.reduce((acc, curr, i) => {
                          const maxVal = Math.max(...reportData.dailyTrend.map(d => d.totalSales), 1);
                          const x = (curr.day / 31) * 400;
                          const y = 200 - (curr.totalSales / maxVal) * 160 - 20;
                          return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                        }, "") + " L 400 200 L 0 200 Z"}
                        fill="url(#revenueFill)"
                        className="animate-in fade-in duration-1000"
                      />
                      <path
                        d={reportData.dailyTrend.reduce((acc, curr, i) => {
                          const maxVal = Math.max(...reportData.dailyTrend.map(d => d.totalSales), 1);
                          const x = (curr.day / 31) * 400;
                          const y = 200 - (curr.totalSales / maxVal) * 160 - 20;
                          return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                        }, "")}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'draw 2s ease-out forwards' }}
                      />
                    </>
                  )}
                </svg>
              </div>
              <div className="flex justify-between mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                <span>Day 01</span>
                <span>Day 15</span>
                <span>Day 31</span>
              </div>
            </div>

            {/* Top Dishes Bar Chart */}
            <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-card border border-white/80 flex flex-col group">
              <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-slate-100/50">
                <div className="p-3 bg-orange-600 text-white rounded-2xl shadow-lg">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Top Dish Consumption</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Market share ranking</p>
                </div>
              </div>
              <div className="space-y-6">
                {reportData.topDishes.map((dish, i) => {
                  const maxQty = Math.max(...reportData.topDishes.map(d => d.totalQuantity), 1);
                  const percentage = (dish.totalQuantity / maxQty) * 100;
                  return (
                    <div key={dish.dishId} className="space-y-2">
                      <div className="flex justify-between text-[11px] font-black text-slate-900 uppercase tracking-tighter italic">
                        <span>{dish.dishName}</span>
                        <span>{dish.totalQuantity} Sold</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-1000"
                          style={{ width: '0%', animation: `grow ${1 + i * 0.2}s forwards` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Table */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-card border border-white/80 overflow-hidden group">
              <div className="p-10 border-b border-slate-100/50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-900 text-white rounded-2xl">
                    <FileText size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Full Inventory Sales Metric</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rank</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dish Identity</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Consumption Velocity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {reportData.dishSales.map((dish, index) => (
                      <tr key={dish.dishId} className="hover:bg-blue-50/30 transition-colors group/row">
                        <td className="px-10 py-6">
                          <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-black text-xs italic group-hover/row:bg-blue-600 group-hover/row:text-white transition-all">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <span className="font-extrabold text-slate-900 uppercase tracking-tighter text-sm italic group-hover/row:text-blue-600 transition-colors">{dish.dishName}</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <span className="font-black text-slate-900 text-lg tabular-nums">{dish.totalQuantity}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-2">Units</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes grow { from { width: 0%; } to { width: var(--final-width); } }
        .scroller::-webkit-scrollbar { width: 6px; }
        .scroller::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
      <script>{`
        document.querySelectorAll('[style*="width: 0%"]').forEach(el => {
          el.style.setProperty('--final-width', el.parentElement.getAttribute('data-percentage') + '%');
        });
      `}</script>
    </div>
  );
};

export default MonthlySalesReport;
