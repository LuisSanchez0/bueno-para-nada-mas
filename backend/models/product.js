const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [ true, 'El nombre del producto es obligatorio' ],
        minlength: [ 4, 'El nombre del producto debe de contener como minimo 4 caracteres' ],
    },
    type: {
        type: String,
        required: [ true, 'La categoria es obligatoria' ],
        enum: {
            values: [ 'VINILO', 'CD', 'CASETE'],
            message: '{VALUE} no es un tipo válido'
        }
    },
    img: [
        {
            type: String
        }
    ],
    songsBySide:[
        {
            side: {
                type: String,
                required: [ true, 'El lado de las canciones es obligatorio']
            },
            songs: [
                {
                   nameSong: {
                        type: String,
                        required: [ true, 'El nombre de la canción es obligatoria']
                   }
                }

            ]
        }
    ],
    genre: {
        type: String,
        required: [ true, 'El genero del formato es obligatorio' ],
        minlength: [ 3, 'El genero del formato es obligatorio' ],
    },
    year: {
        type: Number,
        required: [true, 'El año es obligatorio'],
        min: [1948, 'El año no puede ser menor a 1948, inicio del LP'],
        max: [new Date().getFullYear(), 'El año no puede ser mayor al actual']
    },
    price: {
        type: Number,
        required: [ true, 'El precio del producto es obligatorio' ],
        min: [ 0, 'El precio no puede ser negativo' ]
    },
    stock: {
        type: Number,
        required: [ true, 'El stock del producto es obligatorio' ],
        min: [ 0, 'El stock no puede ser negativo' ]
    },
    casseteCategory: {
        type: String,
        enum: [ 'NUEVO', 'SEMI USADO', 'USADO']
    },
    vinolusCategory: {
        type: Number,
        enum: {
            values: [ 7,10,12 ],
            message: '{VALUE} no es un tamaño válido de vinilo'
        }
    },
    vinolusEspecialEdition: {
        type: String,
        enum: {
            values: [ 'COLORES', 'MATERIAL EXTRA'],
            message: '{VALUE} no es un caso para una edición especial'
        }
    },
    state: {
        type: Boolean,
        default: true,
    },
    isLimited: {
        type: Boolean,
        default: false
    },
    startsAt: {
        type: Date,
    },
    endsAt: {
        type: Date,
    },

});

ProductSchema.methods.toJSON = function(){
    const { __v, state, ...data } = this.toObject();
    return data;
};

module.exports = model ( 'Product', ProductSchema )