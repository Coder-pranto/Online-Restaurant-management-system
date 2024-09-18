
const menuItems = [
  {
    icon: "/menuIcon/dashboard.png",
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: "/menuIcon/menu.png",
    name: "Menu",
    path: "/menu",
  },
  {
    name: "Promo",
    subMenu: [
      {
        icon: "/menuIcon/offers.png",
        name: "Offer",
        path: "/offer",
      },
    ],
  },
  {
    name: "Stock",
    subMenu: [
      {
        icon: "/menuIcon/stock.png",
        name: "Stock",
        path: "/stock",
      },
      {
        icon: "/menuIcon/qr_code.png",
        name: "QR Code",
        path: "/qr-code",
      },
    ],
  },
  {
    name: "History",
    subMenu: [
      {
        icon: "/menuIcon/order.png",
        name: "Order History",
        path: "/order-history",
      },
    ],
  },
  {
    name: "Table order",
    subMenu: [
      {
        icon: "/menuIcon/table.png",
        name: "Table Order",
        path: "/table-order",
      },
    ],
  },
  {
    name: "Users",
    subMenu: [
      {
        icon: "/menuIcon/employees.png",
        name: "Employees",
        path: "/employee",
      },
    ],
  },
  {
    name: "Reports",
    subMenu: [
      {
        icon: "/menuIcon/expenses.png",
        name: "Expenses",
        path: "/expenses",
      },
    ],
  },
  // {
  //   name: "Reports",
  //   subMenu: [
  //     {
  //       icon: "/menuIcon/sales_report.png",
  //       name: "Sales Report",
  //       path: "/sales-report",
  //     },
  //   ],
  // },
  {
    name: "Setup",
    subMenu: [
      {
        icon: "/menuIcon/logout.png",
        name: "Logout",
        path: "#",
      },
    ],
  }
];

export default menuItems;
