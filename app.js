const express = require("express");
const expressLayout=require("express-ejs-layouts")
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const app = express();
// Configure storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Generate a unique filename with the original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
// const upload = multer({ dest: "uploads/" });
const db = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "mathsem"
});

db.connect(e=>{
    if(e){
        throw e
    }
    console.log("db ok")
})
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))
app.set("view engine","ejs")
app.use(expressLayout)

app.get("/",(request, response)=>{
        response.render("layout",{ejsFile: 'index', title:'index'})
})

app.get("/db",(request, response)=>{
    db.query("select * from users2", (e,result)=>{
        if(e){
            throw e
        }
        response.render("layout",{data: result, ejsFile: 'db', title:'DB'})
    })
})

app.post("/upload",upload.single("file"),(request, response)=>{
    const{name, NAME_FILE}=request.body
    //console.log(name, NAME_FILE)
    const filePath=request.file.path
    console.log(path.extname(filePath))
    const sql = "insert into users2(NAME, NAME_FILE, FILE) values(?, ?, ?)"

    db.query(sql, [name, NAME_FILE, filePath], (e)=>{
        if(e){
            throw e
        }
        response.redirect('db')
    })
})


const port=process.env.PORT || 3000

app.listen(port,()=>console.log(`ok port ${port}`))
