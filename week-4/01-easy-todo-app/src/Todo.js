const express=require('express')
const app=express()
const bodyParser = require('body-parser');
app.use(bodyParser.json())
const port=3000
app.listen(port,()=>{console.log(`running on port ${port}`)})
const fs=require('fs')

const cors=require('cors')
app.use(cors())

app.get('/todos',(req,res)=>{
    fs.readFile("todolist.txt","utf-8",(err,data)=>{
        if(data){
            const todoData=JSON.parse(data)
            res.status(200).json(todoData)
        }else{
            req.sendStatus(404)
        }
    })
})

app.post('/todos',(req,res)=>{
    const body=req.body
    console.log(body)
    let newTodo={...body}
    fs.readFile("todolist.txt","utf-8",(err,data)=>{
        if(data){
            const todoData=JSON.parse(data)
            todoData.push(newTodo)
            fs.writeFile("todolist.txt",JSON.stringify(todoData),(err)=>{})
    res.status(201).json("Created")
        }

    
    })
})

app.delete('/todos/:id',(req,res)=>{
    const id=req.params.id
    fs.readFile("todolist.txt","utf-8",(err,data)=>{
        if(data){
            let todos=JSON.parse(data)
            todos=todos.filter((todo)=>todo.id!=id)
           
            fs.writeFile("todolist.txt",JSON.stringify(todos),(err)=>{})
            res.status(200).json("Deleted")
        }else{
            res.sendStatus(404)
        }
        
    })
})