const mongoose = require('mongoose')

const Libro = new mongoose.Schema({
        nombreLibro: String,
        autor: String, 
        idioma: {
            type: String, 
            enum:['ingles', 'español']
        } 
    }
)
module.exports = mongoose.model("Libro", Libro)
