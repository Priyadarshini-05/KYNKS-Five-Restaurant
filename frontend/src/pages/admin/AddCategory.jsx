import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Upload, ChevronRight, Image, Layers } from "lucide-react";

const AddCategory = () => {
  const { axios, navigate, loading, setLoading, fetchCategories, categories } = useContext(AppContext);
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    mainType: "",
    image: null,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isEdit && categories.length > 0) {
      const category = categories.find((cat) => cat._id === id);
      if (category) {
        setFormData({
          name: category.name,
          mainType: category.mainType,
          image: category.image,
        });
        setPreview(category.image);
      }
    }
  }, [id, categories, isEdit]);

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
      if (!formData.name) return toast.error("Category designation required");
      if (!formData.mainType) return toast.error("Structural type required");
      if (!formData.image) return toast.error("Media asset required");

      setLoading(true);
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("mainType", formData.mainType);
      
      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      const url = isEdit ? `/api/category/update/${id}` : "/api/category/add";
      const method = isEdit ? "put" : "post";

      const { data } = await axios[method](url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);
        if (fetchCategories) await fetchCategories();
        navigate("/admin/categories");
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
      <div className="max-w-xl w-full">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-card border border-slate-50 relative overflow-hidden">
          {/* Form Header */}
          <div className="mb-10 text-center">
             <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Layers size={32} />
             </div>
             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
               {isEdit ? "Refine Node" : "Register Node"}
             </h2>
             <p className="text-slate-500 text-sm mt-2 font-medium">Define structural parameters for your catalog hierarchy.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
               {/* Name Field */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Node Designation</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-500/30 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  placeholder="e.g. Continental Delights"
                />
              </div>

               {/* Type Field */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Structural Type</label>
                <input
                  type="text"
                  name="mainType"
                  value={formData.mainType}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-500/30 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  placeholder="e.g. Vegetarian"
                />
              </div>

              {/* Media Asset */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Visual Narrative</label>
                <div className="flex flex-col gap-4">
                   {preview && (
                    <div className="w-full h-48 bg-slate-50 rounded-[2rem] p-4 border border-slate-100 relative group overflow-hidden shadow-inner">
                       <img src={preview} alt="preview" className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  )}
                  
                  <input type="file" id="fileUpload" className="hidden" onChange={handleFileChange} />
                  <label
                    htmlFor="fileUpload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-100 rounded-[2rem] cursor-pointer hover:border-indigo-500/30 hover:bg-slate-50/50 transition-all group shadow-sm bg-white"
                  >
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                      <Upload size={20} />
                    </div>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-8 text-center leading-relaxed">
                      {file ? file.name : "Sync higher-res media asset"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all active:scale-[0.97] shadow-xl shadow-slate-200 disabled:opacity-50 mt-4 relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? "Processing Hierarchy..." : (isEdit ? "Synchronize Node" : "Commit Node")}</span>
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
