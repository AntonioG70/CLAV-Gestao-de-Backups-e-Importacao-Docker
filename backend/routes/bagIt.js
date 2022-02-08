var express = require('express');
var router = express.Router();
var axios = require('axios')
var BagIt = require('../controllers/bagIt')

router.post('/', async function(req, res){
  axios({
    method: 'post',
    url: "http://clav-api.di.uminho.pt/v2/users/login",
    headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
    data: {
      username: req.body.username,
      password: req.body.password
    }
  })
  .then( () => {
    BagIt.listar()
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: "Ocorreu um erro a obter os bagits."}))
  })
  .catch(e => res.status(500).jsonp({error: e}))
})  


router.get('/download/:bag', function(req,res){
  res.download(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/' + req.params.bag + '.zip')
})

router.delete('/:nome', async function(req, res) {
  axios({
    method: 'post',
    url: "http://clav-api.di.uminho.pt/v2/users/login",
    headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
    data: {
      username: req.body.username,
      password: req.body.password
    }
  })
  .then(() => {
    console.log("aqui")
    BagIt.remover(req.params.nome)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(404).jsonp({error: e}))
  })
  .catch(e => res.status(500).jsonp({error: "Erro na autenticação"}))  

});


module.exports = router;