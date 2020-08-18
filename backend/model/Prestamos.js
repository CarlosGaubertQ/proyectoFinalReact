const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Prestamo = new mongoose.Schema(
    {
        fechaInicio: Date,
        fechaEntrega: Date,
        fechaEntregaReal: {type: Date, default: null},
        libro: {type: Schema.ObjectId, ref: 'Libro'},
        alumno: {type: Schema.ObjectId, ref: 'Alumno'},
    }
)

module.exports = mongoose.model("Prestamo", Prestamo)