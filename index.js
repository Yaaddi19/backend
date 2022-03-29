var app = require('express')();
var server = require('http').Server(app);
var e = require('express')

var io = require('socket.io')(server);
const mysql = require("mysql");
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
const fs = require('fs');

const engines = require("consolidate");
const md5 = require('md5');
var exphbs = require('express-handlebars');
var url = require('url');


app.use(bodyParser.json());
app.use(cors())

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

// app.use(bodyParser.urlencoded({ extended: true }))


 const pool = mysql.createPool({
     host: "localhost",
     user: "root",
     password: "",
     database: "konsultasi_db"
 });

 

app.get("/test", (req, res) => {
    console.log("test")
    res.send("go to /test to see tests")
});

app.post("/register", (req, res) => {
     console.log("test");
     var pass = md5(req.body.password);
     
     var sql = `INSERT INTO user (pekerjaan, nama, email, password, foto)
     VALUES ('${req.body.pekerjaan}', '${req.body.nama}', '${req.body.email}', '${pass}', '${req.body.foto}')`;

     console.log(sql);

      pool.getConnection(function (err, connection) {
         connection.query(sql, function (error, results, fields) {
             connection.release();



             if (error) {
                return res.json("error");
             } else {
                return res.json("success");
             }
         });
     });
 })

app.post("/login", (req, res) => {
    console.log("test")
    var pass = md5(req.body.password);
    var sql = `SELECT * FROM user WHERE email = '${req.body.email}' AND password = '${pass}' LIMIT 1`;
        
    pool.getConnection(function (err, connection) {
        connection.query(sql, function (error, results, fields) {
            connection.release();
           console.log(results)
           console.log("[mysql error]",error);


            if (error) throw error;
            //console.log("ini adalah",req.file);
            if (results == "") {
                return res.json("gagal")
            } else {
                return res.json(results);
            }
        });
    });
})




server.listen(port, () => console.log("server is running in " + port))