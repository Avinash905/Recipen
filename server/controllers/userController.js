const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .find({ _id: { $ne: req.user } })
            .select(["-password", "-refreshToken", "-favorites"]);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        await newUser
            .save()
            .then((savedUser) => {
                console.log(savedUser);
                res.status(201).json({ msg: "New user created successfully" });
            })
            .catch((error) => {
                console.log(error);

                if (
                    error.code === 11000 &&
                    error.keyPattern &&
                    error.keyPattern.email
                ) {
                    res.status(500).json({ msg: "Email already in use" });
                } else {
                    res.status(500).json({
                        msg: "Unable to create a new user",
                    });
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Unable to create a new user" });
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { name, email, password, image } = req.body;

        const foundUser = await User.findOne({ email });

        if (foundUser._id.toString() !== req.user) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        foundUser.name = name;
        foundUser.email = email;
        foundUser.password = hashedPassword;
        foundUser.profilePicture = image || foundUser.profilePicture;

        await foundUser.save();

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    userId: req.params._id,
                    name: name,
                    email: email,
                    profilePicture: image || foundUser.profilePicture,
                    roles: foundUser.roles,
                    favorites: foundUser.favorites,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
        );
        return res.status(201).json({ accessToken });
    } catch (error) {
        next(error);
    }
};

const disableUser = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { isDisabled: true }
        );
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, updateUser, disableUser, createUser };
