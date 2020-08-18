'use strict'
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()


var cors = require('cors')
var libro_routes = require('./routes/LibroRoute')
var usuario_routes = require('./routes/UsuarioRoute')
var email_routes = require('./routes/EmailRoute')
var alumno_routes = require('./routes/AlumnoRoute')
var prestamo_routes = require('./routes/PrestamoRoute')


app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/api', libro_routes)
app.use('/api', usuario_routes)
app.use('/api', email_routes)
app.use('/api', alumno_routes)
app.use('/api', prestamo_routes)

mongoose.connect('mongodb+srv://'+process.env.USERBD+':'+process.env.PASSBD+'@'+process.env.CLUSTER+'?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, (err, res)=>{
    app.listen(5000,()=>{
        console.log("Funcionando en puerto 5000")
    })
})



