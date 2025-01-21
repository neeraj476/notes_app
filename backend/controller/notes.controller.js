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


export const searchNotes = async (req, res) => {
    try {
        const { searchTerm } = req.body; 
        const {userId} = req
        
        const notes = await notesModel.find({
            userId,
            title: { $regex: searchTerm, $options: "i" }, // Case-insensitive search
        });

        res.status(200).json({ notes });
    } catch (error) {
        // console.error("Error searching notes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const updateUserNoteStyle = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req;

    const { color, fontSize, fontStyle } = req.body.styles;
    if (!noteId || !userId || !color || !fontSize || !fontStyle) {
      return res.status(400).json({
        message: "Note ID, user ID, and styles (color, fontSize, fontStyle) are required.",
      });
    }
    const updatedNote = await notesModel.findOneAndUpdate(
      { _id: noteId, userId }, 
      {
        $set: {
          "styles.color": color,
          "styles.fontSize": fontSize,
          "styles.fontStyle": fontStyle,
        },
      },
      { new: true } 
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found or does not belong to the user.",
      });
    }

    return res.status(200).json({
      message: "Note styles updated successfully.",
      updatedNote,
    });
  } catch (error) {
    console.error("Error updating note styles:", error.message);
    return res.status(500).json({
      message: "Internal server error while updating note styles.",
      error: error.message,
    });
  }
};
