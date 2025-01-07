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
  console.log("Conectado a la base de datos de manera exitosa");
});

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalido" });
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

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "5h" });
    res.json({ token });
  });
});

app.get('/api/verify-token', authenticate, (req, res) => {
  // Si llega aquí, el token es válido
  res.status(200).json({ valid: true });
});

// CRUD de entradas
app.get("/api/noticias", authenticate, (req, res) => {
  console.log("get");
  const sql = "SELECT * FROM noticias ORDER BY fecha DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    res.json(results);
  });
});

app.post("/api/noticias", authenticate, (req, res) => {
  console.log("post");
  const { titulo, subtitulo, contenido, categoria, visible, imagen_url, imagen_descripcion, tags } = req.body;
  const fecha = req.body.fecha || new Date();
  const autor = req.body.autor || "Chestudio";
  const tagsString = tags.filter(tag => tag.trim() !== '').join(',');
  const slug = titulo.toLowerCase().replace(/\s+/g, '-');
  const sql = "INSERT INTO noticias (titulo, contenido, subtitulo, fecha, categoria, visible, imagen_url, imagen_descripcion, autor, tags, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [titulo, contenido, subtitulo, fecha, categoria, visible, imagen_url, imagen_descripcion, autor, tagsString, slug], (err, results) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    res.json({ id: results.insertId, ...req.body });
  });
});


app.put("/api/noticias/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { titulo, contenido, subtitulo, categoria, visible, imagen_url, imagen_descripcion, tags } = req.body;
  const fecha = req.body.fecha || new Date();
  const autor = req.body.autor || "Chestudio";

  const slug = titulo.toLowerCase().replace(/\s+/g, '-');

  console.log(req.body);

  // Convertir el arreglo de tags en una cadena de texto separada por comas
  const tagsString = tags.filter(tag => tag.trim() !== '').join(',');

  const sql = `
    UPDATE noticias
    SET titulo = ?, contenido = ?, subtitulo = ?, fecha = ?, categoria = ?, visible = ?, imagen_url = ?, imagen_descripcion = ?, autor = ?, tags = ?, slug = ?
    WHERE id_noticia = ?
  `;

  db.query(sql, [titulo, contenido, subtitulo, fecha, categoria, visible, imagen_url, imagen_descripcion, autor, tagsString, slug, id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error de base de datos" });
    }
    res.json({ ok: true, body: req.body });
  });
});


app.delete("/api/noticias/:id", authenticate, (req, res) => {
  console.log("delete");
  const { id } = req.params;
  const sql = "DELETE FROM noticias WHERE id_noticia = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    res.json({ message: "Noticia eliminada de manera exitosa" });
  });
});

// Peticiones usuarios

app.get("/api/user/ultimas-noticias", (req, res) => {
  console.log("user");
  const sql = "SELECT * FROM noticias WHERE visible = 1 ORDER BY fecha DESC LIMIT 6";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    console.log(results);
    res.json(results);
  });
});

app.get("/api/user/noticia/:id", (req, res) => {
  const { id } = req.params;
  console.log("user");
  const sql = "SELECT * FROM noticias WHERE id_noticia = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    console.log(result);
    res.json(result);
  });
});

// Ruta para obtener los slugs
app.get("/api/blog/slugs", (req, res) => {
  const sql = "SELECT slug FROM noticias WHERE visible = 1";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    const slugs = results.map(({slug}) => ({ params: { slug } }));
    console.log("slugs", slugs);
    res.status(200).json(slugs);
  });
});

app.get("/api/user/noticias", (req, res) => {
  console.log("user");
  const sql = "SELECT * FROM noticias WHERE visible = 1 ORDER BY fecha";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    console.log(results);
    res.json(results);
  });
});

app.get("/api/user/noticia-by-slug/:slug", (req, res) => {
  const { slug } = req.params;
  console.log("user");
  const sql = "SELECT * FROM noticias WHERE slug = ?";
  db.query(sql, [slug], (err, results) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    console.log(results);
    res.json(results[0]);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
