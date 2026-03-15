import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Camera, Upload, X, MapPin, User, MessageSquare } from "lucide-react";

const Gallery = () => {
    const { gallery, user, uploadToGallery, navigate } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [experience, setExperience] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("experience", experience);

        const success = await uploadToGallery(formData);
        if (success) {
            setShowModal(false);
            setImage(null);
            setPreview(null);
            setExperience("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Community <span className="text-yellow-500">Gallery</span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Explore the amazing experiences shared by our community. Upload your own memories and join the stories!
                        </p>
                    </div>
                    <button
                        onClick={() => (user ? setShowModal(true) : navigate("/login"))}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 self-start md:self-center"
                    >
                        <Camera className="w-5 h-5" />
                        Share Your Experience
                    </button>
                </div>

                {/* Gallery Grid */}
                {gallery.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {gallery.map((item) => (
                            <div key={item._id} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt="Dining experience"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <p className="text-white text-sm line-clamp-3">
                                            "{item.experience}"
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-yellow-100 p-2 rounded-full">
                                            <User className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <p className="font-bold text-gray-800">{item.user?.name || "Guest"}</p>
                                    </div>
                                    <div className="flex items-start gap-2 text-gray-500 text-sm">
                                        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p className="line-clamp-2 italic">"{item.experience}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-gray-50 max-w-4xl mx-auto">
                        <div className="bg-yellow-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <Camera className="w-12 h-12 text-yellow-500" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                            Be the first to share!
                        </h2>
                        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
                            Our gallery is waiting for your beautiful food moments. Share your dining experience with us today!
                        </p>
                        <button
                            onClick={() => (user ? setShowModal(true) : navigate("/login"))}
                            className="px-10 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Upload Photo
                        </button>
                    </div>
                )}

                {/* Upload Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
                        <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-gray-900">Share Your Experience</h3>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleUpload} className="space-y-6">
                                    <div className="relative group">
                                        {preview ? (
                                            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-gray-200">
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => { setImage(null); setPreview(null); }}
                                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-yellow-400 cursor-pointer transition-all group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-yellow-500 transition-colors mb-3" />
                                                    <p className="text-sm font-bold text-gray-600">Click to upload photo</p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                                </div>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                                            </label>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tell us about your experience</label>
                                        <textarea
                                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all resize-none bg-gray-50 text-gray-700 min-h-[120px]"
                                            placeholder="How was the food? How was the service?"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!image || !experience}
                                        className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-2"
                                    >
                                        Post to Gallery
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
