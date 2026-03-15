import { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { Search, X, Filter, ChevronRight, AlertCircle } from "lucide-react";
import MenuCard from "../components/MenuCard";
import { useSearchParams } from "react-router-dom";

const Menu = () => {
  const { menus, categories } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainType, setSelectedMainType] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [filteredMenus, setFilteredMenus] = useState([]);

  // Extract unique mainTypes from categories
  const mainTypes = useMemo(() => ["All", ...new Set(categories.map((cat) => cat.mainType))], [categories]);

  // Derive sub-categories based on selected main category
  const visibleSubCategories = useMemo(() => {
    if (selectedMainType === "All") {
      return ["All", ...categories.map(cat => cat.name)];
    }
    return ["All", ...categories.filter(cat => cat.mainType === selectedMainType).map(cat => cat.name)];
  }, [categories, selectedMainType]);

  const urlCategory = searchParams.get("category");

  // Sync state with URL params on mount
  useEffect(() => {
    if (urlCategory) {
      const foundCategory = categories.find(cat => cat.name === urlCategory);
      if (foundCategory) {
        setSelectedMainType(foundCategory.mainType);
        setSelectedSubCategory(urlCategory);
      }
    }
  }, [urlCategory, categories]);

  // Filtering Logic
  useEffect(() => {
    let filtered = menus;

    // Apply Search filter
    if (searchQuery) {
      filtered = filtered.filter((menu) =>
        menu.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    // Apply Main Type filter
    if (selectedMainType !== "All") {
      filtered = filtered.filter((menu) => {
        const menuCategory = menu.category;
        
        // Check both populated object and potential string fallback
        let menuMainType = "";
        if (typeof menuCategory === "object" && menuCategory !== null) {
          menuMainType = menuCategory.mainType || "";
        } else if (typeof menuCategory === "string") {
          // If not populated, we try to find the category in the categories array
          const catObj = categories.find(c => c._id === menuCategory);
          menuMainType = catObj?.mainType || "";
        }
        
        return menuMainType.trim().toLowerCase() === selectedMainType.trim().toLowerCase();
      });
    }

    // Apply Sub Category filter
    if (selectedSubCategory !== "All") {
      filtered = filtered.filter((menu) => {
        const menuCategory = menu.category;
        
        let menuSubName = "";
        if (typeof menuCategory === "object" && menuCategory !== null) {
          menuSubName = menuCategory.name || "";
        } else if (typeof menuCategory === "string") {
          const catObj = categories.find(c => c._id === menuCategory);
          menuSubName = catObj?.name || "";
        }
        
        return menuSubName.trim().toLowerCase() === selectedSubCategory.trim().toLowerCase();
      });
    }

    setFilteredMenus(filtered);
  }, [searchQuery, menus, selectedMainType, selectedSubCategory, categories]);

  const handleMainTypeChange = (type) => {
    setSelectedMainType(type);
    setSelectedSubCategory("All"); // Reset sub-category when main type changes
    if (urlCategory) {
      searchParams.delete("category");
      setSearchParams(searchParams);
    }
  };

  const handleSubCategoryChange = (name) => {
    setSelectedSubCategory(name);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedMainType("All");
    setSelectedSubCategory("All");
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-yellow-500">Menu</span>
          </h1>
          
          {/* Debug Info (Visible only if zero results or explicitly needed) */}
          {menus.length > 0 && filteredMenus.length === 0 && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs font-mono text-blue-800">
              <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider">
                <AlertCircle size={14} /> Local Debug Info
              </div>
              <p>Total Menus: {menus.length}</p>
              <p>Selected Main: "{selectedMainType}"</p>
              <p>Selected Sub: "{selectedSubCategory}"</p>
              <p>Sample Menu Category Type: {typeof menus[0].category}</p>
              <p>Sample Menu Category Value: {JSON.stringify(menus[0].category)}</p>
              <p className="mt-2 text-blue-600">Tip: If "Category Value" is just a string, the backend population is missing or failed.</p>
            </div>
          )}

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for your favorite dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-full border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-colors duration-300 text-gray-700 placeholder-gray-400 shadow-lg bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Container */}
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
            {/* Row 1: Main Category */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                Main Category <ChevronRight size={12} />
              </span>
              <div className="flex flex-wrap justify-center gap-3">
                {mainTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleMainTypeChange(type)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      selectedMainType === type
                        ? "bg-gray-900 text-white scale-105 shadow-md"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Sub Category */}
            <div className="flex flex-col items-center gap-3 border-t pt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                Sub Category <ChevronRight size={12} />
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {visibleSubCategories.map((name) => (
                  <button
                    key={name}
                    onClick={() => handleSubCategoryChange(name)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                      selectedSubCategory === name
                        ? "bg-yellow-500 text-white border-yellow-500 shadow-sm"
                        : "bg-white text-gray-600 border-gray-100 hover:border-yellow-200 hover:bg-yellow-50"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 flex justify-between items-center px-4">
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <Filter size={16} className="text-yellow-500" />
            Showing <span className="text-gray-900 font-bold">{filteredMenus.length}</span> items
          </p>
          {(selectedMainType !== "All" || selectedSubCategory !== "All" || searchQuery) && (
            <button 
              onClick={handleReset}
              className="text-yellow-600 text-sm font-bold hover:underline flex items-center gap-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Menu Grid */}
        {filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
            {filteredMenus.map((menu) => (
              <MenuCard menu={menu} key={menu._id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-inner border border-gray-100 mx-4">
            <div className="text-gray-300 mb-6 flex justify-center">
              <Search size={64} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No matching dishes</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 px-4">
              We couldn't find any items matching your current filters. Try adjusting your search or category selection.
            </p>
            <button
              onClick={handleReset}
              className="px-10 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-bold transition-all duration-300 shadow-xl shadow-yellow-100 hover:scale-105"
            >
              Show All Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Menu;
