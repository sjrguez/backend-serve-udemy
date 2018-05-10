var express = require('express')
var jwt = require('jsonwebtoken')

var mdAutenticacion = require('../middleware/autenticacion')



var Medico = require('../models/medico')
var app = express()


// =======================================
//  Obtener todos los medicos
// =======================================

app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde)
    Medico.find({}, 'nombre img usuario hospital')

    .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre img')

    .exec((error, medicos) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "error cargando medicos",
                errors: error
            })
        }

        Medico.count({}, (error, conteo) => {
            res.status(200).json({
                ok: true,
                medicos: medicos,
                total: conteo
            })

        })

    })
})

// =======================================
//  Crear un medico
// =======================================

app.post('/', mdAutenticacion.VerificarToken, (req, res) => {

    var body = req.body

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    })

    medico.save((error, medicoGuardado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al crear medico",
                errors: error
            })
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        })
    })

})

// =======================================
//  Obtener medico
// =======================================
app.get('/:id', (req, res) => {
    var id = req.params.id


    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((error, medico) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "error al buscar medico",
                    errors: error
                })
            }
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "el medico con el id " + id + "no existe",
                    errors: { mmessage: "No existe el medico" }
                })
            }

            res.status(200).json({
                ok: true,
                medico: medico
            })


        })


})


// =======================================
//  Actualizar un medico
// =======================================

app.put('/:id', mdAutenticacion.VerificarToken, (req, res) => {
    var id = req.params.id
    var body = req.body

    Medico.findById(id, (error, medico) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al buscar medico",
                errors: error
            })
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: "el medico con el id " + id + "no existe",
                errors: { mmessage: "No existe el medico" }
            })
        }

        medico.nombre = body.nombre
        if (body.hospital) {
            medico.hospital = body.hospital
        }
        medico.save((error, medicoGuardado) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "error al actualizar medico",
                    errors: error
                })
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            })
        })
    })
})

// =======================================
//  eliminar un medico
// =======================================

app.delete('/:id', mdAutenticacion.VerificarToken, (req, res) => {
    var id = req.params.id

    Medico.findByIdAndRemove(id, (error, medicoBorrado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar medico",
                errors: error
            })
        }

        if (!medicoBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: "No existe medico con ese ID",
                errors: { message: "No existe medico con ese ID" }
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        })
    })
})

module.exports = app;