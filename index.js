const express = require("express");
const app = express();
const port = process.env.Port | 1234 ;

app.listen(port,function () {
    console.log("sever is running...");
});
app.set("view engine","ejs");
app.use(express.static("public"));// cho phép truy cập các file tĩnh như ảnh, css,...


const mysql = require("mysql");// kết nối mysql
const  conn = mysql.createConnection({// tạo kết nối vĩnh viễn
   host:"localhost",// máy khác thì địa chỉ ip
   port:"3306",
   user:"root",
   password:"",
   database:"tt2203e_nodejs",
   multipleStatements: true // cho phép truy vấn nhiều câu sql
});

var count = 0;
// list route
app.get("/",function (req, res) {
   res.send("welcome");
});
app.get("/bong-da",function (req, res) {
    res.send({name:"Nguyễn Văn An",age: 18});
});
// app.get("/demo",function (req, res) {
//     res.send("<h1>World Cup 2022</h1>");
// });
app.get("/home",function (req, res) {
    // truy vấn dc db để lấy ds sinh viên-------------------------------------------------
    const sql_txt = "select * from students";
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("404 not found");
        else{
            var studentList = data;
            res.render("home", {
                "count": count,
                "studentList": studentList
            })
        }

    })

});
app.get("/classes",function (req, res) {
   // truy vấn dc db để lấy ds lớp học -------------------------------------------------
    const sql_txt = "select * from classes";
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("404 not found");
        else{
                var studentList = data;
                res.render("classes", {
                    "count": count,
                    "studentList": studentList
                })
            }

    })
});

app.get("/classes-detail",function (req, res){
    // phải tìm được cách lấy được giá trị tham số trên URL
    const cid = req.query.cid;
    const sql_txt = "select * from classes where cid= "+cid+";"+"select * from students where cid="+cid+";";
    conn.query(sql_txt,function (err,data) {
        if(err) res.send("error")
        else{
            if(data[0].length>0){
                var classDetail = data [0][0];
                var studentList = data [1];
                res.render('classdetail',{
                    "studentList": studentList,
                    "classDetail": classDetail
                })
            }
            else {
                res.send("404");
            }

        }
    })
})