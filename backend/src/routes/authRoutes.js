const r = require("express").Router();
const s = require("../services/authService");
r.post("/login", async (req, res, next) => { try { res.status(200).json(await s.login(req.body || {})); } catch (e) { next(e); } });
module.exports = r;
