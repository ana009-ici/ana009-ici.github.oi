// Administrador = tipo "administrador" ou a conta definida em PORTFOLIO_PUBLICO_EMAIL
const ehAdmin = (u) => u.tipo === "administrador" || u.email === (process.env.PORTFOLIO_PUBLICO_EMAIL || "").trim().toLowerCase();
const soAdmin = (req, res, next) => (ehAdmin(req.usuario) ? next() : res.status(403).json({ message: "Apenas o administrador pode alterar áreas e unidades." }));
module.exports = { ehAdmin, soAdmin };
