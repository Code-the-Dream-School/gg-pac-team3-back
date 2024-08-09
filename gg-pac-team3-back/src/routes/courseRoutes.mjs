import express from 'express';
import { createCourse, getCourse, getAllCourses, updateCourse, deleteCourse } from '../controllers/courseController.mjs';
import { verifyToken, isTeacher } from '../middlewares/verifyToken.mjs';

const router = express.Router();

// Route to get all courses
router.get('/', verifyToken,getAllCourses);

// Route to get course data by uid
router.get('/:uid', verifyToken,getCourse);

// Route for creating a course
// router.post('/createCourse', createCourse);
// router.post('/:courseId/create', createLesson);
router.post('/user/:uid/createCourse',verifyToken, isTeacher, createCourse);

// Route for deleting a course
router.delete('/user/:uid/deleteCourse/:uid', verifyToken, isTeacher, deleteCourse);

// Route for updating a course
router.patch('/user/:uid/updateCourse/:uid', verifyToken, isTeacher, updateCourse);

export default router;
