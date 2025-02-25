const ROLES_LIST = require("../config/rolesList");
const verifyOwn = () => {
    return (req, res, next) => {
        if (!req.roles)
            return res.status(401).json({ message: "Unauthorized" });

        const result = req.roles.some((role) => role === ROLES_LIST.BasicUser);

        if (!result) {
            next();
        } else if (req.user === req.params.id) {
            next();
        } else return res.status(401).json({ message: "Unauthorized" });
    };
};

module.exports = verifyOwn;
