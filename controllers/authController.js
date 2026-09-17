const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
// Simple shared secret so random visitors can't self-register as admin.
// Change this in your .env for anything beyond local demo use.
const ADMIN_SIGNUP_CODE = process.env.ADMIN_SIGNUP_CODE || 'admin123';

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, studentGroup: user.studentGroup },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      username: user.username,
      studentGroup: user.studentGroup,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const signup = async (req, res) => {
  const { email, password, username, role, group, adminCode } = req.body;
  try {
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const chosenRole = role === 'admin' ? 'admin' : 'student';

    if (chosenRole === 'admin') {
      if (adminCode !== ADMIN_SIGNUP_CODE) {
        return res.status(403).json({ message: 'Invalid admin code' });
      }
    }

    let studentGroup = null;
    if (chosenRole === 'student') {
      if (!group) {
        return res.status(400).json({ message: 'Group/Roll number is required for student accounts' });
      }
      const existingStudent = await Student.findOne({ group });
      if (!existingStudent) {
        return res.status(404).json({
          message: 'No student record found for that group. Ask your admin to add you first.',
        });
      }
      studentGroup = group;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: chosenRole,
      studentGroup,
    });
    await user.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { login, signup };
