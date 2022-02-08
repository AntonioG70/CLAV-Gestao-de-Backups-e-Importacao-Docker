const mongoose = require('mongoose')

var bagItSchema = new mongoose.Schema({
    nome:  {type: String, required: true},
    criador: {type: String, required: true},
    data_criacao: {type: String, required: true},
    tamanho: {type: String, required: true},
    ficheiros: [{type: String, required: true}]
});

module.exports = mongoose.model('bagIt', bagItSchema)