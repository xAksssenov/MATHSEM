const express = require("express");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
const path = require("path");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// Настройка соединения с базой данных
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "database_name",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// Маршрут для загрузки файлов
app.post("/upload", (req, res) => {
  const { name, NAME_FILE } = req.body;
  const file = req.files.file;

  const uploadPath = path.join(__dirname, "uploads", file.name);

  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    const query = "INSERT INTO files (name, name_file, file) VALUES (?, ?, ?)";
    db.query(query, [name, NAME_FILE, file.name], (err, result) => {
      if (err) throw err;
      res.send("File uploaded and saved in database");
    });
  });
});

// Маршрут для отображения таблицы
app.get("/data", (req, res) => {
  const query = "SELECT * FROM files";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
