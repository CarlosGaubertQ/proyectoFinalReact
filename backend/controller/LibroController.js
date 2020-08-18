'use strict'

const Libro = require('../model/Libro');

function guardar(req, res) {
    let libro = new Libro()
    if (req.body.nombreLibro != undefined) {
        if (req.body.autor != undefined) {
            if (req.body.idioma != undefined) {
                libro.nombreLibro = req.body.nombreLibro
                libro.autor = req.body.autor
                libro.idioma = req.body.idioma

                libro.save((err, libroguardado) => {
                    if (err) {
                        res.status(400).send(`Error base de datos : ${err}`)
                    } else {
                        res.status(200).send({ auto: "Libro guardado correctamente" })
                    }
                });
            } else {
                res.status(400).send(`Falto idioma`)
            }

        } else {
            res.status(400).send(`Falto autor`)
        }
    } else {
        res.status(400).send(`Falto nombre del libro`)
    }
}

function todos(req, res) {
    Libro.find({}, (err, libros) => {
        if (err) {
            res.status(400).send('Algo salio mal')
        }
        res.status(200).send(libros)
    })
}

function selectone(req, res) {
    Libro.findById(req.params.id, (err, libro) => {
        if (err) return res.status(400).send('No encontro el libro')
        res.status(200).send(libro)
        console.log(libro)
    })
}

function selanioidio(req, res) {
    if (req.params.idi != undefined && req.params.anio != undefined) {
        Libro.find({ idioma: req.params.idi, anio: req.params.anio }, (err, libro) => {
            if (libro.length == 0) return res.status(400).send("No se encontro el o los libros")
            if (err) return res.status(500).send("Algo ocurrio")
            res.status(200).send(libro)
            console.log(libro)
        })
    } else {
        res.status(400).send("No digitaron los datos.")
    }
}

function eliminar(req, res) {
    Libro.deleteOne({ _id: req.params.id }, (err) => {
        if (err) return res.status(500).send('Error al eliminar : ' + err)
        res.status(200).send('Dato eliminado correctamente')
    })
}

function update(req, res) {
    Libro.findById(req.params.id, (err, libro) => {
        if (err) {
            return res.status(500).send('Error base de datos')
        } else {
            if (!libro) {
                res.status(400).send()
            } else {
                if (req.body.nombreLibro != '') {
                    libro.nombreLibro = req.body.nombreLibro
                }
                if (req.body.autor != '') {
                    libro.autor = req.body.autor
                }
                if (req.body.idioma != '') {
                    libro.idioma = req.body.idioma
                }
                libro.save((err, updateLibro) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send()
                    } else {
                        res.status(200).send(updateLibro)
                    }
                })
            }
        }

    })
}

module.exports = {
    guardar,
    todos,
    selectone,
    selanioidio,
    eliminar,
    update
};