'use strict'
 
// Cargamos el módulo de express para poder crear rutas
var express = require('express')
const UsuarioController = require('../controller/UsuarioController')
const auth = require('../middlewares/auth')

var api = express.Router()

api.post('/guardarUsuario', UsuarioController.save)
api.post('/validarUsuario', UsuarioController.validar)
api.post('/vigencia',auth.isAuth, UsuarioController.validaVigenciaUsuario)

module.exports = api