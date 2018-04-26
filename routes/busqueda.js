var express = require('express')

var app = express()

var Hospital = require('../models/hospital')
var Medico = require('../models/medico')
var Usuario = require('../models/usuario')


// ===========================================
// Busqueda pro collecion
// ===========================================





app.get('/collecion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda
    var tabla = req.params.tabla
    var regex = new RegExp(busqueda, 'i')
    var promesa


    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex)
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex)
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex)
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: Usuario,Medicos y Hospitales',
                errors: { message: "Tipo de tabla/coleccion invalido" }
            })
            break;
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    })

    //     if (tabla === 'usuarios') {
    //         buscarUsuarios(busqueda, regex).then(usuarios => {
    //             res.status(200).json({
    //                 ok: true,
    //                 usuarios: usuarios

    //             })
    //         })
    //     } else if (tabla === 'hospitales') {
    //         buscarHospitales(buscarHospitales, regex).then(hospitales => {
    //             res.status(200).json({
    //                 ok: true,
    //                 hospitales: hospitales
    //             })
    //         })
    //     } else if (tabla === 'medicos') {
    //         buscarMedicos(buscarHospitales, regex).then(medicos => {
    //             res.status(200).json({
    //                 ok: true,
    //                 medicos: medicos
    //             })
    //         })
    //     }

})



// ===========================================
// Busqueda general
// ===========================================


app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda
    var regex = new RegExp(busqueda, 'i')



    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuesta => {
            res.status(200).json({
                ok: true,
                hospitales: respuesta[0],
                medicos: respuesta[1],
                usuarios: respuesta[2]

            })
        })



})

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, inject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((error, hospitales) => {
                if (error) {
                    reject("Error al cargar hospitales", error)
                } else {
                    resolve(hospitales)
                }
            })

    })
}


function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, inject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((error, medicos) => {
                if (error) {
                    reject("Error al cargar medicos", error)
                } else {
                    resolve(medicos)
                }
            })

    })
}


function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, inject) => {
        Usuario.find()
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((error, Usuarios) => {
                if (error) {
                    reject("Error al cargar Usuarios", error)
                } else {
                    resolve(Usuarios)
                }
            })

    })
}
module.exports = app;