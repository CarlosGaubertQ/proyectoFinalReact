'use strict'
const mongoose = require('mongoose')

const Alumno = new mongoose.Schema(
    {
        nombre: String,
        rut: {type: String, unique: true},
    }
)
module.exports = mongoose.model("Alumno", Alumno)
