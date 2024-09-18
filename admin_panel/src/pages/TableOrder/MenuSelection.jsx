import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios'; 
import Cookies from 'js-cookie'; 
import Header from '../../components/Header';
import Payment from './Payment';

const MenuSelection = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { selectedTable } = location.state || {};

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [order, setOrder] = useState([]);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false); 

  const restaurantId = Cookies.get("restaurantId");

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoryResponse = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/category?restaurantId=${restaurantId}`
      );
      const foodResponse = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/food?restaurantId=${restaurantId}`
      );

      const fetchedCategories = ['all', ...new Set(categoryResponse.data.map(cat => cat.name))];
      setCategories(fetchedCategories);
      setMenus(foodResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (order.length === 0) {
      setShowPayment(false); // Hide payment section if order is empty
    }
  }, [order]);

  const handleCheckboxChange = (item) => {
    const existingItem = order.find(orderItem => orderItem._id === item._id);
    if (existingItem) {
      setOrder(order.filter(orderItem => orderItem._id !== item._id));
    } else {
      setOrder([...order, { ...item, quantity: 1 }]);
    }
  };

  const handleIncrementOrder = (itemId) => {
    setOrder(order.map(item => 
      item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecrementOrder = (itemId) => {
    const itemToDecrement = order.find(item => item._id === itemId);
    if (itemToDecrement.quantity > 1) {
      setOrder(order.map(item =>
        item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    }
  };

  const handleRemoveFromOrder = (itemId) => {
    setOrder(order.filter(item => item._id !== itemId));
  };

  const totalCost = order.reduce((total, item) => total + item.price * item.quantity, 0);
  const serviceCharge = totalCost * 0; // use as a vat charge
  const finalTotal = totalCost + serviceCharge;

  const handleProceedToPayment = () => {
    if (order.length > 0) {
      setShowPayment(true);  // Show the Payment component when "Proceed to Payment" is clicked
    }
  };

  const handleBackButtonClick = () => {
    navigate('/table-order'); 
  };

  return (
    <div>
      <Header headerTitle="Today's Table Booking" isShowFilter={false} />
      <div className="flex p-8 min-h-screen">
        {/* Main Menu Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800">Menu Selection for -&gt; Table {selectedTable}</h1>

          {/* Display food categories */}
          <div className="mb-6 flex justify-center space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ${
                  selectedCategory === category ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-orange-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Display menu items */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {menus
                .filter((item) => selectedCategory === 'all' || item.categoryId.name === selectedCategory)
                .map((item) => (
                  <div key={item._id} className="p-6 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <img src={`https://digitalmenu-ax0i.onrender.com/api/v1/${item.food_image}`} alt={item.name} className="w-full h-32 sm:h-48 object-cover rounded-t-lg mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600 mt-2">Price: <span className="font-bold text-gray-800">৳{item.price}</span></p>
                    <label className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        checked={!!order.find(orderItem => orderItem._id === item._id)}
                        onChange={() => handleCheckboxChange(item)}
                        className="mr-2"
                      />
                      <span className="text-gray-600">Add to Order</span>
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Sidebar Order Summary */}
        <div className="w-full lg:w-[30%] ml-12 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          <ul className="divide-y divide-gray-200 mb-4">
            {order.map((item) => (
              <li key={item._id} className="py-4 flex justify-between items-center">
                <span className="text-gray-700">
                  {item.name} (x{item.quantity}) - ৳{(item.price * item.quantity).toFixed(2)}
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleDecrementOrder(item._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <FaMinus />
                  </button>
                  <button
                    onClick={() => handleIncrementOrder(item._id)}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => handleRemoveFromOrder(item._id)}
                    className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold">Total: <span className="text-gray-800">৳{totalCost.toFixed(2)}</span></h3>
            <h4 className="text-md mt-2">Vat (0%): <span className="text-gray-800">৳{serviceCharge.toFixed(2)}</span></h4>
            <h4 className="text-lg font-bold mt-4">Final Total: <span className="text-orange-500">৳{finalTotal.toFixed(2)}</span></h4>
          </div>
          <button
            onClick={handleProceedToPayment}
            disabled={order.length === 0} // Disable button if no items are selected
            className="mt-6 w-full py-3 bg-[#F97316] text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
          >
            Proceed to Payment
          </button>

          {/* Back Button */}
          <button
            onClick={handleBackButtonClick}
            className="mt-4 w-full py-3 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition"
          >
            Back to Table Orders
            </button>
      
      {/* Conditionally render the Payment component */}
      {showPayment && (
        <Payment 
          order={order}
          totalCost={totalCost}
          serviceCharge={serviceCharge}
          finalTotal={finalTotal}
          selectedTable={selectedTable}
          orderNumber={Math.floor(Math.random() * 1000000)}  // example order number
        />
      )}
    </div>
  </div>
</div>
); };

export default MenuSelection;