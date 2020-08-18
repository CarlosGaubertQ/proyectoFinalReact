const mongoose = require('mongoose')

const Persona = new mongoose.Schema(
    {
        nombre: String,
        apellido: String,
        direccion: String
    }
)
module.exports = mongoose.model("Persona", Persona)
