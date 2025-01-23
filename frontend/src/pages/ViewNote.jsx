import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios'; // assuming axiosInstance is defined

const ViewNote = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // for navigation
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch note data
    useEffect(() => {
        const getNote = async () => {
            try {
                const response = await axiosInstance.get(`/notes/${id}`);
                if (response.status === 200) {
                    setNote(response.data.note); // Assuming note is returned as part of the response
                }
            } catch (error) {
                setError("Error loading note.");
                console.error("Error fetching note:", error);
            } finally {
                setLoading(false);
            }
        };

        getNote();
    }, [id]);

    // Handle delete request
    const handleDelete = async (id) => {
        try {
            const response = await axiosInstance.delete(`/notes/delete/${id}`);
            if (response.status === 200) {
                alert('Note deleted successfully.');
                navigate('/'); // Navigate back to the main notes page
            }
        } catch (error) {
            setError("Error deleting note.");
            console.error("Error deleting note:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-xl text-gray-600">Loading note...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{note?.title}</h1>

                {/* Content */}
                <div className="text-lg text-gray-700 mb-6">
                    <p
                        style={{
                            color: note?.styles?.color,
                            fontSize: `${note?.styles?.fontSize || 18}px`,
                            fontStyle: note?.styles?.fontStyle || 'normal',
                        }}
                    >
                        {note?.content}
                    </p>
                </div>

                {/* Edit and Delete buttons */}
                <div className="flex justify-start space-x-4 mb-6">
                    <button
                        className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white text-sm font-medium py-2 px-4 rounded-lg"
                        onClick={() => navigate(`/edit/${id}`)} // Navigate to edit page
                    >
                        Edit
                    </button>
                    <button
                        className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm font-medium py-2 px-4 rounded-lg"
                        onClick={() => handleDelete(note._id)}
                    // Trigger delete
                    >
                        Delete
                    </button>
                </div>

                {/* Go Back Button */}
                <div className="flex justify-end mt-4">
                    <button
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        onClick={() => window.history.back()} // Go back to the previous page
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewNote;
