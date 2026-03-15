import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MenuCard from "../components/MenuCard";
import { Heart } from "lucide-react";

const Wishlist = () => {
    const { wishlist, navigate } = useContext(AppContext);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        My <span className="text-yellow-500">Favorites</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Your personal collection of delicious dishes you love.
                    </p>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                            <MenuCard menu={item.menuItem} key={item._id} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                        <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Explore our menu and save your favorite dishes here!
                        </p>
                        <button
                            onClick={() => navigate("/menu")}
                            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                        >
                            Go to Menu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
