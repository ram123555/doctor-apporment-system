const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ msg: "No token" });

    try {
      const decoded = jwt.verify(token, "SECRET_KEY");
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }
      next();
    } catch {
      res.status(401).json({ msg: "Invalid token" });
    }
  };
};

module.exports = auth;
