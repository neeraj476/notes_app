import axios from "axios";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios"; // Update based on your axios setup
import { useNavigate, useParams } from "react-router-dom";

const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState({
    title: "",
    content: "",
    styles: {
      color: "#000000",
      fontSize: 16,
      fontStyle: "normal",
    },
  });

  // Simulate fetching note data
  useEffect(() => {
    const getNote = async () => {
      try {
        const response = await axiosInstance.get(`/notes/${id}`);


        // Set the fetched note data
        const note = response.data.note
        setNote({
          title: note.title,
          content: note.content,
          styles: {
            color: note.styles.color,
            fontSize: note.styles.fontSize,
            fontStyle: note.styles.fontStyle,
          },
        });
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    getNote();
  }, [id]);

  // Handle input changes for title and content
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prev) => ({ ...prev, [name]: value }));
  };

  // Handle style changes
  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    setNote((prev) => ({
      ...prev,
      styles: { ...prev.styles, [name]: value },
    }));
  };

  // Handle form submission (for now, just alert)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send updated note to backend
    try {
      const response = await axiosInstance.patch(`/notes/${id}/style`, {
        title: note.title,
        content: note.content,
        styles: note.styles,
      });
      
      if(response.status == 200){
        navigate('/');
      }
      
      alert("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white  p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Note</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title:</label>
            <input
              type="text"
              name="title"
              value={note.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Content:</label>
            <textarea
              name="content"
              value={note.content}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          {/* Styles */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Text Color:</label>
            <input
              type="color"
              name="color"
              value={note.styles.color}
              onChange={handleStyleChange}
              className="mt-1 block"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Font Size (px):</label>
            <input
              type="number"
              name="fontSize"
              value={note.styles.fontSize}
              onChange={handleStyleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Font Style:</label>
            <select
              name="fontStyle"
              value={note.styles.fontStyle}
              onChange={handleStyleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            >
              <option value="normal" className="text-gray-800">Normal</option>
              <option value="semibold" className="text-gray-800">Semi-bold</option>
              <option value="bold" className="text-gray-800">Bold</option>
            </select>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
