'use stric'


var Prestamo = require('../model/Prestamos')


function guardar(req, res) {
    let prestamo = new Prestamo()


    if (req.body.fechaInicio != undefined || req.body.fechaEntrega != undefined || req.body.libro != undefined || req.body.alumno != undefined) {
        prestamo.fechaInicio = req.body.fechaInicio
        prestamo.fechaEntrega = req.body.fechaEntrega
        prestamo.libro = req.body.libro
        prestamo.alumno = req.body.alumno

        prestamo.save((err, prestamoGuardado) => {
            if (err) {
                res.status(401).send(`Error base de datos : ${err}`)
            } else {
                res.status(200).send({ prestamo: prestamoGuardado })
            }
        });
    } else {
        res.status(500).send({ error: "Error al ingresar datos"})
    }

}

function todos(req, res) {
    var dataFinal = []
    Prestamo.find()
    .populate(['libro','alumno']).exec((err, prestamos) =>{
        if(err) return res.status(401).send({error: 'Error al conectar'})
        prestamos.map((prestamo) =>{
            
            if(prestamo.libro.nombreLibro && prestamo.alumno.nombre){
                dataFinal.push({
                    _id: prestamo._id,
                    fechaInicio: prestamo.fechaInicio,
                    fechaEntrega: prestamo.fechaEntrega,
                    fechaEntregaReal: prestamo.fechaEntregaReal,
                    nombreLibro: prestamo.libro.nombreLibro,
                    idioma: prestamo.libro.idioma,
                    autor: prestamo.libro.autor,
                    nombre: prestamo.alumno.nombre,
                    rut: prestamo.alumno.rut
                })
            }
        })


        res.status(200).send(dataFinal)
    })
}

function prestamosDevolucion(req, res) {
    var dataFinal = []
    Prestamo.find().where('fechaEntregaReal').equals(null)
    .populate(['libro','alumno']).exec((err, prestamos) =>{
        if(err) return res.status(401).send({error: 'Error al conectar'})
        
        prestamos.map((prestamo) =>{
            dataFinal.push({
                _id: prestamo._id,
                fechaInicio: prestamo.fechaInicio,
                fechaEntrega: prestamo.fechaEntrega,
                fechaEntregaReal: prestamo.fechaEntregaReal,
                nombreLibro: prestamo.libro.nombreLibro,
                idioma: prestamo.libro.idioma,
                autor: prestamo.libro.autor,
                nombre: prestamo.alumno.nombre,
                rut: prestamo.alumno.rut
            })
        })


        res.status(200).send(dataFinal)
    })
}

function cantidadPrestamos(req, res){
    var cantidad = 0 
    let now = new Date()
    Prestamo.find()
    .where('libro').equals(req.body.id)
    .populate(['libro','alumno'])
    .exec((err, prestamos) =>{
        if(err) return res.status(404).send({prestamos: "No se encontro un prestamos"})
        if(!prestamos) return res.status(200).send({prestamos: 0})

        prestamos.map((prestamo) =>{
            if(prestamo.fechaEntrega > now && prestamo.fechaEntregaReal === null){
                cantidad++
            }
        })

        if( cantidad === 0) return res.status(200).send({prestamos: 0})
        res.status(200).send({prestamos: cantidad})
    })
}


function update(req, res) {
    Prestamo.findById(req.params.id, (err, prestamo) => {
        if (err) {
            return res.status(500).send({error: 'Error base de datos'})
        } else {
            if (!prestamo) {
                res.status(400).send({error: 'No existe este prestamo'})
            } else {
                if (req.body.fechaEntregaReal) {
                    prestamo.fechaEntregaReal = req.body.fechaEntregaReal
                }
                
                prestamo.save((err, updatePrestamo) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.status(200).send(updatePrestamo)
                    }
                })
            }
        }

    })
}

function eliminar(req, res) {
    Prestamo.deleteOne({ _id : req.params.id},(err) =>{
        if(err) return res.status(500).send({eliminar :'Error al eliminar : ' + err})
        res.status(200).send({elliminar:'Dato elimina correctamente.'})
    })
}

module.exports = {
    guardar,
    todos,
    prestamosDevolucion,
    update,
    eliminar,
    cantidadPrestamos,
}