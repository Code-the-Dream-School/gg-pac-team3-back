// Import the Firebase admin module
const admin = require('../config/firebase');

// Initialize Firestore
const db = admin.firestore();

// Middleware to verify teacher user
const verifyTeacher = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(400).json({ error: 'Authorization header is missing' });
  }

  // Split the header to extract the token
  const [bearer, idToken] = authHeader.split(' ');

  // Validate token format
  if (bearer !== 'Bearer' || !idToken) {
    return res.status(400).json({ error: 'Authorization token is missing or incorrectly formatted' });
  }

  try {
    // Verify the ID token using Firebase admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if the decoded token indicates a teacher user
    if (decodedToken.teacher) {
      req.teacherUid = decodedToken.uid; 
      next(); 
    } else {
      // Respond with a 403 Forbidden if the user is not a teacher
      res.status(403).json({ error: 'Unauthorized: User is not a teacher' });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error verifying ID token:', error);

    // Respond with a 403 Forbidden if token verification fails
    res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = {
  verifyAdmin: verifyTeacher, 
};
