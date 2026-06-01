const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // ดึง Token จาก Header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'ไม่มี Token กรุณา Login ก่อน' });
    }

    // ตรวจสอบ Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
};

module.exports = { protect };