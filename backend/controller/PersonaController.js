'use strict'
 
// AQUI Cargamos el modelo para usarlo posteriormente en la siguiente clase
var Persona = require('../model/Personas');
 
// Creamos un método en el controlador, en este caso una accion de pruebas
function guardar(req, res){
    let persona = new Persona()

    persona.nombre = req.body.nombre
    persona.apellido = req.body.apellido
    persona.direccion = req.body.direccion
    
    persona.save((err, autoguardado)=>{
        if(err){
            res.status(500).send(`Error base de datos : ${err}`)
        }else{
            res.status(200).send({persona: autoguardado})
        }
    });
   
}
 

// Exportamos las funciones en un objeto json para poder usarlas en otros fuera de este fichero
module.exports = {
    guardar
};
