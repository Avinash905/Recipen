const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .find({ isDisabled: false })
            .select(["-password", "-refreshToken", "-favorites"]);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            isDisabled: false,
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).send(user);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        const foundUser = await User.findOne({ email, isDisabled: false });

        if (foundUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User({
            ...req.body,
            password: hashedPassword,
        });

        await newUser
            .save()
            .then((savedUser) => {
                res.status(201).json({ msg: "New user created successfully" });
            })
            .catch((error) => {
                if (
                    error.code === 11000 &&
                    error.keyPattern &&
                    error.keyPattern.email
                ) {
                    res.status(500).json({ msg: "Email already in use" });
                } else {
                    res.status(500).json({
                        msg: error,
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
        const { firstName, lastName, contactNumber, email, password, image } =
            req.body;

        // disabled cannot be edited
        const foundUser = await User.findOne({
            _id: req.params.id,
            isDisabled: false,
        });
        if (!foundUser) {
            return res.status(409).json({ message: "User not found" });
        }

        // check that email is not in used
        const foundEmail = await User.findOne({ email, isDisabled: false });
        if (foundEmail._id.toString() !== req.user) {
            return res.status(409).json({ message: "Email already in use" });
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        foundUser.firstName = firstName;
        foundUser.lastName = lastName;
        foundUser.contactNumber = contactNumber;
        foundUser.email = email;
        foundUser.password = hashedPassword || foundUser.password;
        foundUser.profileImage = image || foundUser.profileImage;

        await foundUser.save();

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    userId: req.params._id,
                    firstName: firstName,
                    lastName: lastName,
                    contactNumber: contactNumber,
                    email: email,
                    profileImage: image || foundUser.profileImage,
                    roleId: foundUser.roleId,
                    roles: [foundUser.roleId.roleName],
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

module.exports = { getAllUsers, updateUser, disableUser, createUser, getUser };
