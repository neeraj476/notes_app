import notesModel from '../model/notes.model.js';
import userModel from '../model/user.model.js';

export const createNotes = async (req, res) => {
    try {
        const { title, content } = req.body;
        const { userId } = req;  

        const newNote = await notesModel.create({ title, content, userId });

        // Find the user and add the note's ObjectId to their notes array
        const user = await userModel.findById(userId);
        user.notes.push(newNote._id);  // Add note's ID to the user's notes array
        await user.save();  // Save the user document

        return res.status(201).json({
            message: "Note created successfully",
            note: newNote,
        });
    } catch (error) {
        console.error("Error creating note", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getAllNotes = async (req, res) => {
    try {
        const { userId } = req;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is missing. Please log in.",
            });
        }

        const notes = await notesModel.find({ userId });

        if (!notes.length) {
            return res.status(404).json({
                message: "No notes found for this user.",
            });
        }

        return res.status(200).json({
            message: "Notes retrieved successfully.",
            notes,
        });
    } catch (error) {
        console.error("Error in getAllNotes:", error.message);
        return res.status(500).json({
            message: "Error in retrieving notes.",
            error: error.message, 
        });
    }
};


// Route to handle search
export const searchNotes = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const { userId } = req;
        
        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }

        const notes = await notesModel.find({
            userId, // Ensure we only search notes belonging to the user
            title: { $regex: searchTerm, $options: "i" }, // Case-insensitive search
        });

        res.status(200).json({ notes });
    } catch (error) {
        console.error("Error searching notes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getNoteById = async (req, res) => {
  try {
      const { id } = req.params; 
      const { userId } = req; 
      const note = await notesModel.findOne({ 
          _id: id, 
          userId 
      });
      if (!note) {
          return res.status(404).json({ 
              message: "Note not found or you don't have access to it." 
          });
      }

      res.status(200).json({ 
          message: "Note retrieved successfully.", 
          note 
      });
  } catch (error) {
      console.error("Error retrieving the note:", error.message);
      res.status(500).json({ 
          message: "Internal server error", 
          error: error.message 
      });
  }
};



export const updateUserNoteStyle = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req;
    
    const { title, content, styles } = req.body;

    // Validate the incoming data
    if (!noteId || !userId || (!title && !content && !styles)) {
      return res.status(400).json({
        message: "Note ID, user ID, and at least one field (title, content, or styles) are required.",
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (styles) {
      if (styles.color) updateData["styles.color"] = styles.color;
      if (styles.fontSize) updateData["styles.fontSize"] = styles.fontSize;
      if (styles.fontStyle) updateData["styles.fontStyle"] = styles.fontStyle;
    }

    const updatedNote = await notesModel.findOneAndUpdate(
      { _id: noteId, userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found or does not belong to the user.",
      });
    }

    return res.status(200).json({
      message: "Note updated successfully.",
      updatedNote,
    });
  } catch (error) {
    console.error("Error updating note:", error.message);
    return res.status(500).json({
      message: "Internal server error while updating the note.",
      error: error.message,
    });
  }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params; 
        const { userId } = req; 

        // Validate input
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Find and delete the note
        const deletedNote = await notesModel.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found." });
        }

       
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $pull: { notes: id } }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "Note deleted successfully.",
            user: updatedUser, // Optional: Return the updated user record
        });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
