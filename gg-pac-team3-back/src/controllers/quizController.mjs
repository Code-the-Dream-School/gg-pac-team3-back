import admin from '../config/firebase.mjs';
import QuizModel from '../models/QuizModel.mjs';

const db = admin.firestore();
const QUIZZES = 'Quizzes';
const COURSES = 'Courses';
// const USERS = 'users';
const LESSONS = 'lessons';
// Create a new quiz for a lesson
export const createQuiz = async (req, res) => {
    const { lessonId, courseId } = req.params;
    const quizData = req.body;
// console.log(req.user.uid)
// console.log(req.params)

    try {
        const newQuiz = new QuizModel(quizData);

        const lessonRef = db.collection(COURSES).doc(courseId).collection(LESSONS).doc(lessonId); // Adjust as needed
        const quizRef = lessonRef.collection(QUIZZES).doc(); // Generate a new document ID
        await quizRef.set(newQuiz.toFirestore());

        res.status(201).send({ message: 'Quiz created successfully', quizId: quizRef.id });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).send({ error: error.message });
    }
};

// Get a quiz by ID
export const getQuiz = async (req, res) => {
    const { lessonId, courseId, quizId } = req.params;

    try {
        const quizDoc = await db.collection(COURSES).doc(courseId).collection(LESSONS).doc(lessonId).collection(QUIZZES).doc(quizId).get();

        if (!quizDoc.exists) {
            return res.status(404).send({ message: 'Quiz not found' });
        }

        const quizData = QuizModel.fromFirestore(quizDoc.data());
        res.status(200).send(quizData);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).send({ error: error.message });
    }
};

// Get all quizzes for a lesson
export const getAllQuizzesForLesson = async (req, res) => {
    const { lessonId,courseId } = req.params;

    try {
        const quizzesSnapshot = await db.collection(COURSES).doc(courseId).collection(LESSONS).doc(lessonId).collection(QUIZZES).get();

        if (quizzesSnapshot.empty) {
            return res.status(404).send({ message: 'No quizzes found' });
        }

        const quizzes = [];
        quizzesSnapshot.forEach(doc => {
            quizzes.push({ id: doc.id, ...QuizModel.fromFirestore(doc.data()) });
        });

        res.status(200).send(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).send({ error: error.message });
    }
};

// Update a quiz by ID
export const updateQuiz = async (req, res) => {
    const { lessonId, courseId, quizId } = req.params;
    const updates = req.body;

    try {
        const quizRef = db.collection(COURSES).doc(courseId).collection(LESSONS).doc(lessonId).collection(QUIZZES).doc(quizId);
        const quizDoc = await quizRef.get();

        if (!quizDoc.exists) {
            return res.status(404).send({ message: 'Quiz not found' });
        }

        await quizRef.update(updates);
        res.status(200).send({ message: 'Quiz updated successfully' });
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).send({ error: error.message });
    }
};

// Delete a quiz by ID
export const deleteQuiz = async (req, res) => {
    const { lessonId, courseId, quizId } = req.params;

    try {
        const quizRef = db.collection(COURSES).doc(courseId).collection(LESSONS).doc(lessonId).collection(QUIZZES).doc(quizId);
        const quizDoc = await quizRef.get();

        if (!quizDoc.exists) {
            return res.status(404).send({ message: 'Quiz not found' });
        }

        await quizRef.delete();
        res.status(200).send({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).send({ error: error.message });
    }
};
