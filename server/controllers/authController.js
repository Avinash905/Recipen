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
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (foundUser.disabled) {
      return res.status(403).json({ message: "Account terminated" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: foundUser._id.toString(),
          name: foundUser.name,
          email: foundUser.email,
          profilePicture: foundUser.profilePicture,
          roles: foundUser.roles,
          favorites: foundUser.favorites,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
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
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    return res.status(403).json({ message: "Forbidden" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || foundUser._id.toString() !== decoded.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            userId: foundUser._id.toString(),
            name: foundUser.name,
            email: foundUser.email,
            profilePicture: foundUser.profilePicture,
            roles: foundUser.roles,
            favorites: foundUser.favorites,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      res.json({ accessToken });
    }
  );
};

const logout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { register, login, refreshToken, logout };
