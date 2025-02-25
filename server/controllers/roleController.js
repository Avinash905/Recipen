const Role = require("../models/roleModel");

const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        next(error);
    }
};

const getRole = async (req, res, next) => {
    try {
        const role = await Role.findOne({ _id: req.params.id });

        if (!role) return res.status(404).json({ message: "Role not found" });

        res.status(200).send(role);
    } catch (error) {
        next(error);
    }
};

const addRole = async (req, res, next) => {
    try {
        const { roleName } = req.body;
        if (!roleName) {
            return res.status(422).json({ message: "Insufficient data" });
        }
        const role = Role({ ...req.body });
        await role.save();
        res.status(201).json({ success: "Role added successfully" });
    } catch (error) {
        if (
            error.code === 11000 &&
            error.keyPattern &&
            error.keyPattern.roleName
        ) {
            res.status(500).json({ msg: "Role Name already in use" });
        }
        next(error);
    }
};

const updateRole = async (req, res, next) => {
    try {
        const { roleName } = req.body;
        if (!roleName) {
            return res.status(422).json({ message: "Insufficient data" });
        }

        const foundUser = await Role.findOne({ roleName });

        if (foundUser._id.toString() !== req.params.id) {
            return res
                .status(409)
                .json({ message: "Role Name already in use" });
        }

        const foundRole = await Role.findById(req.params.id);
        if (!foundRole)
            return res.status(404).json({ message: "Role not found" });

        foundRole.roleName = roleName;

        const updatedRole = await foundRole.save();
        res.status(201).json(updatedRole);
    } catch (error) {
        next(error);
    }
};

const deleteRole = async (req, res, next) => {
    try {
        const foundRole = await Role.findById(req.params.id);
        if (!foundRole)
            return res.status(404).json({ message: "Role not found" });

        await foundRole.deleteOne({ _id: req.params.id });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllRoles, getRole, addRole, updateRole, deleteRole };
