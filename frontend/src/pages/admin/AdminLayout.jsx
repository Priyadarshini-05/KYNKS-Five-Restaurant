import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  LayoutDashboard,
  Plus,
  Package,
  Grid3X3,
  ShoppingCart,
  BookOpen,
  Calendar,
  X,
  Menu,
  BarChart3,
  FileText,
  Bell,
  LogOut,
  Search,
  ChevronRight,
  Settings
} from "lucide-react";

import { Link, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const AdminLayout = () => {
  const { admin, setAdmin, axios } = useContext(AppContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: "/admin", name: "Overview", icon: LayoutDashboard, exact: true },
    { path: "/admin/add-category", name: "New Category", icon: Plus },
    { path: "/admin/add-menu", name: "New Menu", icon: Plus },
    { path: "/admin/categories", name: "Categories", icon: Grid3X3 },
    { path: "/admin/menus", name: "Menus", icon: Package },
    { path: "/admin/orders", name: "Orders", icon: ShoppingCart },
    { path: "/admin/analytics", name: "Analytics", icon: BarChart3 },
    { path: "/admin/reports", name: "Reports", icon: FileText },
    { path: "/admin/bookings", name: "Table Books", icon: BookOpen },
    { path: "/admin/event-bookings", name: "Event Books", icon: Calendar },
    { path: "/admin/profile", name: "Settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (data.success) {
        toast.success(data.message);
        setAdmin(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/80 font-sans antialiased text-slate-900">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Minimal Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white shadow-soft transition-all duration-500 ease-in-out
          lg:static lg:translate-x-0 border-r border-slate-100/50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo Section */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} h-20 border-b border-slate-50`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                <LayoutDashboard className="text-white" size={20} />
              </div>
              {!isCollapsed && (
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  Panel<span className="text-indigo-600">Pro</span>
                </span>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scroller">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-3 rounded-xl transition-all relative
                  ${isActive(item.path)
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                `}
              >
                <item.icon 
                  size={19} 
                  className={`transition-colors ${isActive(item.path) ? "text-indigo-600" : "group-hover:text-slate-900"}`} 
                />
                {!isCollapsed && <span className="ml-3 text-sm">{item.name}</span>}
                
                {isActive(item.path) && (
                   <div className="absolute left-0 w-1.5 h-6 bg-indigo-600 rounded-r-full shadow-lg shadow-indigo-600/20" />
                )}

                {isCollapsed && (
                   <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl uppercase tracking-widest">
                    {item.name}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer Card */}
          <div className="p-4 border-t border-slate-50">
             <div className={`p-4 bg-slate-50 rounded-2xl flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm shrink-0">
                  {admin?.name?.charAt(0) || "A"}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{admin?.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Admin</p>
                  </div>
                )}
             </div>
          </div>

          {/* Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3.5 top-24 w-7 h-7 bg-white border border-slate-100 rounded-full items-center justify-center text-slate-400 hover:text-indigo-600 shadow-soft transition-all z-50"
          >
            <ChevronRight size={14} className={`transition-transform duration-500 ${isCollapsed ? "" : "rotate-180"}`} />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Elegant Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 border-b border-slate-100/50 shadow-soft">
          {/* Mobile Opener */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500"
          >
            <Menu size={20} />
          </button>

          {/* Search Area */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search size={17} />
              </div>
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors hover:bg-indigo-50 rounded-xl">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-px bg-slate-100" />
            <button 
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content View */}
        <main className="flex-1 overflow-y-auto scroller">
          <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
