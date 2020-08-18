'use strict'
var Alumnos = require('../model/Alumnos')


async function save(req, res) {
    let alumno = new Alumnos()
    
    alumno.nombre = req.body.nombre
    alumno.rut = req.body.rut


    Alumnos.findOne({'rut': req.body.rut}, async (err, user) => {
        if(user) return res.status(401).send({ usuario: 'El alumno que ingresaste ya esta registrado' })
        if (err) return res.status(500).send({ usuario: 'error al realizar la peticion' }) 
        await alumno.save((err, alumnoguardado)=>{

            if(err) res.status(500).send({alumno: `Error base de datos : ${err}`})
            else res.status(200).send({alumno: "Alumno registrado correctamente"})
            
        })

    })
}

function todos(req, res){
    Alumnos.find({},(err,alumnos)=>{
        if(err){
            res.status(400).send('Algo salio mal')
        }
        res.status(200).send(alumnos)
    })
}

function eliminar(req, res) {
    Alumnos.deleteOne({rut : req.params.rut},(err) =>{
        if(err) return res.status(500).send('Error al eliminar : ' + err)
        res.status(200).send('Dato elimina correctamente.')
    })
}

function update(req, res) {
    Alumnos.findById(req.params.rut, (err, alumno)=>{
        if(err){
            return res.status(500).send('Error base de datos')
        }else{
            if(!alumno){
                res.status(400).send('No se encontro a este alumno')
            }else{
                if(req.body.rut){
                    alumno.rut = req.body.rut 
                }
                if(req.body.nombre){
                    alumno.nombre = req.body.nombre 
                }
                alumno.save((err,updateAlumno)=>{
                    if(err){
                        console.log(err)
                        res.status(500).send()
                    }else{
                        res.status(200).send({modificar: 'Alumno modificado correctamente'})
                  }
                })
            }
        }
        
    })
}

module.exports = {
    save,
    todos,
    eliminar,
    update,
};