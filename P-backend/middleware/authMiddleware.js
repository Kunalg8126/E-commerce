import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  // If token missing
  if (!token) {
    return res.status(401).json({ message: "No token provided, unauthorized" });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded.id; // store user id in req.user
    next();
  });
};
