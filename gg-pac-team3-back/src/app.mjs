import express from 'express';
import cors from 'cors';
import favicon from 'express-favicon';
import logger from 'morgan';
import userRoutes from './routes/userRoutes.mjs';
import courseRoutes from './routes/courseRoutes.mjs';
import mainRouter from './routes/mainRouter.mjs';
import lessonRoutes from './routes/lessonRoutes.mjs';
import quizRoutes from './routes/quizRoutes.mjs';
import userCourseRoutes from './routes/userCourseRoutes.mjs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(new URL('./public/favicon.ico', import.meta.url).pathname));

// Routes
app.use('/', mainRouter);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);  // Pluralized path
app.use('/api/courses', lessonRoutes);  // Pluralized path
app.use('/api/courses', quizRoutes);  // Pluralized path
app.use('/api', userCourseRoutes);  // Integrated path

export default app;
