
import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    const token = req.cookies.authToken;  

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.userId = decoded.id;  
        next();  
    });
};
