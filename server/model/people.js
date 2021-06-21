const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    nome : {
        type : String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    dataNascimento: {
        type: String,
        required: true 
    },
    cpf: {
        type: String,

    },
    ativo:{
        type:Boolean,
        required: true

    },
    meta:{
        type : Number,
        required: true

    }
})
//Create model with given schema
const pessoa = mongoose.model('pessoa', schema);

exports.pessoaModel = pessoa;

