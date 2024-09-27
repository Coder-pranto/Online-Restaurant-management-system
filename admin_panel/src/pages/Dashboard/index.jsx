// import Header from "../../components/Header";
// import DashboardCard from "../../components/cards/DashboardCard";
// import visitorsImg from "../../assets/cardImage/visitors.png";
// import orderImg from "../../assets/cardImage/order.png";
// import incomeImg from "../../assets/cardImage/income.png";
// import expenseImg from "../../assets/cardImage/expense.png";
// import netEarningImg from "../../assets/cardImage/net-earning.png";
// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import axios from "axios";
// // import Loader from "../../components/Loader";
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// import { dummyDataForBar, dummyDataForLine } from "./data";

// export default function Dashboard() {
//   const restaurantId = Cookies.get("restaurantId");
//   const authToken = Cookies.get("token");

//   const [loading, setLoading] = useState(null);
//   const [orderHistories, setOrderHistories] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);

//   const [orderReceived, setOrderReceived] = useState(0);
//   const [totalIncome, setTotalIncome] = useState(0);
//   const [totalExpense, setTotalExpense] = useState(0);
//   const [netEarning, setNetEarning] = useState(0);

//   const [expenses, setExpenses] = useState([]);

//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());


//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         `http://localhost:5005/api/v1/order/${restaurantId}`,
//         {
//           headers: {
//             Authorization: `${authToken}`,
//           },
//         }
//       );
//       // console.log("order data: ",data);
//       setOrderHistories(data);
//       setFilteredOrders(data);
//       setOrderReceived(data.length);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching order data:", error);
//       setLoading(false);
//     }
//   };

//   const fetchIncomeData = () => {
//     const totalIncome = orderHistories
//       .filter((order) => order.status === "approved")
//       .reduce((total, order) => {
//         const orderTotal = order?.items?.reduce((orderTotal, item) => {
//           return orderTotal + parseFloat(item?.foodId?.price) * item?.quantity;
//         }, 0);
//         return total + orderTotal;
//       }, 0);
//     setTotalIncome(totalIncome);
//   };

//   const fetchExpensesData = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         `http://localhost:5005/api/v1/expense?restaurantId=${restaurantId}`,
//         {
//           headers: {
//             Authorization: `${authToken}`,
//           },
//         }
//       );

//       setExpenses(data);
//       const totalExpense = data.reduce(
//         (total, expense) => total + parseFloat(expense?.price),
//         0
//       );
//       setTotalExpense(totalExpense);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching expense data:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (orderHistories.length > 0) {
//       fetchIncomeData();
//       fetchExpensesData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [orderHistories]);

//   useEffect(() => {
//     setNetEarning(totalIncome - totalExpense);
//   }, [totalIncome, totalExpense]);


//   //* card data update based date range (start)

//   const filteredOrdersInRange = orderHistories.filter(order => {
//     const orderDate = new Date(order.createdAt);
//     return orderDate >= startDate && orderDate <= endDate;
//   });

//   const orderReceivedInRange = filteredOrdersInRange.length;

//   const totalIncomeInRange = filteredOrdersInRange
//     .filter(order => order.status === 'approved')
//     .reduce((total, order) => {
//       const orderTotal = order.items.reduce((orderTotal, item) => {
//         return orderTotal + parseFloat(item.foodId.price) * item.quantity;
//       }, 0);
//       return total + orderTotal;
//     }, 0);

//   const expensesInRange = expenses.filter(expense => {
//     const expenseDate = new Date(expense.createdAt);
//     return expenseDate >= startDate && expenseDate <= endDate;
//   });

//   const totalExpensesInRange = expensesInRange.reduce((total, expense) => {
//     return total + parseFloat(expense.price);
//   }, 0);

//   const netEarningInRange = totalIncomeInRange - totalExpensesInRange;

//   const cardInfo = [
//     {
//       name: "Visitors",
//       amount: "290",
//       icon: visitorsImg,
//     },
//     {
//       name: "Order Received",
//       amount: orderReceivedInRange ? orderReceivedInRange : orderReceived,
//       icon: orderImg,
//     },
//     {
//       name: "Total Income",
//       amount: totalIncomeInRange ? totalIncomeInRange : totalIncome,
//       icon: incomeImg,
//     },
//     {
//       name: "Total Expenses",
//       amount: totalExpensesInRange ? totalExpensesInRange : totalExpense,
//       icon: expenseImg,
//     },
//     {
//       name: "Net Earning",
//       amount: netEarningInRange ? netEarningInRange : netEarning,
//       icon: netEarningImg,
//     },
//   ];

//   //* card data update based date range (end)


//   return (
//     <div className="px-2">
//       <Header
//         headerTitle="Today's Sale"
//         secondaryTitle={true}
//         isShowFilter={true}
//         data={orderHistories}
//         setFilteredOrders={setFilteredOrders}
//       />


//       <div className="mt-8 mx-6">
//         <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
//           {cardInfo.map((item) => (
//             <DashboardCard key={item.name} cardInfo={item} percentage={56} />
//           ))}
//         </div>
//       </div>


//       <div className="flex lg:justify-end justify-center gap-x-2 lg:flex-row lg:space-x-4 mt-8 lg:mr-6 ">
//         <div className="flex lg:flex-row xs:flex-col items-center gap-x-1 lg:mt-2">
//           <label className="text-sm">Start Date :</label>
//           <DatePicker
//             className="p-1 rounded-lg w-36 border border-1 border-[#FFA901]"
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             dateFormat="yyyy-MM-dd"
//             showIcon />
//         </div>
//         <div className="flex lg:flex-row xs:flex-col items-center gap-x-1 lg:mt-2">
//           <label className="text-sm">End Date :</label>
//           <DatePicker
//             className="p-1 rounded-lg w-36 border border-1 border-[#FFA901]"
//             selected={endDate}
//             onChange={(date) => setEndDate(date)}
//             startDate={startDate}
//             dateFormat="yyyy-MM-dd"
//             showIcon />
//         </div>
//       </div>


//       {/* Display the bar chart */}
//       <div style={{ width: '80%', height: 300 }} className="mt-8">
//         <h3 className="text-left pl-8 py-4 font-semibold">Daily and Total Sales</h3> {/* Title */}
//         <ResponsiveContainer>
//           <BarChart
//             data={dummyDataForBar}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="day" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="total" fill="#446FB6" name="Total Sales" />
//             <Bar dataKey="dailySales" fill="#FBA919" name="Daily Sales" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Display the line chart */}
//       <div style={{ width: '80%', height: 300 }} className="mb-16 mt-16">
//         <h3 className="text-left pl-8 py-4 font-semibold">Total Sales and Profit</h3> {/* Title */}
//         <ResponsiveContainer>
//           <LineChart
//             data={dummyDataForLine}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="day" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="totalSales" stroke="#446FB6" name="Total Sales" />
//             <Line type="monotone" dataKey="totalProfit" stroke="#FBA919" name="Total Profit" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//     </div>
//   );
// }


import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { dummyDataForBar, dummyDataForLine } from "./data";
import Header from "../../components/Header";
import DashboardCard from "../../components/cards/DashboardCard";
import visitorsImg from "../../assets/cardImage/visitors.png";
import orderImg from "../../assets/cardImage/order.png";
import incomeImg from "../../assets/cardImage/income.png";
import expenseImg from "../../assets/cardImage/expense.png";
import netEarningImg from "../../assets/cardImage/net-earning.png";

export default function Dashboard() {
  const restaurantId = Cookies.get("restaurantId");
  const authToken = Cookies.get("token");

  const [loading, setLoading] = useState(false);
  const [orderHistories, setOrderHistories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [orderReceived, setOrderReceived] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netEarning, setNetEarning] = useState(0);

  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [endDate, setEndDate] = useState(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5005/api/v1/order/${restaurantId}`,
        { headers: { Authorization: `${authToken}` } }
      );
      setOrderHistories(data);
      setOrderReceived(data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order data:", error);
      setLoading(false);
    }
  };

  const fetchExpensesData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5005/api/v1/expense?restaurantId=${restaurantId}`,
        { headers: { Authorization: `${authToken}` } }
      );
      setExpenses(data);
      const totalExpense = data.reduce(
        (total, expense) => total + parseFloat(expense?.price),
        0
      );
      setTotalExpense(totalExpense);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expense data:", error);
      setLoading(false);
    }
  };

  const fetchIncomeData = (orders) => {
    const totalIncome = orders
      .filter((order) => order.status === "approved")
      .reduce((total, order) => {
        const orderTotal = order?.items?.reduce((orderTotal, item) => {
          return orderTotal + parseFloat(item?.foodId?.price) * item?.quantity;
        }, 0);
        return total + orderTotal;
      }, 0);
    setTotalIncome(totalIncome);
  };

  // Calculate income, expenses, and net earnings within the date range
  const updateValuesInRange = () => {
    const filteredOrdersInRange = orderHistories.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    const totalIncomeInRange = filteredOrdersInRange
      .filter(order => order.status === 'approved')
      .reduce((total, order) => {
        const orderTotal = order.items.reduce((orderTotal, item) => {
          return orderTotal + parseFloat(item.foodId.price) * item.quantity;
        }, 0);
        return total + orderTotal;
      }, 0);

    const expensesInRange = expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    const totalExpensesInRange = expensesInRange.reduce((total, expense) => {
      return total + parseFloat(expense.price);
    }, 0);

    const netEarningInRange = totalIncomeInRange - totalExpensesInRange;

    // Update the values
    setOrderReceived(filteredOrdersInRange.length || 0);
    setTotalIncome(totalIncomeInRange || 0);
    setTotalExpense(totalExpensesInRange || 0);
    setNetEarning(netEarningInRange || 0);
  };

  useEffect(() => {
    fetchData();
    fetchExpensesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orderHistories.length > 0) {
      fetchIncomeData(orderHistories);
    }
    updateValuesInRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderHistories, startDate, endDate, expenses]);

  const cardInfo = [
    { name: "Visitors", amount: "290", icon: visitorsImg },
    { name: "Order Received", amount: orderReceived, icon: orderImg },
    { name: "Total Income", amount: totalIncome, icon: incomeImg },
    { name: "Total Expenses", amount: totalExpense, icon: expenseImg },
    { name: "Net Earning", amount: netEarning, icon: netEarningImg },
  ];

  return (
    <div className="px-2">
      <Header
        headerTitle="Today's Sale"
        secondaryTitle={true}
        isShowFilter={true}
        data={orderHistories}
        setFilteredOrders={setOrderHistories}
      />

      <div className="mt-8 mx-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {cardInfo.map((item) => (
            <DashboardCard key={item.name} cardInfo={item} percentage={56} />
          ))}
        </div>
      </div>

      <div className="flex lg:justify-end justify-center gap-x-2 lg:flex-row lg:space-x-4 mt-8 lg:mr-6 ">
        <div className="flex lg:flex-row xs:flex-col items-center gap-x-1 lg:mt-2">
          <label className="text-sm">Start Date :</label>
          <DatePicker
            className="p-1 rounded-lg w-36 border border-1 border-[#FFA901]"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            showIcon
          />
        </div>
        <div className="flex lg:flex-row xs:flex-col items-center gap-x-1 lg:mt-2">
          <label className="text-sm">End Date :</label>
          <DatePicker
            className="p-1 rounded-lg w-36 border border-1 border-[#FFA901]"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            startDate={startDate}
            dateFormat="yyyy-MM-dd"
            showIcon
          />
        </div>
      </div>

      {/* Display the bar chart */}
      <div style={{ width: '80%', height: 300 }} className="mt-8">
        <h3 className="text-left pl-8 py-4 font-semibold">Daily and Total Sales</h3>
        <ResponsiveContainer>
          <BarChart
            data={dummyDataForBar}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#446FB6" name="Total Sales" />
            <Bar dataKey="dailySales" fill="#FBA919" name="Daily Sales" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Display the line chart */}
      <div style={{ width: '80%', height: 300 }} className="mb-16 mt-16">
        <h3 className="text-left pl-8 py-4 font-semibold">Total Sales and Profit</h3>
        <ResponsiveContainer>
          <LineChart
            data={dummyDataForLine}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="profit" stroke="#2C6A9B" activeDot={{ r: 8 }} name="Profit" />
            <Line type="monotone" dataKey="total" stroke="#E93D43" name="Total Sales" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
