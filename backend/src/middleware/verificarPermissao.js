module.exports = (...tipos) => (req, res, next) =>
  tipos.includes(req.usuario.tipo) ? next() : res.status(403).json({ message: "Sem permissão para este recurso." });
