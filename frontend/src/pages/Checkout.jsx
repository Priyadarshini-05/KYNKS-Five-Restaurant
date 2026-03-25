import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Checkout = () => {
  const { totalPrice, axios, navigate } = useContext(AppContext);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pay at hotel");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const handleCheckout = async () => {
    if (!address) {
      toast.error("Please enter your address");
      return;
    }

    if (paymentMethod === "Online Payment") {
      if (!transactionId || transactionId.length < 12) {
        toast.error("Please enter a valid 12-digit Transaction ID");
        return;
      }
      
      setIsProcessingPayment(true);
      // Simulate real-time payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsProcessingPayment(false);
    }

    try {
      const { data } = await axios.post("/api/order/place", {
        address,
        paymentMethod,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/my-orders");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("You need to login to place an order");
      } else {
        toast.error(
          error.response?.data?.message || "Something went wrong!"
        );
      }
    }
  };
  return (
    <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white shadow-lg rounded-2xl">
      {/* LEFT SIDE - Address */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Delivery Address
        </h2>
        <textarea
          rows={5}
          value={address}
          placeholder="enter your full address"
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
        ></textarea>
      </div>

      {/* RIGHT SIDE - Order Summary */}
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="flex justify-between text-lg font-medium text-gray-700">
              <span>Total Amount:</span>
              <span className="text-green-600 font-semibold">
                Rs. {totalPrice}
              </span>
            </p>
          </div>

          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Payment Method
          </h3>
          <div className="space-y-3">
            <label htmlFor="" className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="Pay at hotel"
                checked={paymentMethod === "Pay at hotel"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Pay at hotel</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="Online Payment"
                checked={paymentMethod === "Online Payment"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-green-600 focus:ring-green-500"
              />
              <span>Online Payment</span>
            </label>

            {/* Fake Payment Section */}
            {paymentMethod === "Online Payment" && (
              <div className="mt-4 p-5 border border-gray-200 rounded-lg bg-white shadow-sm transition-all duration-300 flex flex-col items-center">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.7056 21.0567L35.8078 28.9545L34.1353 35.811L28.8105 38.0772L19.5398 33.3482H11.5204L8.33649 26.6976L11.5204 22.0535L19.5398 17.3245L28.8105 12.5955L34.1353 14.8617L35.8078 21.7182L43.7056 29.616" fill="#4285F4"/>
                    <path d="M35.8079 28.9545L34.1353 35.811L28.8105 38.0772V12.5955L34.1353 14.8617L35.8079 21.7182V28.9545Z" fill="#34A853"/>
                    <path d="M28.8106 38.0772L19.5399 33.3482V17.3245L28.8106 12.5955V38.0772Z" fill="#FBBC04"/>
                    <path d="M19.5398 33.3482H11.5204L8.33649 26.6976L11.5204 22.0535V33.3482H19.5398Z" fill="#EA4335"/>
                  </svg>
                  Pay with GPay (Demo)
                </h4>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Mock payment. <span className="text-red-500 font-medium">Do not use real money!</span><br/>
                  <span className="font-semibold text-gray-700">Rs. {totalPrice}</span>
                </p>
                <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm mb-4 relative">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=THIS_IS_A_MOCK_PAYMENT_NO_REAL_TRANSFERS`}
                    alt="Mock GPay QR Code"
                    className="w-32 h-32 object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <span className="font-bold text-gray-600 rotate-[-45deg] text-xl tracking-widest uppercase">TEST ONLY</span>
                  </div>
                </div>
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Enter 12-digit Transaction ID (UTR)</label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789012"
                    maxLength={12}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-center tracking-widest"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isProcessingPayment}
          className={`mt-6 text-white py-3 rounded-lg transition font-medium cursor-pointer flex justify-center items-center gap-2 ${
            isProcessingPayment
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isProcessingPayment ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing Payment...
            </>
          ) : (
            "Confirm Order"
          )}
        </button>
      </div>
    </div>
  );
};
export default Checkout;
