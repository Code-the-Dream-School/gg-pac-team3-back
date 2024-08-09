import express from 'express';
import { enrollInCourse, getUserCourses } from '../controllers/userCourseController.mjs';
import { verifyToken } from '../middlewares/verifyToken.mjs';

const router = express.Router();

// Route to enroll in a course
router.post('/courses/:courseId/enrollments', verifyToken, enrollInCourse);

// Route to get courses for a specific user
router.get('/users/:userId/courses', verifyToken, getUserCourses);

export default router;
