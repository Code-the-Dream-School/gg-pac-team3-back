import express from 'express';
import { createLesson, getLesson, getAllLessons, updateLesson, deleteLesson } from '../controllers/lessonController.mjs';

const router = express.Router();

// Create a new lesson in a course
router.post('/:courseId/create', createLesson);

// Fetch a specific lesson by ID
router.get('/:courseId/lessons/:lessonId', getLesson);

// Fetch all lessons in a course
router.get('/:courseId/lessons', getAllLessons);

// Update a lesson by ID
router.patch('/:courseId/lessons/:lessonId', updateLesson);

// Delete a lesson by ID
router.delete('/:courseId/lessons/:lessonId', deleteLesson);

export default router;
