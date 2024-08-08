import admin from '../config/firebase.mjs'; // Ensure path is correct

export const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
    
    if (!idToken) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Attach the decoded token to the request object
        next();
    } catch (error) {
        console.error('Error verifying ID token:', error);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};
