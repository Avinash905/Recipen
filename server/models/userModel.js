const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            minLength: 3,
            maxLength: 20,
            trim: true,
            validate: {
                validator: function (value) {
                    const nameRegex = /^[a-zA-Z\s]*$/;
                    return nameRegex.test(value);
                },
                message: "First name must contain only alphabetic characters",
            },
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            // unique: true,
            validate: {
                validator: function (value) {
                    const emailRegex =
                        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return emailRegex.test(value);
                },
                message: "Please fill a valid email address",
            },
        },
        contactNumber: {
            type: String,
            required: [true, "Contact Number is required"],
            validate: {
                validator: function (value) {
                    const contactRegex = /^\d{8}$/;
                    return contactRegex.test(value);
                },
                message: "Please fill a valid contact number",
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        profileImage: {
            type: String,
            required: false,
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        isDisabled: { type: Boolean, default: false },
        refreshToken: { type: [String] },
        favouriteList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Recipe",
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", schema);
module.exports = User;
