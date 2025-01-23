import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";
export const userSignUp = async (req, res) => {

    try {
        const { fullName, email, password } = req.body;

        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                message: "User already exists in the database",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const { firstName, lastName } = fullName;
        const createUser = await userModel.create({
            fullName: {
                firstName,
                lastName,
            },
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: createUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        if (!token) {
            return res.status(500).json({ message: "Internal error related to token" });
        }

        res.cookie('authToken', token, {
            httpOnly: true, // Prevent client-side access
            secure: process.env.NODE_ENV === 'production', // Only for HTTPS in production
            sameSite: 'strict', // Protect against CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        

        return res.status(201).json({
            message: "User registered successfully",
            token,
        });
    } catch (error) {
        console.error("Error in signUp route", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const userLogIn = async (req, res) => {
    console.log(req.body)
    try {
        const { email, password } = req.body;
        
        const user = await userModel.findOne({ email }).select("+password"); 
        if (!user) {
            return res.status(400).json({
                message: "User does not exist in the database",
            });
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: "Invalid email or password" 
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h", 
        });

        if (!token) {
            return res.status(500).json({ 
                message: "Internal error related to token generation" 
            });
        }

        // Set the token as a cookie
        res.cookie('authToken', token, {
            httpOnly: true, // Prevent client-side access
            secure: process.env.NODE_ENV === 'production', // Only for HTTPS in production
            sameSite: 'strict', // Protect against CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        

        // Respond with success
        return res.status(200).json({
            message: "Login successful",
        });
    } catch (error) {
        console.error("Error in login route:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const userProfile = async (req, res ) => {
    try {
        // Get the token from cookies
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ 
                message: "Authentication token missing. Please log in." 
            });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ 
                message: "Invalid or expired token. Please log in again." 
            });
        }
        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ 
                message: "User not found. Please register." 
            });
        }

        // Respond with user details
        return res.status(200).json({
            message: "User profile fetched successfully",
            user,
        });
    } catch (error) {
        console.error("Error in userProfile route:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const userLogOut = async (req, res) => {
    try {
        // Clear the auth token cookie
        res.clearCookie('authToken', {
            httpOnly: true, // Same settings as login for consistency
            secure: process.env.NODE_ENV === 'production', // Only for HTTPS in production
            sameSite: 'strict', // Protect against CSRF
        });

        // Respond with success
        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Error in logout route:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
