const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const User = new Schema({
    user_name:  { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
})

User.index({ user_name: 1}, { unique: true })

User.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash
        next()
    })
})

module.exports = mongoose.model('User', User)