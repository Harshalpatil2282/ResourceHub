// server/middleware/auth.js
const jwt = require('jsonwebtoken');

// Core authentication middleware — verifies JWT and attaches decoded payload to req.user
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Role-based authorization — pass an array of allowed roles
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: "Access denied: insufficient permissions" });
  }
  next();
};

// Convenience aliases used by visitorRoutes.js and other modules
const auth = verifyToken;
const isAdmin = checkRole(['admin']);

module.exports = { verifyToken, checkRole, auth, isAdmin };
