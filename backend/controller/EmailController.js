'use strict'


async function enviarCorreo(req, res) {
    const mailjet = require ('node-mailjet').connect('70f3e70e52fa76e79df1aa91d3f08efe', '424dd89750561712214ec5d85f4445e8')
        const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
        "Messages":[
            {
            "From": {
                "Email": process.env.USEREMAIL,
                "Name": "kendo"
            },
            "To": [
                {
                "Email": req.body.emailEnviar,
                "Name": req.body.name
                }
            ],
            "Subject": req.body.asunto,
            "TextPart": "Correo electronico via Node Mailjet",
            "HTMLPart": "<h3>"+ req.body.cuerpo+"</h3>",
            "CustomID": "AppGettingStartedTest"
            }
        ]
        })
        request
        .then((result) => {
            res.status(200).send({mensaje: "correcto"})
            console.log(result.body)
        })
        .catch((err) => {
            res.status(400).send({mensaje: "Algo sucedio "})
            console.log(err.statusCode)
        })


}


module.exports = {
    enviarCorreo
}