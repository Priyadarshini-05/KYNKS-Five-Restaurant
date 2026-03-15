import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const MyOrders = () => {
  const { axios, user, authLoading } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/my-orders");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">My <span className="text-yellow-500">Orders</span></h2>
          <p className="text-gray-500">Please login to view your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            My <span className="text-yellow-500">Orders</span>
          </h2>
          <p className="text-gray-500">Track and view your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white shadow-sm border border-gray-100 rounded-3xl">
            <p className="text-gray-500 text-lg">You have no orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-yellow-200 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-50 pb-4 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider text-sm">
                      Order ID <span className="text-gray-900 ml-1">#{order._id.slice(-6)}</span>
                    </h3>
                  </div>
                  <span
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${
                      order.status === "Pending"
                        ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                        : order.status === "Preparing"
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : order.status === "Delivered"
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-600">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 lg:col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Address</p>
                    <p className="text-gray-900 font-medium line-clamp-2">{order.address}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                    <p className="text-gray-900 font-medium">{order.paymentMethod}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">Total</p>
                    <p className="text-gray-900 font-bold text-lg">Rs. {order.totalAmount}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-50 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex flex-wrap gap-2 items-center text-sm font-medium text-gray-500">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{order.items.length} Item(s)</span>
                  </div>
                  <div className="text-xs text-gray-400 font-medium text-right">
                    Ordered on: {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
