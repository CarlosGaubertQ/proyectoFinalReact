'use strict'
 
// Cargamos el módulo de express para poder crear rutas
var express = require('express');
var prestamoController = require('../controller/PrestamoController')


var api = express.Router()

api.post('/prestamoSave', prestamoController.guardar)
api.get('/prestamos', prestamoController.todos)
api.get('/prestamosDevo', prestamoController.prestamosDevolucion)
api.put('/updatePrestamo/:id', prestamoController.update)
api.delete('/eliminarPrestamo/:id', prestamoController.eliminar)
api.post('/cantidadPrestamos', prestamoController.cantidadPrestamos)


module.exports = api;