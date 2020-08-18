'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs');

const Usuario = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: {type: String, unique: true} ,
        password: String
    }
)


Usuario.pre('save', function(next){
    const usuario = this
    if(!usuario.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err) next(err)
        bcrypt.hash(usuario.password,salt,null,(err,hash)=>{
            if(err) return next(err)
            usuario.password = hash
            next()
        })
    })

})


Usuario.methods.encryptPassword = async password=>{
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}

Usuario.methods.matchPassword = async (password)=>{
    return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model("Usuario", Usuario)
