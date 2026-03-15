import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { 
  Plus, 
  Search, 
  Edit3, 
  CircleX, 
  ChevronRight, 
  FolderTree,
  Package,
  ArrowUpRight,
  Layers,
  Tag
} from "lucide-react";

const Categories = () => {
  const { categories, fetchCategories, axios, navigate } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (fetchCategories) fetchCategories();
  }, [fetchCategories]);

  const deleteCategory = async (id) => {
    try {
      const { data } = await axios.delete(`/api/category/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete category");
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.mainType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Category Architecture Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Category Hierarchy</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Manage and organize your structural menu taxonomy.</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Filter taxonomy node..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => navigate("/admin/add-category")}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-slate-200 shrink-0"
          >
            <Plus size={18} />
            <span>New Node</span>
          </button>
        </div>
      </div>

      {/* Hierarchy Manifest Table */}
      <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-50 relative overflow-hidden">
        <div className="overflow-x-auto scroller h-[650px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
               <tr className="bg-slate-50/30">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Node Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Classification</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Reference</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((item) => (
                  <tr key={item._id} className="group hover:bg-slate-50/20 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-5">
                        <div className="relative shrink-0">
                           <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-2xl border-2 border-slate-100/50 shadow-sm" />
                           <div className="absolute inset-0 rounded-2xl border border-black/5"></div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 text-[15px] tracking-tight truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">CAT_ID: {item._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3.5 py-1.5 bg-indigo-50/50 text-indigo-700 text-[10px] font-black border border-indigo-100/50 rounded-lg uppercase tracking-wider">
                        <Layers size={11} className="mr-2" />
                        {item.mainType}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center space-x-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                        <Tag size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Linked</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end space-x-3 opacity-30 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => navigate(`/admin/edit-category/${item._id}`)}
                          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-slate-100 hover:border-indigo-100"
                        >
                          <Edit3 size={17} />
                        </button>
                        <button
                          onClick={() => deleteCategory(item._id)}
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
                  <td colSpan="4" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                        <Layers size={32} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">No Taxonomy Nodes Detected</p>
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

export default Categories;

