// const express = require("express");
// port = "3000";
// const app = express();
//
// app.set("view engine", "ejs");
//
// app.get("/", (req, res) => {
//   res.render("index");
// });
//
// app.get("/hello", (req, res) => {
//   res.json({ message: " this is hellow world message" });
// });
//
// app.listen(port, () => {
//   console.log(`server is running at the port ${port}`);
// });
//

const students = {
  name: "sunita",
  printname: function (){
    console.log(this);
  }
}

students.printname()

const student2 = {
  name: "randheer"
}

students.printname.call(student2)
