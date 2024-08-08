// const express = require('express');
// const app = express();
// const cors = require('cors')
// const favicon = require('express-favicon');
// const logger = require('morgan');
// const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const courseRoutes = require('./routes/courseRoutes');

// const mainRouter = require('./routes/mainRouter.js');

// // middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(logger('dev'));
// app.use(express.static('public'))
// app.use(favicon(__dirname + '/public/favicon.ico'));

// // routes
// // app.use('/api/v1', mainRouter);
// app.use('/api/users', userRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/course', courseRoutes);
// module.exports = app;

import express from 'express';
import cors from 'cors';
import favicon from 'express-favicon';
import logger from 'morgan';
import userRoutes from './routes/userRoutes.mjs';
// import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.mjs';
// import mainRouter from './routes/mainRouter.mjs';
import lessonRoutes from './routes/LessonRoutes.mjs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(new URL('./public/favicon.ico', import.meta.url).pathname));

// Routes
app.use('/api/users', userRoutes);
// app.use('/api/admin', adminRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/course', lessonRoutes);
export default app;
