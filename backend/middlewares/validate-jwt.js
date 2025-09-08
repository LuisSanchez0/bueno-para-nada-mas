const { request, response } = require('express')
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const validateJWT = async ( req = request, res = response, next ) => {

    const token = req.header('Authorization')?.replace('Bearer ', '')

    if( !token ){
        return res.status( 401 ).json({
            ok:false,
            msg: 'No hay un token valido para realizar la petición'
        });
    }

    try{

        const { uid } = jwt.verify( token, process.env.SECRETEORPRIVATEKEY );

        const user = await User.findById( uid );

        if( !user ){
            return res.status( 401 ). json({
                msg: 'Token no válido - usuario no existe en la base de datos',
                ok: false
            });
        }

        //Verificar si el uid tiene estado en true
        if( !user.state ){
            return res.status( 401 ). json({
                msg: 'Token no válido - El usuario ya no tiene acceso al sistema',
                ok: false
            });
        }

        req.user = user;

        next();

    } catch( err ){
        console.log( err );
        res.status( 401 ).json({
            msg: 'Token ingresado invalido',
            ok: false
        });
    }

}

module.exports = {
    validateJWT
}