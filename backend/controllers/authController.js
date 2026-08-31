const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    console.log('[register] called with body:', { ...req.body, password: '[REDACTED]' });

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    user = await User.create({ name, email, password, role: role || 'customer' });
    const token = generateToken(user._id);

    console.log('[register] success for:', email);
    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('[register] ERROR:', error.message);
    console.error('[register] STACK:', error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('[login] called with email:', req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Explicitly check JWT_SECRET before any DB call so the error is obvious
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set on the server');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('[login] no user found for email:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('[login] password mismatch for email:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    console.log('[login] success for:', email);

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('[login] ERROR:', error.message);
    console.error('[login] STACK:', error.stack);
    return res.status(500).json({ message: error.message, error: error.message });
  }
};
