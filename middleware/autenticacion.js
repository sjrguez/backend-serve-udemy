var jwt = require('jsonwebtoken')

var SEED = require('../config/config').SEED

// =======================================
// Verificar Token
// =======================================
exports.VerificarToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token, SEED, (error, decoded) => {

        if (error) {
            return res.status(401).json({
                ok: false,
                mensaje: "Token incorrecto",
                errors: error
            })
        }
        req.usuario = decoded.usuario
        next()
    })
}

// =======================================
// Verificar ADMIN_ROLE
// =======================================
exports.VerificarADMIN_ROLE = function(req, res, next) {

    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next()
        return
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: "No tiene permiso administrador",
            errors: { mensaje: "Admin role incorrecto" }
        })

    }
}

// =======================================
// Verificar ADMIN or MISMO USER
// =======================================
exports.VerificarADMIN_o_MismoUser = function(req, res, next) {

    let usuario = req.usuario
    let id = req.params.id

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next()
        return
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: "No tiene permiso administrador",
            errors: { mensaje: "Admin role incorrecto" }
        })

    }
}