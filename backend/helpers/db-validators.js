const { User } = require('../models');

const registerEmail = async ( email = '' ) => {

    const user = await User.findOne( { email } );

    if( user ){
        throw new Error( `El email: ${ email } ya está registrado` );
    }
}

const existingUser = async ( email = '' ) => {

    const user = await User.findOne( { email } );

    if( !user ){
        throw new Error( `El email: ${ email } no está registrado` );
    }
}

module.exports = {
    existingUser,
    registerEmail,
}