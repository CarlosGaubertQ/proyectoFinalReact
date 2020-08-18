'use strict'
 
// AQUI Cargamos el modelo para usarlo posteriormente en la siguiente clase

const Auto = require('../model/Auto');
 
// Creamos un método en el controlador, en este caso una accion de pruebas
function guardar(req, res){
    let auto = new Auto()

    auto.patente = req.body.patente
    auto.modelo = req.body.modelo
    auto.velmax = req.body.velmax
    
    auto.save((err, autoguardado)=>{
        if(err){
            res.status(500).send(`Error base de datos : ${err}`)
        }else{
            res.status(200).send({auto: autoguardado})
        }
    });
   
}
 

// Exportamos las funciones en un objeto json para poder usarlas en otros fuera de este fichero
module.exports = {
    guardar
};
