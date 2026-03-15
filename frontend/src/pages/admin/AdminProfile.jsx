import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";

const AdminProfile = () => {
  const { admin, setAdmin } = useContext(AppContext);
  const [name, setName] = useState(admin?.name || "Admin");
  const [email, setEmail] = useState(admin?.email || "");
  const [avatar, setAvatar] = useState(admin?.avatar || null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedAdmin = {
      ...admin,
      name,
      email,
      avatar,
    };
    setAdmin(updatedAdmin);
    localStorage.setItem("admin", JSON.stringify(updatedAdmin));
  };

  return (
    <div className="flex justify-center py-8">
      <form
        onSubmit={handleSave}
        className="w-full max-w-md bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Admin Profile
        </h2>
        <div className="flex flex-col items-center gap-3 mb-4">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300" />
          )}
          <label className="text-sm text-blue-600 cursor-pointer">
            Upload Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="mt-2 bg-orange-500 text-white py-2 rounded-md cursor-pointer"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;


