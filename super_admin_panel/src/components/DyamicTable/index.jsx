import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import fetchRestaurantData from '../../utils/fetchRestaurantData';

const DyamicTable = ({ columns, data, onDelete, onEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [restaurantData, setRestaurantData] = useState([]);

    useEffect(() => {
        const pageCount = data[0]?.totalPage;
        if (pageCount) {
            setTotalPage(pageCount);
        }
    }, [data]);

     const fetchData = async () => {
            const initialData = await fetchRestaurantData(1, 6);
            setRestaurantData(initialData);
        };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePageChange = async (newPage) => {
        setCurrentPage(newPage);
        const newData = await fetchRestaurantData(newPage, 6);
        setRestaurantData(newData);
    };

    return (
        <div className="overflow-x-auto">
            <div className=' h-[450px]'>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className='text-xl border-b-[1px] border-blue-200 h-[50px]'>
                            {columns.map((column) => (
                                <th key={column.key} className="py-2 px-4">
                                    {column.label}
                                </th>
                            ))}
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(restaurantData) && restaurantData.map((item) => (
                            <tr key={item.email} className='text-center p-4 h-[50px]'>
                                {columns.map((column) => (
                                    <td key={column.key} className={`py-2 px-4 ${column.key === 'status' ? item[column.key] === 'active' ? 'text-green-500' : 'text-red-500 text-bold' : ''}`}>
                                        {item[column.key]}
                                    </td>
                                ))}
                                <td className="text-2xl flex gap-2 justify-center pt-5">
                                    <Icon
                                        icon="iconamoon:edit-fill"
                                        className="text-green-500 cursor-pointer"
                                        onClick={() => onEdit(item.restaurantId)}
                                    />
                                    <Icon
                                        icon="material-symbols:delete"
                                        className="text-red-500 cursor-pointer"
                                        onClick={() => onDelete(item.restaurantId)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className='w-[200px] mx-auto mt-5'>
                <div className="flex justify-between items-center">
                    <button
                        className="px-3 py-1 border border-gray-300 rounded-md"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        {currentPage} of {totalPage}
                    </span>
                    <button
                        className="px-3 py-1 border border-gray-300 rounded-md"
                        disabled={currentPage === totalPage}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DyamicTable;
