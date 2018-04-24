// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


// Inicializar variables

var app = express()


// Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas

var appRoute = require('./routes/app')
var usuarioRoute = require('./routes/usuario')
var loginRoute = require('./routes/login')


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (error, res) => {
    if (error) throw error
    console.log("Base de datos 3000: \x1b[32m%s\x1b[0m", " online");
})


// Rutas

app.use('/usuario', usuarioRoute)
app.use('/login', loginRoute)
app.use('/', appRoute)



// Escuchar peticiones

app.listen(3000, () => {
    console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m", " online");

})