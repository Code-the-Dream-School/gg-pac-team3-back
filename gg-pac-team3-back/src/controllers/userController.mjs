import dotenv from 'dotenv';
import admin from '../config/firebase.mjs'; // Ensure path is correct
import axios from 'axios';
import UsersModel from '../models/UsersModel.mjs'; // Ensure path is correct

dotenv.config();
const db = admin.firestore();
const USERS = 'users'; 

export const signupUser = async (req, res) => {
    const { name, email, password, userType, validationcode } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate validationcode if userType is true
    // if (userType === "Teacher") {
    //     if (!validationcode) {
    //         return res.status(400).json({ error: 'Teacher code is required when userType is Teacher' });
    //     }
    //     if (validationcode !== '1234') {
    //         return res.status(400).json({ error: 'Invalid teacher code' });
    //     }
    // }

    try {
        const userRecord = await admin.auth().createUser({
            name,
            email,
            password,
            userType
        });
       
        const defaultprofilePictureUrl = 'gs://learninghub-ggpacteam3.appspot.com/images/userProfileImage.jpg';
        
        const user = new UsersModel({
            name,
            email,
            userType,
            profilePictureUrl: defaultprofilePictureUrl
        });

        await db.collection(USERS).doc(userRecord.uid).set(user.toFirestore());

        res.status(201).send({ message: 'User signed up successfully', user: userRecord });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {        
        const apiKey = process.env.FIREBASE_API_KEY;        

        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            email,
            password,
            returnSecureToken: true
        });

        const idToken = response.data.idToken;
        const userRecord = await admin.auth().getUserByEmail(email);                

        res.status(200).send({ message: 'User logged in successfully', token: idToken, user: userRecord });
    } catch (error) {
        console.error('Error logging in user:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        }
        res.status(400).send({ error: error.message });
    }
};

export const getUser = async (req, res) => {
    const { uid } = req.params;

    try {
        const userRecord = await admin.auth().getUser(uid);
        res.status(200).send(userRecord);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(400).send({ error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const usersSnapshot = await db.collection(USERS).get();
        if (usersSnapshot.empty) {
            return res.status(404).send({ message: 'No users found' });
        }
        
        const users = [];
        usersSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: error.message });
    }
};

export const getUserDashboard = async (req, res) => {
    const { uid } = req.user; // Assuming the user ID is attached to req.user by verifyToken middleware

    try {
        const userSnapshot = await db.collection(USERS).doc(uid).get();
        
        if (!userSnapshot.exists) {
            return res.status(404).send({ message: 'User not found' });
        }
        
        const userData = userSnapshot.data();
        res.status(200).send(userData);
    } catch (error) {
        console.error('Error fetching user dashboard:', error);
        res.status(500).send({ error: error.message });
    }
};

export const logoffUser = async (req, res) => {
    try {
        const { uid } = req.user; 
        if (!uid) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        await admin.auth().revokeRefreshTokens(uid);        

        res.status(200).send({ message: 'User logged off successfully' });
    } catch (error) {
        console.error('Error logging off user:', error);
        res.status(400).send({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }

    try {
        const apiKey = process.env.FIREBASE_API_KEY;

        await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
            requestType: 'PASSWORD_RESET',
            email
        });

        res.status(200).send({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        }
        res.status(500).send({ error: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    const { uid } = req.params; // User ID from URL params
    const { name, photoURL } = req.body; // New name and profile picture URL

    if (!uid || (!name && !photoURL)) {
        return res.status(400).json({ error: 'User ID and at least one field to update are required' });
    }

    try {
        const updates = {};
        if (name) updates.name = name;
        if (photoURL) updates.photoURL = photoURL;

        const userRecord = await admin.auth().updateUser(uid, updates);
        
        res.status(200).send({ message: 'User profile updated successfully', user: userRecord });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send({ error: error.message });
    }
};
