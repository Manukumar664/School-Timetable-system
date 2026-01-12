const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
dotenv.config();
connectDB();
const app = express();
// ==========================
// Middleware
// ==========================
 // app.use(cors({ origin: "https://school-timetable-system-ten.vercel.app", credentials: true }));

  app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());
// ==========================
// Route Imports
// ==========================
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const timetableRoutes = require('./routes/timetable');
const teacherRoutes = require('./routes/teacherRoutes');
const requestRoutes = require('./routes/requestRoutes');
const classRoutes=require("./routes/classRoutes")
// ==========================
// Route Mounting
// ==========================
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api', requestRoutes);
app.use('/api', classRoutes);
// ==========================
// Default Root Route
// ==========================
app.get('/', (req, res) => {
  res.send('🏫 School Management System Backend is running 🚀');
});
// ==========================
// 404 Not Found Handler
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
});
// ==========================
// Global Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});
// ==========================
// Start Server
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
