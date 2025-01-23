import mongoose, { Schema } from "mongoose";

const notesSchema = Schema({
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    styles: {
        color: {
            type: String, // Hex color code or color name
            default: "#000000",
        },
        fontSize: {
            type: Number, // Font size in pixels
            default: 16,
        },
        fontStyle: {
            type: String, // Options like 'normal', 'italic', 'bold'
            default: "normal",
        },
    },
}, { timestamps: true });
const notesModel = new mongoose.model("Note", notesSchema);
export default notesModel;