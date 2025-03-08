import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    const payload = {
        userId,
    };

    // Generate a JWT token with a secret key and expiration time
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h', // Set token expiration (e.g., 1 hour)
    });
};

export default generateToken;
