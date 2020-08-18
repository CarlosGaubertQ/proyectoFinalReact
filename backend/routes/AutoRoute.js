'use strict'
 
// Cargamos el módulo de express para poder crear rutas
var express = require('express');
 
// Cargamos el controlador
var autoController = require('../controller/AutoController');
 
// Llamamos al router
var api = express.Router();
// Creamos una ruta de tipo GET para el método de pruebas
api.post('/autosave', autoController.guardar);
 


// Exportamos la configuración
module.exports = api;
