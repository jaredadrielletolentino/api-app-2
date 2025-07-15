//[Section] Activity
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: [true, 'Email is Required']
    },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile Number is Required']
    }
});


module.exports = mongoose.model('User', userSchema);