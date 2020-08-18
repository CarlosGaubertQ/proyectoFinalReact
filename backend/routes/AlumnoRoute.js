'use strict'

var express = require('express');

var alumnoController = require('../controller/AlumnoController');

var api = express.Router();


api.post('/alumnoSave', alumnoController.save)
api.get('/alumnos', alumnoController.todos)
api.delete('/alumnoEliminar/:rut', alumnoController.eliminar)
api.put('/alumnoUpdate/:id', alumnoController.update)


module.exports = api;