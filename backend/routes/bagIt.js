var express = require('express');
var router = express.Router();
var axios = require('axios')
var BagIt = require('../controllers/bagIt')
var multer = require('multer');
var upload = multer({dest: './uploads'});
const mv = require('mv');

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
  .then( user => {
    BagIt.listar()
      .then(dados => res.status(200).jsonp({bagit: dados, token: user.data.token}))
      .catch(e => res.status(500).jsonp({error: "Ocorreu um erro a obter os bagits."}))
  })
  .catch(e => res.status(500).jsonp({error: "Erro na autenticação"}))
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
    BagIt.remover(req.params.nome)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(404).jsonp({error: e}))
  })
  .catch(e => res.status(500).jsonp({error: "Erro na autenticação"}))  

});

router.post('/importar', upload.single('file'), (req,res) => {
  let diretoria = (__dirname + req.file.path).replace("routes","").replace(/\\/g, "/");
  let nova_diretoria = (__dirname + 'uploads/' + req.file.originalname).replace("routes","").replace(/\\/g, "/");
  mv(diretoria, nova_diretoria, err => { if (err) throw err })
  if(req.body.opcao == '') res.status(400).jsonp({error: 'Opção não especificada'})
  else {
    if(req.file.originalname.split('.')[1] == 'zip'){
      axios({
        method: 'post',
        url: "http://localhost:7777/import?modo=" + req.body.opcao, 
        data: {
          username: req.body.email,
          password: req.body.password,
          bagName: req.file.originalname.split('.')[0]
        }
      })
      .then(dados => {
        console.log(dados)
      })
      .catch(err => console.log(err.data))
    }
  }
})

module.exports = router;