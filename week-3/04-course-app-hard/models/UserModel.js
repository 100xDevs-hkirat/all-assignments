const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'must provide a username'],
    trim: true,
    maxlength: [20, 'username can not be more than 20 characters'],
  },
  password: {
    type: String,
    required: [true, 'must provide password'],
    minLength: [8, 'password should be longer than 8 characters']
  },
  purchased_courses: {
    type: Array,
    default: [],
  }
})

module.exports = mongoose.model('User', UserSchema);