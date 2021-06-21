const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    pessoaId : {
        type : String,
        required: true
    },
    data: {
        type: String,
        required: true 
    },
    valor: {
        type: Number,
        required: true
    }

})
//Create model with given schema
const receita = mongoose.model('receita', schema);

exports.receitaModel = receita;

