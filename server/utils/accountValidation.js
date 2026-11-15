const normalizeEmail = (email) => typeof email === "string" ? email.trim().toLowerCase() : "";
const validEmail = (email) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validName = (name) => typeof name === "string" && name.trim().length >= 2 && name.trim().length <= 100;
const validPassword = (password) => typeof password === "string" && password.length >= 8 && Buffer.byteLength(password, "utf8") <= 72;
module.exports = { normalizeEmail, validEmail, validName, validPassword };
