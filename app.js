const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Multer config for photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// MySQL connection
const db = mysql.createConnection({
  host: "db",
  user: "root",       // change if needed
  password: "root123",// change if needed
  database: "userdb"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// Save route
app.post("/save", upload.single("photo"), (req, res) => {
  const { name, email, phone, password } = req.body;
  const photo = req.file ? req.file.filename : null;

  const sql = "INSERT INTO users (name, email, phone, password, photo) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, email, phone, password, photo], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
