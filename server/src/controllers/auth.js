const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // เช็คว่า email ซ้ำไหม
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email นี้ถูกใช้งานแล้ว' });
    }

    // เข้ารหัส password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้าง User ใหม่
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // สร้าง Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // หา User จาก email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email หรือ Password ไม่ถูกต้อง' });
    }

    // เช็ค password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email หรือ Password ไม่ถูกต้อง' });
    }

    // สร้าง Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login };