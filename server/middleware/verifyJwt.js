const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.UserInfo.userId;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJwt;
