const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All inputs are required" });
  }

  const duplicate = await User.findOne({ email });
  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User({
      ...req.body,
      password: hashedPassword,
    });

    const result = user.save();
    res.status(201).json({ success: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.sendStatus(401);
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const roles = Object.values(foundUser.roles);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            userId: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            profilePicture: foundUser.profilePicture,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      const refreshToken = jwt.sign(
        {
          userId: foundUser._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "2d" }
      );

      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ accessToken });
    } else res.sendStatus(401);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //Forbidden
        console.log("attempted refresh token reuse!");
        const hackedUser = await User.findOne({
          userId: decoded.userId,
        }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    );
    return res.sendStatus(403);
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.log("expired refresh token");
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
        console.log(result);
      }

      if (err || foundUser.userId == decoded.userId) return res.sendStatus(403);

      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            userId: decoded._id,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ roles, accessToken });
    }
  );
};

module.exports = { register, login, refreshToken };
