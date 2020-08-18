'use strict'
 
// Cargamos el módulo de express para poder crear rutas
var express = require('express');
 
// Cargamos el controlador
var libroController = require('../controller/LibroController')
 
// Llamamos al router
var api = express.Router()
// Creamos una ruta de tipo GET para el método de pruebas
api.post('/librosave', libroController.guardar)
api.get('/libros', libroController.todos)
api.get('/libro/:id', libroController.selectone)
api.get('/libroIA/:idi&:anio', libroController.selanioidio)
api.delete('/libroDelete/:id', libroController.eliminar)
api.put('/libroUpdate/:id', libroController.update)

// Exportamos la configuración
module.exports = api;
