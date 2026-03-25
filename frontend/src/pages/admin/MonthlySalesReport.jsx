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
  BookOpen,
  CalendarDays
} from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MonthlySalesReport = () => {
  const { axios } = useContext(AppContext);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("sales"); // 'sales', 'orders', 'table_books', 'event_books'
  
  const [salesData, setSalesData] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [tableBooksData, setTableBooksData] = useState(null);
  const [eventBooksData, setEventBooksData] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const isSameMonthYear = (dateString, month, year) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (activeTab === "sales") {
        const { data } = await axios.get(`${Server}/api/admin/monthly-sales-report`, {
          params: { year: selectedYear, month: selectedMonth },
          withCredentials: true,
        });
        if (data.success) setSalesData(data.data);
        else toast.error(data.message || "Failed to fetch sales report");
      } 
      else if (activeTab === "orders") {
        const { data } = await axios.get(`${Server}/api/order/orders`, { withCredentials: true });
        if (data.success) {
          const filtered = data.orders.filter(o => isSameMonthYear(o.createdAt, selectedMonth, selectedYear));
          setOrdersData(filtered);
        } else toast.error(data.message || "Failed to fetch orders");
      }
      else if (activeTab === "table_books") {
        const { data } = await axios.get(`${Server}/api/booking/bookings`, { withCredentials: true });
        if (data.success) {
          const filtered = data.bookings.filter(b => isSameMonthYear(b.date, selectedMonth, selectedYear));
          setTableBooksData(filtered);
        } else toast.error(data.message || "Failed to fetch table bookings");
      }
      else if (activeTab === "event_books") {
        const { data } = await axios.get(`${Server}/api/event/all-events`, { withCredentials: true });
        if (data.success) {
          const filtered = data.events.filter(e => isSameMonthYear(e.date, selectedMonth, selectedYear));
          setEventBooksData(filtered);
        } else toast.error(data.message || "Failed to fetch event bookings");
      }
    } catch (error) {
      console.error("Error fetching report", error);
      toast.error(error.response?.data?.message || "Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when tab changes
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // -- PDF Generators --

  const generateSalesPDF = () => {
    if (!salesData) return;
    const doc = new jsPDF();
    doc.text(`Monthly Sales Report - ${months[selectedMonth - 1]} ${selectedYear}`, 14, 15);
    
    autoTable(doc, {
      head: [["Rank", "Dish Name", "Quantity Sold"]],
      body: salesData.dishSales.map((item, i) => [i + 1, item.dishName, item.totalQuantity]),
      startY: 20,
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Orders: ${salesData.stats.totalOrders}`, 14, finalY);
    doc.text(`Total Revenue: Rs. ${salesData.stats.totalRevenue.toLocaleString()}`, 14, finalY + 10);
    doc.text(`Top Dish: ${salesData.mostOrderedDish?.dishName || 'N/A'}`, 14, finalY + 20);

    doc.save(`Sales_Report_${selectedYear}_${months[selectedMonth-1]}.pdf`);
  };

  const generateOrdersPDF = () => {
    if (!ordersData) return;
    const doc = new jsPDF();
    doc.text(`Orders Report - ${months[selectedMonth - 1]} ${selectedYear}`, 14, 15);
    
    autoTable(doc, {
      head: [["Order ID", "Date", "Status", "Amount", "Payment"]],
      body: ordersData.map(o => [
        o._id.substring(0, 8) + '...',
        new Date(o.createdAt).toLocaleDateString(),
        o.status,
        `Rs. ${o.totalAmount}`,
        o.paymentMethod
      ]),
      startY: 20,
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalRevenue = ordersData.reduce((acc, curr) => acc + curr.totalAmount, 0);
    doc.text(`Total Orders: ${ordersData.length}`, 14, finalY);
    doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString()}`, 14, finalY + 10);

    doc.save(`Orders_Report_${selectedYear}_${months[selectedMonth-1]}.pdf`);
  };

  const generateTableBookingsPDF = () => {
    if (!tableBooksData) return;
    const doc = new jsPDF();
    doc.text(`Table Reservations Report - ${months[selectedMonth - 1]} ${selectedYear}`, 14, 15);
    
    autoTable(doc, {
      head: [["Name", "Phone", "Date", "Time", "Guests", "Status"]],
      body: tableBooksData.map(b => [
        b.name,
        b.phone,
        new Date(b.date).toLocaleDateString(),
        b.time,
        b.numberOfPeople,
        b.status
      ]),
      startY: 20,
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Reservations: ${tableBooksData.length}`, 14, finalY);

    doc.save(`TableReservations_Report_${selectedYear}_${months[selectedMonth-1]}.pdf`);
  };

  const generateEventBookingsPDF = () => {
    if (!eventBooksData) return;
    const doc = new jsPDF();
    doc.text(`Event Reservations Report - ${months[selectedMonth - 1]} ${selectedYear}`, 14, 15);
    
    autoTable(doc, {
      head: [["User/Email", "Event", "Type", "Date", "Time", "Guests", "Status"]],
      body: eventBooksData.map(e => [
        e.user?.email || e.user?.name || 'N/A',
        e.eventName,
        e.eventType,
        new Date(e.date).toLocaleDateString(),
        e.time,
        e.guestCount,
        e.status
      ]),
      startY: 20,
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Events: ${eventBooksData.length}`, 14, finalY);

    doc.save(`EventReservations_Report_${selectedYear}_${months[selectedMonth-1]}.pdf`);
  };

  // -- Render Helpers --

  const tabs = [
    { id: "sales", label: "Monthly Sales", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "table_books", label: "Table Reservations", icon: BookOpen },
    { id: "event_books", label: "Event Reservations", icon: CalendarDays }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 min-h-screen pb-20">
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Reports</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-medium italic">Comprehensive insights and professional PDF generation.</p>
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
                  {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Year</span>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent border-none focus:ring-0 font-black text-slate-900 cursor-pointer text-sm p-0 uppercase tracking-tight"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
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
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-t-2xl font-bold text-sm transition-all whitespace-nowrap
                ${isActive ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          
          {/* SALES TAB */}
          {activeTab === "sales" && salesData && (
            <div className="space-y-10">
              <div className="flex justify-end">
                <button onClick={generateSalesPDF} className="flex items-center space-x-2 px-6 py-3 bg-red-600/90 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-xs uppercase shadow-lg shadow-red-200">
                  <Download size={16} /> <span>Download PDF</span>
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><ShoppingCart size={24} /></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Volume</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">{salesData.stats.totalOrders}</h3>
                  <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest">Successful Orders</p>
                </div>

                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign size={24} /></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Revenue</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 leading-tight">Rs. {salesData.stats.totalRevenue.toLocaleString()}</h3>
                  <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest italic">Net Sales</p>
                </div>

                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Award size={24} /></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Top Node</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 truncate uppercase mt-1 tracking-tighter">
                    {salesData.mostOrderedDish?.dishName || "N/A"}
                  </h3>
                  <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest italic">Market Velocity</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-card border border-white/80 flex flex-col">
                  <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-slate-100/50">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg"><TrendingUp size={20} /></div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Daily Revenue Velocity</h3>
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
                      {[0, 50, 100, 150, 200].map(h => <line key={h} x1="0" y1={h} x2="400" y2={h} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />)}
                      {salesData.dailyTrend.length > 0 && (
                        <>
                          <path
                            d={salesData.dailyTrend.reduce((acc, curr, i) => {
                              const maxVal = Math.max(...salesData.dailyTrend.map(d => d.totalSales), 1);
                              const x = (curr.day / 31) * 400;
                              const y = 200 - (curr.totalSales / maxVal) * 160 - 20;
                              return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                            }, "") + " L 400 200 L 0 200 Z"}
                            fill="url(#revenueFill)"
                          />
                          <path
                            d={salesData.dailyTrend.reduce((acc, curr, i) => {
                              const maxVal = Math.max(...salesData.dailyTrend.map(d => d.totalSales), 1);
                              const x = (curr.day / 31) * 400;
                              const y = 200 - (curr.totalSales / maxVal) * 160 - 20;
                              return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                            }, "")}
                            fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                          />
                        </>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-card border border-white/80 flex flex-col">
                  <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-slate-100/50">
                    <div className="p-3 bg-orange-600 text-white rounded-2xl shadow-lg"><BarChart3 size={20} /></div>
                    <div><h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Top Dish Consumption</h3></div>
                  </div>
                  <div className="space-y-6">
                    {salesData.topDishes.map((dish, i) => {
                      const maxQty = Math.max(...salesData.topDishes.map(d => d.totalQuantity), 1);
                      const percentage = (dish.totalQuantity / maxQty) * 100;
                      return (
                        <div key={dish.dishId} className="space-y-2">
                          <div className="flex justify-between text-[11px] font-black text-slate-900 uppercase tracking-tighter italic">
                            <span>{dish.dishName}</span>
                            <span>{dish.totalQuantity} Sold</span>
                          </div>
                          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-rose-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && ordersData && (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-card">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Total Orders: {ordersData.length}</h3>
                  <p className="text-slate-500 mt-1 font-medium">Revenue: Rs. {ordersData.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}</p>
                </div>
                <button onClick={generateOrdersPDF} className="flex items-center space-x-2 px-6 py-3 bg-red-600/90 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-xs uppercase shadow-lg shadow-red-200">
                  <Download size={16} /> <span>Download PDF</span>
                </button>
              </div>
              {ordersData.length === 0 ? (
                <p className="text-center text-slate-500 py-10 font-medium">No orders found for this month.</p>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {ordersData.map(o => (
                        <tr key={o._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{o._id.substring(0, 10)}...</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-bold">{o.status}</span></td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">Rs. {o.totalAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TABLE BOOKINGS TAB */}
          {activeTab === "table_books" && tableBooksData && (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-card">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Table Reservations: {tableBooksData.length}</h3>
                </div>
                <button onClick={generateTableBookingsPDF} className="flex items-center space-x-2 px-6 py-3 bg-red-600/90 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-xs uppercase shadow-lg shadow-red-200">
                  <Download size={16} /> <span>Download PDF</span>
                </button>
              </div>
              {tableBooksData.length === 0 ? (
                <p className="text-center text-slate-500 py-10 font-medium">No table reservations found for this month.</p>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Name / Phone</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date & Time</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Guests</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {tableBooksData.map(b => (
                        <tr key={b._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-slate-900">{b.name}</div>
                            <div className="text-xs text-slate-500">{b.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{new Date(b.date).toLocaleDateString()}</div>
                            <div className="text-xs text-slate-500">{b.time}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">{b.numberOfPeople}</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold">{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* EVENT BOOKINGS TAB */}
          {activeTab === "event_books" && eventBooksData && (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-card">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Event Reservations: {eventBooksData.length}</h3>
                </div>
                <button onClick={generateEventBookingsPDF} className="flex items-center space-x-2 px-6 py-3 bg-red-600/90 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-xs uppercase shadow-lg shadow-red-200">
                  <Download size={16} /> <span>Download PDF</span>
                </button>
              </div>
              {eventBooksData.length === 0 ? (
                <p className="text-center text-slate-500 py-10 font-medium">No event reservations found for this month.</p>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Event Details</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date & Time</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Guests</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {eventBooksData.map(e => (
                        <tr key={e._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-slate-900">{e.eventName}</div>
                            <div className="text-xs text-slate-500 border border-slate-200 rounded px-1 w-max mt-1">{e.eventType}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{new Date(e.date).toLocaleDateString()}</div>
                            <div className="text-xs text-slate-500">{e.time}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">{e.guestCount}</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-xs font-bold">{e.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default MonthlySalesReport;
