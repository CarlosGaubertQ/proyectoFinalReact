'use strict'
 
// Cargamos el módulo de express para poder crear rutas
var express = require('express');
var emailController = require( '../controller/EmailController') 

 
// Llamamos al router
var api = express.Router();
// Creamos una ruta de tipo GET para el método de pruebas
api.post('/emailEnviar', emailController.enviarCorreo);



// Exportamos la configuración
module.exports = api;
