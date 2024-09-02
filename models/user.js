const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    blitzHighScore: {
        type: Number,
        required: true
    },
    survivalHighScore: {
        type: Number,
        required: true
    },
    twentyHandsHighScore: {
        type: Number,
        required: true
    },
    WYHblitzHighScore: {
        type: Number,
        required: true
    },
    WYHsurvivalHighScore: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);