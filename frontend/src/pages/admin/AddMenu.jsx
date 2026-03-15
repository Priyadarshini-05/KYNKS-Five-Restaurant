import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Upload, ChevronRight, Package } from "lucide-react";

const AddMenu = () => {
  const { axios, navigate, loading, setLoading, categories, fetchMenus } =
    useContext(AppContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("id");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!editId) return;
      try {
        const { data } = await axios.get("/api/menu/all");
        if (data.success) {
          const existing = data.menuItems.find((m) => m._id === editId);
          if (existing) {
            setFormData({
              name: existing.name,
              price: existing.price,
              description: existing.description,
              category: existing.category?._id || "",
              image: null,
            });
            setPreview(existing.image);
          }
        }
      } catch (error) {
        console.error("fetchMenu error", error);
      }
    };
    fetchMenu();
  }, [editId, axios]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormData({ ...formData, image: selectedFile });
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.price || !formData.description) return toast.error("Fill all core identifiers");
      if (!formData.category) return toast.error("Classification required");
      if (!editId && !formData.image) return toast.error("Visual asset required");

      setLoading(true);
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", formData.price);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      if (formData.image) {
        payload.append("image", formData.image);
      }

      const url = editId ? `/api/menu/update/${editId}` : "/api/menu/add";
      const { data } = await axios({
        method: editId ? "put" : "post",
        url,
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success(data.message || "Catalog updated");
        if (fetchMenus) await fetchMenus();
        navigate("/admin/menus");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="max-w-4xl w-full px-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-card border border-slate-50 relative overflow-hidden">
          {/* Header Section */}
          <div className="mb-12 border-b border-slate-50 pb-10">
             <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200">
                <Package size={32} />
             </div>
             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
               {editId ? "Refine Catalog Item" : "Register New Dish"}
             </h2>
             <p className="text-slate-500 text-sm mt-2 font-medium">Configure deep particulars for your menu portfolio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Name */}
              <div className="md:col-span-2 space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Dish Designation</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-500/30 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  placeholder="e.g. Signature Truffle Pasta"
                />
              </div>

              {/* Price */}
              <div className="space-y-2.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Terminal Valuation (Rs)</label>
                 <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-xs italic">Rs.</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-500/30 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                      placeholder="0.00"
                    />
                 </div>
              </div>

              {/* Category */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Node Classification</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-500/30 transition-all text-sm font-bold text-slate-900 appearance-none cursor-pointer shadow-sm shadow-inner"
                  >
                    <option value="">Select taxonomy node</option>
                    {categories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Narrative Profile</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-500/30 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300 resize-none shadow-sm shadow-inner"
                  placeholder="Articulate ingredients, textures, and sensory experience..."
                ></textarea>
              </div>
            </div>

            {/* Media Asset Area */}
            <div className="space-y-6 bg-slate-50/30 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Cinematic Asset</label>
               <div className="flex flex-col xl:flex-row gap-8 items-start">
                  <div className="w-full xl:w-2/3">
                    <input type="file" id="fileUpload" className="hidden" onChange={handleFileChange} />
                    <label
                      htmlFor="fileUpload"
                      className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-100 rounded-[2.5rem] cursor-pointer hover:border-indigo-500/30 hover:bg-white transition-all group shadow-sm bg-white/50"
                    >
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <Upload size={24} />
                      </div>
                      <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest px-10 text-center leading-relaxed">
                        {file ? file.name : "Sync higher-fidelity presentation media"}
                      </span>
                    </label>
                  </div>
                  
                  {preview && (
                    <div className="w-full xl:w-1/3 h-44 bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden relative group shadow-lg">
                      <img src={preview} alt="preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="px-4 py-1.5 bg-slate-900/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">Live Preview</div>
                      </div>
                    </div>
                  )}
               </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-50 mt-4 relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? "Processing Metadata..." : (editId ? "Refine Offering" : "Commit Offering")}</span>
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
