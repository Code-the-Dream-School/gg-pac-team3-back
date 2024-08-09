// routes/userCourseRoutes.mjs

import express from 'express';
import { enrollInCourse, getUserCourses } from '../controllers/userCourseController.mjs';

const router = express.Router();

// Route to enroll in a course
router.post('/enroll/:userId/:courseId', enrollInCourse);

// Route to get courses for a specific user
router.get('/:userId', getUserCourses);

export default router;
