import mongoose, { Schema } from "mongoose";

const userSchema = Schema({
    fullName: {
        firstName: {
            type: String,
            require: true,
        },
        lastName: {
            type: String,
            require: true,
        }
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note', 
    }]
})

const userModel = new mongoose.model("User", userSchema);
export default userModel;