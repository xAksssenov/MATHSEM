const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const app = express();

// Подключение к базе данных MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "mathsem",
});

// Проверка подключения к базе данных
db.connect((e) => {
  if (e) {
    throw e;
  }
  console.log("Database connected");
});

// Настройка Multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Установка движка представлений EJS
app.set("view engine", "ejs");
app.use(expressLayout);

// Парсинг данных в форме
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Маршрут для отображения главной страницы
app.get("/", (req, res) => {
  res.render("layout", { ejsFile: "index", title: "index" });
});

// Маршрут для отображения данных из базы данных
app.get("/db", (req, res) => {
  db.query("SELECT * FROM users2", (err, result) => {
    if (err) {
      throw err;
    }
    res.render("layout", { data: result, ejsFile: "db", title: "DB" });
  });
});

// Маршрут для загрузки файлов
app.post("/upload", upload.single("file"), (req, res) => {
  const { name, NAME_FILE } = req.body;
  const filePath = req.file.path;
  const sql = "INSERT INTO users2 (NAME, NAME_FILE, FILE) VALUES (?, ?, ?)";

  db.query(sql, [name, NAME_FILE, filePath], (err) => {
    if (err) {
      throw err;
    }
    res.redirect("/db");
  });
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
