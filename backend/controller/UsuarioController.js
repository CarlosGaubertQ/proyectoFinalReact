'use strict'
const bcrypt = require('bcrypt-nodejs')
var Usuario = require('../model/Usuario')
const servicio = require('../service/index')

async function save(req, res) {
    let usuario = new Usuario()
    usuario.firstName = req.body.firstName
    usuario.lastName = req.body.lastName
    usuario.email = req.body.email
    usuario.password = req.body.password


    Usuario.findOne({'email': req.body.email}, async (err, user) => {
        if(user) return res.status(401).send({ usuario: 'El correo que ingresas ya esta registrado' })
        if (err) return res.status(500).send({ usuario: 'error al realizar la peticion' }) 
        await usuario.save((err, userguardado)=>{

            if(err) res.status(500).send({usuario: `Error base de datos : ${err}`})
            else res.status(200).send({usuario: userguardado})
            
        })

    })
}

function validar(req, res) {
    var password = req.body.password;
    Usuario.findOne({'email': req.body.email}, (err, user) => {
        if (err) return res.status(500).send({ mensaje: 'error al realizar la peticion' })
        if (!user) return res.status(401).send({ mensaje: 'Error usuario no existe' })
        bcrypt.compare(password, user.password, function(error, isMatch) {
            if (error) {
                res.status(500).send(`Error al validar usuario> ${error}`)
            } else if (!isMatch) {
                res.status(401).send({ 'mensaje':'Contraseña incorrecto'})
            } else {
                res.status(200).send({ 'mensaje':'correcto', 'token':servicio.createToken(user)})
            }
          })
    })
}

function validaVigenciaUsuario(req,res){
    Usuario.findById(req.user, function(err, usuario){
        if(err) return res.status(401).send({message:'usuario no autorizado'})
        return res.status(200).send({'usuario': usuario.email})
    })
}

module.exports = {
    save,
    validar,
    validaVigenciaUsuario
};