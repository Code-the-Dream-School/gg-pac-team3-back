// controllers/userCourseController.mjs

import admin from '../config/firebase.mjs';
import UserCourseModel from '../models/userCourseModel.mjs';

const db = admin.firestore();

export const enrollInCourse = async (req, res) => {
    const userId = req.user.uid; // Assuming you attach user ID to req.user in authentication middleware
  const { courseId } = req.body;
//   const { userId, courseId } = req.body;

  try {
    const userCourse = new UserCourseModel({
      userId,
      courseId,
      enrolledAt: new Date()
    });

    const userCourseRef = db.collection('User_Courses').doc();
    await userCourseRef.set(userCourse.toFirestore());

    res.status(201).send({ message: 'Enrolled in course successfully', id: userCourseRef.id });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).send({ error: error.message });
  }
};

export const getUserCourses = async (req, res) => {
  const { userId } = req.params;

  try {
    const userCoursesSnapshot = await db.collection('User_Courses')
      .where('userId', '==', userId)
      .get();

    if (userCoursesSnapshot.empty) {
      return res.status(404).send({ message: 'No courses found for this user' });
    }

    const courses = [];
    userCoursesSnapshot.forEach(doc => {
      courses.push({ id: doc.id, ...UserCourseModel.fromFirestore(doc.data()) });
    });

    res.status(200).send(courses);
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).send({ error: error.message });
  }
};
