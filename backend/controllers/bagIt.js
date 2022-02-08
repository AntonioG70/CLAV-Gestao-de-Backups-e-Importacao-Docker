var BagIt = require('../models/bagIt')

module.exports.listar = () => {
    return BagIt
        .find()
        .exec()
}

module.exports.consultar = id => {
    return BagIt
        .findOne({_id: id})
        .exec()
}

module.exports.inserir = bagit => {
    var novo = new BagIt(bagit)
    return novo.save()
}

module.exports.alterar = med => {
    return BagIt.findByIdAndUpdate({_id: med._id}, med, {new: true})
}

module.exports.remover = function(nome){
    return BagIt.deleteOne({nome: nome})
}