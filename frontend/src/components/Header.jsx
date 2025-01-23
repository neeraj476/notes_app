import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [notes, setNotes] = useState([]); // State for storing search results
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to toggle popup
  const logOut = async () => {
    try {
      const response = await axiosInstance.get('/users/logout');
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error in logout", error);
    }
  };

  const searchNotes = async (term) => {
    try {
      const response = await axiosInstance.get('/notes/search', {
        params: { searchTerm: term || searchTerm }, // Send the search term as a query parameter
      });
      if (response.status === 200) {
        setNotes(response.data.notes); // Update the notes state with the search results
        setIsPopupOpen(true); // Open popup when search results are fetched
      }
    } catch (error) {
      console.log("Error searching notes:", error);
    }
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() !== "") {
      searchNotes(term); // Trigger search on key change
    } else {
      setNotes([]); // Clear notes if input is empty
      setIsPopupOpen(false); // Close popup if no search term
    }
  };

  const highlightMatch = (text, term) => {
    if (!term) return text; // If no search term, return the original text

    const regex = new RegExp(`(${term})`, "gi"); // Match the search term (case-insensitive)
    return text.replace(regex, `<span class="bg-orange-300">$1</span>`); // Wrap the matching term with a span
  };

  
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-blue-300/50 shadow-md">
      {/* Left Side: Logo */}
      <div className="text-xl font-bold text-gray-800">Notes</div>

      {/* Right Side: Input field with Search Icon and Logout Button */}
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange} // Trigger search on key change
            className="pl-2 pr-4 py-2 border font-medium border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search
            className="absolute cursor-pointer right-3 top-2.5 w-5 h-5 text-gray-500"
            onClick={() => searchNotes()} // Trigger search when user clicks the icon
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={logOut}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Logout
        </button>
      </div>

      {/* Popup for Search Results */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-5/6 lg:w-[90%] min-h-[50%] max-h-[80%] overflow-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Search Results</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsPopupOpen(false)} // Close popup
              >
                ✖
              </button>
            </div>
            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="p-3 border rounded-md shadow-sm hover:shadow-md transition flex justify-between"
                  >
                    <div>
                      <h3
                        className="text-lg font-semibold"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(note.title, searchTerm),
                        }}
                      />
                      <p className="text-gray-600">{note.content}</p>
                    </div>
                    <div className="flex gap-3 ">
                      <button
                        onClick={() => navigate(`/view/${note._id}`)}
                        className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                      >
                        View
                      </button>
                    
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
