// "kategori": "weapons and arms",
// "nama": "tombak dan lembing",
// "desc": "tombak dan lembing warisan nusantara",
// "date": "1400 Hijrah",
// "gambar": "tombak.jpg"

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