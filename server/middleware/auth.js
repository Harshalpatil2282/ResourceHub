// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId, role
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: "Access denied: insufficient permissions" });
  }
  next();
};

module.exports = { verifyToken, checkRole };
