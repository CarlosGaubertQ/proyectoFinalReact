'use strict'
 
// Cargamos el módulo de express para poder crear rutas
var express = require('express');
 
// Cargamos el controlador
var personaController = require('../controller/PersonaController');
 
// Llamamos al router
var api = express.Router();
// Creamos una ruta de tipo GET para el método de pruebas
api.post('/pruebas', personaController.guardar);
 


// Exportamos la configuración
module.exports = api;
