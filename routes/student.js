const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const qrController = require('../controllers/qrController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Admin-only: list/view all students
router.get('/', verifyToken, requireAdmin, studentController.getStudents);

// Logged-in student: view their own record (must be before /:group)
router.get('/me', verifyToken, studentController.getMyRecord);

// Public: scanning a QR code should work without logging in
router.get('/qrcode/:qrCode', studentController.getStudentByQrCode);

// Admin-only: view one student by group
router.get('/:group', verifyToken, requireAdmin, studentController.getStudentById);

// Admin-only: create students / manage their records
router.post('/', verifyToken, requireAdmin, studentController.addStudent);
router.post('/generate-qr', verifyToken, requireAdmin, qrController.generateQR);
router.patch('/:group/grades', verifyToken, requireAdmin, studentController.addGrade);
router.post('/:group/courses', verifyToken, requireAdmin, studentController.addCourse);
router.post('/:group/assignments', verifyToken, requireAdmin, upload.single('file'), studentController.addAssignment);
router.patch('/:group/attendance', verifyToken, requireAdmin, studentController.updateAttendance);

module.exports = router;
