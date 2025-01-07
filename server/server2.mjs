import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 3001;
const SECRET_KEY = "gnasildxc"; // Cambia esto por una clave secreta segura

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar conexión a MySQL
const db = mysql.createConnection({
  host: "bh8966.banahosting.com",
  user: "vlyldxch_user",
  password: "q31fn42err9h",
  database: "vlyldxch_chestudio",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Rutas de autenticación
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    if (results.length === 0) return res.status(401).json({ message: "Credenciales invalidas" });

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ message: "Credenciales invalidas" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1d" });
    res.json({ token });
  });
});

// CRUD de entradas
app.get("/api/noticias", authenticate, (req, res) => {
  const sql = "SELECT * FROM noticias";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    res.json(results);
  });
});

app.post("/api/noticias", authenticate, (req, res) => {
  const { titulo, subtitulo, contenido, categoria, fecha, tags, visible } = req.body;
  const sql = "INSERT INTO noticias (titulo, subtitulo, contenido, categoria, fecha, tags, visible) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [titulo, subtitulo, contenido, categoria, fecha, tags.join(","), visible], (err, results) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    res.json({ id: results.insertId, titulo, subtitulo, contenido, categoria, fecha, tags, visible });
  });
});

app.put("/api/noticias/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { titulo, subtitulo, contenido, categoria, fecha, tags, visible } = req.body;
  const sql = "UPDATE noticias SET titulo = ?, subtitulo = ?, contenido = ?, categoria = ?, fecha = ?, tags = ?, visible = ? WHERE id_noticia = ?";
  db.query(sql, [titulo, subtitulo, contenido, categoria, fecha, tags.join(","), visible, id], (err) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    res.json({ id, titulo, subtitulo, contenido, categoria, fecha, tags, visible });
  });
});

app.delete("/api/noticias/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM noticias WHERE id_noticia = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    res.json({ message: "Entry deleted" });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
