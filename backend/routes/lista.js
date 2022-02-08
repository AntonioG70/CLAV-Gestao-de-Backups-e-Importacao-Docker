var express = require('express');
var router = express.Router();
var lista = require('../controllers/verify')

router.get('/', function(req, res){
  var newLista = lista.getLista()
  res.send(newLista)
})

router.get('/apikey', function(req, res){
  var newLista = lista.getListaKey()
  res.send(newLista)
})



module.exports = router;