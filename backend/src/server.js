require("dotenv").config();
const express = require("express");
const cors = require("cors");
const autenticar = require("./middleware/autenticar");
const permissao = require("./middleware/verificarPermissao");
const { ehAdmin } = require("./middleware/soAdmin");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes")); // POST /api/auth/login (Passo 4)
app.use("/api/publico", require("./routes/publicoRoutes")); // sem login
app.get("/api/me", autenticar, (req, res) => res.json({ ...req.usuario, admin: ehAdmin(req.usuario) }));
app.use("/api/perfil-aluno", autenticar, permissao("aluno", "administrador"), require("./routes/perfilRoutes"));
app.use("/api/sesi", autenticar, permissao("aluno", "administrador"), require("./routes/sesiRoutes"));
app.use("/api/senai", autenticar, permissao("aluno", "administrador"), require("./routes/senaiRoutes"));
app.use("/api/professor", autenticar, require("./routes/professorRoutes"));

app.use((req, res) => res.status(404).json({ message: "Rota não encontrada." }));
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? "Erro interno do servidor." : err.message, details: err.details });
});
app.listen(process.env.PORT || 3333, () => console.log("API rodando"));
