import express from 'express';
import { createCourse, getCourse, getAllCourses, updateCourse, deleteCourse } from '../controllers/courseController.mjs';
// import { verifyToken } from '../middlewares/verifyToken.mjs';

const router = express.Router();

// Route to get all courses
router.get('/', getAllCourses);

// Route to get course data by uid
router.get('/:uid', getCourse);

// Route for creating a course
router.post('/createCourse', createCourse);
// router.post('/user/teacher/createCourse', createCourse);

// Route for deleting a course
router.delete('/deleteCourse/:uid', deleteCourse);

// Route for updating a course
router.patch('/updateCourse/:uid', updateCourse);

export default router;
