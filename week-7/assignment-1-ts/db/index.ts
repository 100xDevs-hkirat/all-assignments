// import { ObjectId } from "mongoose";
import mongoose from "mongoose";



// type mongoTodos = {
//     _id:ObjectId,
//     title:string,
//     decription:string,
//     done:boolean,
//     userId:string,
//     __v:0
// }

// type mongoUser = {
//     _id:ObjectId,
//     username:string,
//     password:string,
//     __v:0
// }

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    done: Boolean,
    userId: String,
});

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

// module.exports = {
//     User,
//     Todo
// }
export {User}
export {Todo}
// export default mongoose.model("User",userSchema)
// export default mongoose.model("Todo",todoSchema)