import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const TableDashboard = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableCount, setTableCount] = useState(0);

  const navigate = useNavigate();

  // const ONE_HOUR_MS = 60 * 60 * 1000;
  const ONE_HOUR_MS = 5 * 1000;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const storedTablesData = JSON.parse(localStorage.getItem('tablesData'));

    if (storedTablesData) {
      const { tables: storedTables, createdAt } = storedTablesData;
      const now = Date.now();

      // If tables were generated more than 1 day ago, remove them
      if (now - createdAt > ONE_DAY_MS) {
        localStorage.removeItem('tablesData');
      } else {
        const updatedTables = storedTables.map((table) => {
          // If the table was booked more than 1 hour ago, unbook it
          if (table.booked && now - table.bookedAt > ONE_HOUR_MS) {
            return { ...table, booked: false, bookedAt: null, hasFoodAllocated: false };
          }
          return table;
        });
        setTables(updatedTables);
      }
    }
  }, [ONE_HOUR_MS, ONE_DAY_MS]);

  useEffect(() => {
    if (tables.length > 0) {
      localStorage.setItem(
        'tablesData',
        JSON.stringify({ tables, createdAt: Date.now() })
      );
    }
  }, [tables]);

  const generateTables = () => {
    const numTables = parseInt(tableCount, 10);
    if (isNaN(numTables) || numTables <= 0) {
      alert('Please enter a valid number of tables.');
      return;
    }

    // If new table count is less than or equal to current tables, no need to regenerate.
    if (numTables <= tables.length) {
      alert(`Table count cannot be less than or equal to the current number of tables (${tables.length}).`);
      return;
    }

    // Generate new tables starting from the current table count
    const newTables = Array.from(
      { length: numTables - tables.length }, 
      (_, index) => ({
        id: tables.length + index + 1, // Continuing table IDs from the current table count
        booked: false,
        bookedAt: null,
        hasFoodAllocated: false, // Track if food is allocated
      })
    );

    // Append the new tables to the existing ones
    setTables((prevTables) => [...prevTables, ...newTables]);
  };

  const resetTables = () => {
    setTables([]);
    setTableCount(0);
    localStorage.removeItem('tablesData');
  };

  const handleSelectTable = (table) => {
    // Check if there's already a booked table without food allocation
    const unallocatedTable = tables.find((t) => t.booked && !t.hasFoodAllocated);
    if (unallocatedTable) {
      alert(`Table ${unallocatedTable.id} has been booked but no food items are allocated yet. Please allocate food before booking another table.`);
      return;
    }

    // Automatically book the table on click
    setTables((prevTables) =>
      prevTables.map((t) =>
        t.id === table.id ? { ...t, booked: true, bookedAt: Date.now(), hasFoodAllocated: false } : t
      )
    );
    setSelectedTable(table.id);
  };

  const handleUnbookTable = (tableId) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, booked: false, bookedAt: null, hasFoodAllocated: false } : table
      )
    );
  };

  const handleContinue = () => {
    if (selectedTable) {
      navigate('/table-menu', { state: { selectedTable } });
    }
  };

  return (
    <div>
      <Header headerTitle="Today's Table Booking" isShowFilter={false} />
      <div className="flex p-8 min-h-screen">
        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Table Dashboard</h1>

          {/* Admin Table Input */}
          <div className="flex items-center mb-6">
            <input
              type="number"
              value={tableCount}
              onChange={(e) => setTableCount(e.target.value)}
              placeholder="Enter number of tables"
              className="border border-gray-300 p-2 rounded-lg mr-4 w-48"
            />
            <button
              onClick={generateTables}
              className="bg-[#FBA919] hover:bg-[#f89e02] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 mr-4"
            >
              Generate Tables
            </button>

            {/* Reset Button */}
            <button
              onClick={resetTables}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Reset Tables
            </button>
          </div>

          {/* Displaying Tables */}
          <div className="grid grid-cols-4 gap-6">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`p-6 border rounded-lg shadow-sm transition-colors duration-300 cursor-pointer ${table.booked ? 'bg-green-200 hover:bg-green-300' : 'bg-white hover:bg-gray-100'
                  }`}
                onClick={() => !table.booked && handleSelectTable(table)}
              >
                <h2 className="text-lg font-semibold text-gray-700">Table {table.id}</h2>
                {table.booked && (
                  <>
                    <p className="text-sm text-gray-600">Booked</p>
                    <button
                      onClick={() => handleUnbookTable(table.id)}
                      className="mt-2 text-xs text-red-600 hover:underline"
                    >
                      Unbook
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className={`mt-8 py-3 px-6 text-white font-semibold rounded-lg transition duration-300 ${selectedTable ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            disabled={!selectedTable}
          >
            Select and Continue
          </button>
        </div>

        {/* Sidebar */}
        <div className="w-1/4 ml-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Selected Table</h2>
          <p className="text-lg text-gray-600">{selectedTable ? `Table ${selectedTable}` : 'No table selected'}</p>
        </div>
      </div>
    </div>
  );
};

export default TableDashboard;



