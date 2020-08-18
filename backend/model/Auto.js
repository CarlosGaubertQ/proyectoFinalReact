const mongoose = require('mongoose')

const Auto = new mongoose.Schema(
    {
        patente: String,
        modelo: String,
        velmax: {type: Number}
    }
)
module.exports = mongoose.model("Auto", Auto)
