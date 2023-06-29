const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'must provide a username'],
    trim: true,
    maxlength: [20, 'username can not be more than 20 characters'],
  },
  password: {
    type: String,
    minLength: [8, 'password should be longer than 8 characters']
  },
})

module.exports = mongoose.model('Admin', AdminSchema);
