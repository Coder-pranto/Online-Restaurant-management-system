import { useState, useEffect } from 'react';

const DynamicForm = ({ formFields, onSubmit, onCancle }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const initialFormData = {};
        formFields.forEach((field) => {
            initialFormData[field.name] = field.value || '';
        });
        setFormData(initialFormData);
    }, [formFields]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='p-8'>
                {formFields.map((field) => (
                    <div key={field.name} className="mb-4 flex flex-col gap-3">
                        <label htmlFor={field.name} className="block text-gray-700 font-bold mb-2">
                            {field.label}
                        </label>
                        {field.type === 'select' ? (
                            <select
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                            >
                                {field.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={field.type !== 'file' ? formData[field.name] : undefined}
                                onChange={handleChange}
                                placeholder={field.label}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                            />
                        )}
                    </div>
                ))}
                <div className="flex justify-end mt-6 gap-6">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                        Save
                    </button>
                    <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={onCancle}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DynamicForm;
