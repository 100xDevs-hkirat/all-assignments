const mongoose = require('mongoose');

const todoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        }
    }
)


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;