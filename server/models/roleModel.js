const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        roleName: {
            type: String,
            required: [true, "Role name is required"],
            minLength: 3,
            maxLength: 20,
            trim: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Role = mongoose.model("Role", schema);
module.exports = Role;
