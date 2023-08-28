const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.roles) return res.status(401).json({ message: "Unauthorized" });

    const result = req.roles.some((role) => allowedRoles.includes(role));

    if (!result) return res.status(401).json({ message: "Unauthorized" });
    next();
  };
};

module.exports = verifyRoles;
