var express = require('express')
var jwt = require('jsonwebtoken')

var mdAutenticacion = require('../middleware/autenticacion')



var Hospital = require('../models/hospital')
var app = express()



// =======================================
//  Obtener todos los hospitales
// =======================================

app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde)

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((error, hospitales) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando hospitales",
                    errors: error
                })
            }
            Hospital.count({}, (error, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                })
            })

        })

})



// =======================================
//  Crear un hospital
// =======================================

app.post('/', mdAutenticacion.VerificarToken, (req, res) => {

    var body = req.body

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    })

    hospital.save((error, hospitalGuardado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear hospital",
                errors: error
            })
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        })


    })


})

// =======================================
//  actualizar un hospital
// =======================================

app.put('/:id', mdAutenticacion.VerificarToken, (req, res) => {

    var id = req.params.id
    var body = req.body


    Hospital.findById(id, (error, hospital) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar hospital",
                errors: error
            })
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: "el hospital con el id " + id + "no existe",
                errors: { mmessage: "No existe el hospital" }
            })
        }

        hospital.nombre = body.nombre
        hospital.save((error, hospitalGuardado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar hospital",
                    errors: error
                })
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            })

        })


    })


})

// =======================================
//  eliminar un hospital
// =======================================


app.delete('/:id', mdAutenticacion.VerificarToken, (req, res) => {
    var id = req.params.id

    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar hospital",
                errors: error
            })
        }

        if (!hospitalBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: "No existe hospital con ese ID",
                errors: { message: "No existe hospital con ese ID" }
            })
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        })
    })
})






module.exports = app;