const Student = require('../models/Student');
const crypto = require('crypto');

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student by group
const getStudentById = async (req, res) => {
  const { group } = req.params;
  try {
    const student = await Student.findOne({ group });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Get student by group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new student
const addStudent = async (req, res) => {
  const { name, phone, group, email } = req.body;
  try {
    if (!name || !phone || !group) {
      return res.status(400).json({ message: 'Name, phone, and group are required' });
    }

    const existingStudent = await Student.findOne({ group });
    if (existingStudent) {
      return res.status(400).json({ message: 'Group already exists' });
    }

    const encryptedId = crypto.createHash('sha256').update(group).digest('hex');
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const qrCodeUrl = `${FRONTEND_URL}/student/qrcode/${encryptedId}`; // URL for scanning
    const newStudent = new Student({
      name,
      phone,
      group,
      qrCode: qrCodeUrl, // Store the URL instead of just the hash
      email,
      photo: 'https://via.placeholder.com/100',
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', qrCode: qrCodeUrl });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student by QR code
const getStudentByQrCode = async (req, res) => {
  const { qrCode } = req.params;
  try {
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const student = await Student.findOne({ qrCode: `${FRONTEND_URL}/student/qrcode/${qrCode}` });
    if (!student) {
      return res.status(404).json({ message: 'Student not found by QR code' });
    }
    res.json(student);
  } catch (error) {
    console.error('Get student by QR code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update a grade for a student
const addGrade = async (req, res) => {
  const { group } = req.params;
  const { course, grade } = req.body;
  try {
    if (!course || grade === undefined) {
      return res.status(400).json({ message: 'Course and grade are required' });
    }

    const student = await Student.findOne({ group });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const existing = student.grades.find(g => g.course === course);
    if (existing) {
      existing.grade = grade; // update existing course's grade
    } else {
      student.grades.push({ course, grade });
    }

    await student.save();
    res.json({ message: 'Grade saved successfully', grades: student.grades });
  } catch (error) {
    console.error('Add grade error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a course to a student
const addCourse = async (req, res) => {
  const { group } = req.params;
  const { name, status } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: 'Course name is required' });
    }
    const student = await Student.findOne({ group });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.courses.push({ name, status: status || 'Active' });
    await student.save();
    res.json({ message: 'Course added successfully', courses: student.courses });
  } catch (error) {
    console.error('Add course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add an assignment to a student (optionally with a PDF attached)
const addAssignment = async (req, res) => {
  const { group } = req.params;
  const { title, status, dueDate, grade } = req.body;
  try {
    if (!title) {
      return res.status(400).json({ message: 'Assignment title is required' });
    }
    const student = await Student.findOne({ group });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const assignment = {
      title,
      status: status || 'Due',
      dueDate: dueDate || null,
      grade: grade !== undefined && grade !== '' ? Number(grade) : null,
      fileUrl: null,
      fileName: null,
    };

    if (req.file) {
      assignment.fileUrl = `/uploads/assignments/${req.file.filename}`;
      assignment.fileName = req.file.originalname;
    }

    student.assignments.push(assignment);
    await student.save();
    res.json({ message: 'Assignment added successfully', assignments: student.assignments });
  } catch (error) {
    console.error('Add assignment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Set a student's attendance (admin sets the totals directly)
const updateAttendance = async (req, res) => {
  const { group } = req.params;
  const { attendance, totalClasses } = req.body;
  try {
    const student = await Student.findOne({ group });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (attendance !== undefined) student.attendance = Number(attendance);
    if (totalClasses !== undefined) student.totalClasses = Number(totalClasses);
    await student.save();
    res.json({
      message: 'Attendance updated successfully',
      attendance: student.attendance,
      totalClasses: student.totalClasses,
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get the logged-in student's own record (for student-role accounts)
const getMyRecord = async (req, res) => {
  try {
    if (req.user.role !== 'student' || !req.user.studentGroup) {
      return res.status(400).json({ message: 'This account is not linked to a student record' });
    }
    const student = await Student.findOne({ group: req.user.studentGroup });
    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Get my record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  getStudentByQrCode,
  addGrade,
  addCourse,
  addAssignment,
  updateAttendance,
  getMyRecord,
};