const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: [true, "Account already exists"],
        validate: [validator.isAlphanumeric, 'Usernames can only have alphanumeric characters']
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Account already exists"],
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, "Please enter your email"],
        minLength: [6, "Your password must be at least 6 characters long"],
        // select: false, //dont send back password after request
    },
    profilePic: {
        type: String,
        required: true,
        default: 'https://res.cloudinary.com/dkslaee8q/image/upload/v1681627905/profilePics/pngegg_qkawtl.png',
    },
    role: {
        type: String,
        default: 'user',
        enum: {
            values: [
                'user',
                'moderator',
                'admin'
            ],
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    upvotedReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
})


const User =  mongoose.model('User', userSchema, 'users')
module.exports = User