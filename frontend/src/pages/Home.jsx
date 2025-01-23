import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { Plus } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNote, setNewNote] = useState({
        title: "",
        content: "",
        style: "normal"  // Default style is normal
    });

    // Fetch all notes
    async function getAllNotes() {
        try {
            setLoading(true); // Start loading indicator
            const response = await axiosInstance.get(`/get-notes`);

            // Handle the response
            if (response.status === 200) {
                setData(response.data.notes); // Save notes to state
            } else {
                console.error("Unexpected response:", response);
                setError(response.data.message || "Unexpected error occurred.");
            }
        } catch (error) {
            if (error.response) {
                // Handle specific backend errors
                setError(error.response.data.message || "Error in retrieving notes.");
            } else {
                // Handle network errors or unexpected errors
                setError("Network error. Please check your connection.");
            }
            console.error("Error in getAllNotes:", error);
        } finally {
            setLoading(false); // Stop loading indicator
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNote(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle submit for new note
    const handleSubmitNote = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/create-notes', newNote);
            if (response.status === 201) {
                setData(prevData => [...prevData, response.data.note]);
    
                // Close modal and reset the form
                setIsModalOpen(false);
                setNewNote({ title: "", content: "", style: "normal" });
            }
        } catch (error) {
            console.error('Error creating new note:', error);
            setError("Error creating new note.");
        }
    };
    

    // Delete note handler
    const handleDelete = async (id) => {
        try {
            const response = await axiosInstance.delete(`/notes/delete/${id}`);
            if (response.status === 200) {

                // Remove the deleted note from the state
                setData(data.filter((note) => note._id !== id));
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error in deleting note.');
        }
    };

    // Close modal and reset form
    const handleCancel = () => {
        setIsModalOpen(false);
        setNewNote({ title: "", content: "", style: "normal" });
    };

    useEffect(() => {
        getAllNotes();
    }, []);

    return (
        <div className="w-screen h-screen relative bg-gray-200/50 flex flex-col">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 w-full z-10">
                <Header />
            </div>

            {/* Content */}
            <div className="mt-16 flex-1 p-5 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-lg font-semibold text-gray-600">Loading notes...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-lg font-semibold text-red-600">{(error==="No notes found for this user.")?(
                            <p className="text-lg font-semibold text-gray-600">Create Notes Now.</p>
                        ) : error}</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-lg font-semibold text-gray-600">Create Notes Now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {data.map((note, index) => (
                            <div
                                key={note._id}
                                className="p-4 bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden"
                            >
                                {/* Title */}
                                <h2 className="text-xl font-semibold text-gray-800 truncate">
                                    {note.title || `Note ${index + 1}`}
                                </h2>

                                {/* Content with Line Clamp */}
                                <p className="text-gray-600 mt-2 line-clamp-4">
                                    {note.content || 'No content available for this note.'}
                                </p>

                                {/* Created Date */}
                                <div className="mt-4 text-sm text-gray-500">
                                    Created on: {new Date(note.createdAt).toLocaleDateString() || 'Unknown'}
                                </div>

                                {/* Buttons: View, Edit, Delete */}
                                <div className="mt-4 flex space-x-3">
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => navigate(`/edit/${note._id}`)}
                                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>

                                    {/* View Button */}
                                    <button
                                        onClick={() => navigate(`/view/${note._id}`)}
                                        className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                                    >
                                        View
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Add Button */}
            <div
                onClick={() => setIsModalOpen(true)}
                className="absolute right-10 bottom-10 w-16 h-16 rounded-full bg-blue-600 font-bold flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-blue-700"
            >
                <Plus size={'40'} />
            </div>

            {/* Modal for Adding a New Note */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
                        <div className='flex justify-between'>
                            <h2 className="text-xl font-semibold mb-4">Create a New Note</h2>
                            <button
                                onClick={handleCancel} // Close modal and reset form
                                className=" text-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
                            >
                                <span className="text-xl">X</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitNote}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-gray-600">Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newNote.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-gray-600">Content:</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={newNote.content}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="style" className="block text-gray-600">Style:</label>
                                <select
                                    id="style"
                                    name="style"
                                    value={newNote.style}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="bold">Bold</option>
                                    <option value="italic">Italic</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Save Note
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
