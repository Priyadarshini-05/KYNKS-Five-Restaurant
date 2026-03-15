import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Plus, 
  Search, 
  Edit3, 
  CircleX, 
  ChevronRight, 
  Package, 
  LayoutGrid,
  TrendingUp,
  Filter,
  Utensils
} from "lucide-react";

const Menus = () => {
  const { menus, fetchMenus, axios } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const deleteMenu = async (id) => {
    try {
      const { data } = await axios.delete(`/api/menu/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchMenus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("deleteMenu error", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete menu");
    }
  };

  const toggleAvailability = async (id, current) => {
    try {
      const { data } = await axios.put(`/api/menu/update/${id}`, {
        isAvailable: !current,
      });
      if (data.success) {
        toast.success("Availability updated");
        fetchMenus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("toggleAvailability error", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update");
    }
  };

  useEffect(() => {
    if (fetchMenus) fetchMenus();
  }, [fetchMenus]);

  const filteredMenus = menus.filter(menu => 
    menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menu.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Dynamic Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Catalog Intelligence</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Configure and synchronize your active menu inventory.</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Query catalog node..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => navigate("/admin/add-menu")}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-slate-200 shrink-0"
          >
            <Plus size={18} />
            <span>New Offering</span>
          </button>
        </div>
      </div>

      {/* Premium Table Container */}
      <div className="bg-white rounded-[2rem] shadow-card border border-slate-50 relative overflow-hidden">
        <div className="overflow-x-auto scroller max-h-[700px]">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Core Particulars</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Taxonomy</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Unit Valuation</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Lifecycle</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMenus.length > 0 ? (
                filteredMenus.map((item) => (
                  <tr key={item._id} className="group hover:bg-slate-50/20 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative shrink-0">
                           <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-2xl border-2 border-slate-100/50 shadow-sm" />
                           <div className="absolute inset-0 rounded-2xl border border-black/5"></div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 text-[15px] tracking-tight truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">NODE: {item._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 bg-indigo-50/50 text-indigo-700 text-[10px] font-black border border-indigo-100/50 rounded-lg uppercase tracking-wider">
                        {item?.category?.name}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex flex-col items-center">
                         <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Price Point</span>
                         <p className="font-extrabold text-slate-900 text-lg tracking-tighter">
                          <span className="text-xs text-indigo-600 font-bold mr-1 italic">Rs.</span>
                          {item.price}
                        </p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => toggleAvailability(item._id, item.isAvailable)}
                          className={`min-w-[120px] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            item.isAvailable 
                              ? "bg-slate-50 text-emerald-600 border border-emerald-100/50 hover:bg-emerald-600 hover:text-white" 
                              : "bg-slate-50 text-rose-500 border border-rose-100/50 hover:bg-rose-500 hover:text-white"
                          }`}
                        >
                          {item.isAvailable ? "Active Feed" : "Archived"}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3 opacity-30 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => navigate(`/admin/add-menu?id=${item._id}`)}
                          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-slate-100 hover:border-indigo-100"
                        >
                          <Edit3 size={17} />
                        </button>
                        <button
                          onClick={() => deleteMenu(item._id)}
                          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-slate-100 hover:border-rose-100"
                        >
                          <CircleX size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                        <Utensils size={32} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">No Catalog Instances Identified</p>
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

export default Menus;

