const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const fs = require("fs");

data = [];

app.use(bodyParser.json());
app.listen(3000, () => {
    console.log(`Running on 3000`);
    console.log(`http://127.0.0.1:3000`);
});
// For getting all the ToDos
app.get("/todos", (req, res) => {
    console.log(data);
    fs.readFile("database.txt", "utf-8", (err, data) => {
        console.log(data);
        res.status(200).json(data);
    });
});

// For Creating the ToDos
app.post("/todos", (req, res) => {
    let input = req.body;
    if (!(input.id == undefined)) {
        // res.status(302).send("Already Found!!!");
    } else {
        idm = data.length + 1;
        input.id = idm; //Math.floor(Math.random() * 1000000);
        data.push(input);
        //if (data.length === id) {
        res.status(201).json(input);
        //} else {
        //res.status(202).send("Something is wrong");
        //}
    }
});

// For getting a particular todo
app.get("/todos/:id", (req, res) => {
    id = req.params.id;
    let ans;
    let found = false;
    for (i = 0; i < data.length; i++) {
        // console.log(id + " " + data[i].id);
        if (id == data[i].id) {
            ans = data[i];
            found = true;
            break;
            // res.send(data[i]).status(200);
        }
    }
    if (found) {
        res.status(200).send(ans);
    } else {
        res.status(404).send("Not Found");
    }
});

// For updating a particular object
app.put("/todos/:id", (req, res) => {
    id = req.params.id;
    let updatedData = req.body;
    console.log("Updated Data" + updatedData);
    let found = false;
    for (i = 0; i < data.length; i++) {
        if (id == data[i].id) {
            found = true;
            data[i] = updatedData;
            data[i].id = id;
            console.log(data[i]);
        }
    }
    if (found) {
        res.status(200).send("Updated Json");
    } else {
        res.status(404).send("Not Found");
    }
});

// for deleting the todo
app.delete("/todos/:id", (req, res) => {
    wantToDeleteID = req.params.id;
    var indexToDelete = -1;
    found = false;
    for (i = 0; i < data.length; i++) {
        if (wantToDeleteID == data[i].id) {
            // data.splice(i, 1);
            indexToDelete = i;
            found = true;
            break;
        }
    }
    console.log(indexToDelete, found);
    data.splice(indexToDelete, 1);
    found ? res.status(200).send() : res.status(404).send();
});

module.exports = app;
