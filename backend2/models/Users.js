const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
       type: String,
       lowercase: true,
       unique: true,
       required: [true, "can't be blank"],
       match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
       index: true
    },
    email: {
       type: String,
       lowercase: true,
       unique: true,
       required: [true, "can't be blank"],
       match: [/\S+@\S+\.\S+/, 'is invalid'],
       index: true
    }
   });

   const User = mongoose.model('User', UserSchema, 'users');

   module.exports = User;