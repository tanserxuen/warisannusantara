const mongoose = require('mongoose');
const warisanNusantaraSchema = new mongoose.Schema({
    category: String,
    name: String,
    description: String,
    date: String,
    picture: String,
})

var WarisanNusantara = mongoose.model('WarisanNusantara', warisanNusantaraSchema);  

module.exports = { WarisanNusantara };