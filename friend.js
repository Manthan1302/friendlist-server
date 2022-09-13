const mongoose = require('mongoose');
const Schema = mongoose.Schema

const friendSchema = new Schema({
    email:String,
    name:String,
    age:Number
},{collection : "friend"});

const Friend = mongoose.model("friends", friendSchema)
module.exports = Friend