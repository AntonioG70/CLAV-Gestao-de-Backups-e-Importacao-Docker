var express = require('express');
var router = express.Router();
var AdmZip = require("adm-zip");
var fs = require('fs');
const { default: axios } = require('axios');
var multer = require('multer');
var upload = multer({dest: './uploads'});
const mv = require('mv');

var Users = require('../controllers/users')
var Pedidos = require('../controllers/pedidos')
var Entidades = require('../controllers/entidades')
var Legislacao = require('../controllers/legislacao')
var Tipologia = require('../controllers/tipologia')
var ops = require('../controllers/ops')
var Classes = require('../controllers/classes');

router.post('/', upload.single('file'), async function(req, res){
  let diretoria = (__dirname + req.file.path).replace("routes","").replace(/\\/g, "/");
  let nova_diretoria = (__dirname + 'uploads/' + req.file.originalname).replace("routes","").replace(/\\/g, "/");
  if(!fs.existsSync(nova_diretoria)){
    mv(diretoria, nova_diretoria, err => { if (err) console.log("ERRO: " + err) })
  }
  if(req.file.originalname.split('.')[1] == 'zip'){
    var fileName = req.file.originalname.split('.')[0]
    //opcao adicionar tudo
    if(req.query.opcao == 'total'){
      var path = __dirname.replace(/\\/g, "/").split('routes')[0]
      var zip = new AdmZip(path + 'uploads/' + fileName + '.zip');
      zip.extractAllTo("./public/extract/" + fileName, true);
      var files = fs.readdirSync("./public/extract/" + fileName + "/data");
      for(const f of files){
        console.log(f)
        if(ops.IsJsonString(fs.readFileSync("./public/extract/" + fileName + "/data/" + f + '/' + f + '.json'))){
          let obj = JSON.parse(fs.readFileSync("./public/extract/" + fileName + "/data/" + f + '/' + f + '.json'))
          if(f == 'users'){
            await Users.total(obj, req.query.token)
          }
          else if(f == 'pedidos'){
            await Pedidos.total(obj, req.query.token)
          }
          else if(f == 'entidades'){
            await Entidades.total(obj, req.query.token)
          }
          else if(f == 'legislacao'){
            await Legislacao.total(obj, req.query.token)
          }
          else if(f == 'tipologias'){
            await Tipologia.total(obj, req.query.token)
          }
          else if(f == 'classes'){
            await Classes.total(obj, req.query.token)
          }                                 
        }
        else{
          console.log("erro:" + f)
        }        
      }  
      await axios.get('http://clav-api.di.uminho.pt/v2/reload/cache?token=' + req.query.token)
        .then(dados => res.jsonp("Informação importada. A recarregar a cache..."))
        .catch(err => res.status(500).send("Erro no reload da cache"))
            
    }
    //opcao adicionar os que não estão presentes na bd
    else if(req.query.opcao == 'adicionar'){
      var path = __dirname.replace(/\\/g, "/").split('routes')[0]
      var zip = new AdmZip(path + 'uploads/' + fileName + '.zip');
      zip.extractAllTo("./public/extract/" + fileName, true);
      var files = fs.readdirSync("./public/extract/" + fileName + "/data");
      for(const f of files){
        console.log(f)
        if(ops.IsJsonString(fs.readFileSync("./public/extract/" + fileName + "/data/" + f + '/' + f + '.json'))){
          let obj = JSON.parse(fs.readFileSync("./public/extract/" + fileName + "/data/" + f + '/' + f + '.json'))
          if(f == 'users'){
            await Users.add(obj, req.query.token)
          }
          else if(f == 'pedidos'){
            await Pedidos.add(obj, req.query.token)
          }
          else if(f == 'entidades'){
            await Entidades.add(obj, req.query.token)
          }
          else if(f == 'legislacao'){
            await Legislacao.add(obj, req.query.token)
          }
          else if(f == 'tipologias'){
            await Tipologia.add(obj, req.query.token)
          }
          else if (f == 'classes'){
            await Classes.add(obj, req.query.token)
          }          
        }
        else{
          console.log("erro:" + f)
        }        
      }
      await axios.get('http://clav-api.di.uminho.pt/v2/reload/cache?token=' + req.query.token)
        .then(dados => res.jsonp("Informação importada. A recarregar a cache..."))
        .catch(err => res.status(500).send("Erro no reload da cache"))          
    }
    //opcao overwrite
    else if(req.query.opcao == 'overwrite'){
      var path = __dirname.replace(/\\/g, "/").split('routes')[0]
      var zip = new AdmZip(path + 'uploads/' + fileName + '.zip');
      zip.extractAllTo("./public/extract/" + fileName, true);
      var files = fs.readdirSync("./public/extract/" + fileName + "/data");
      for(const f of files){
        console.log(f)
        if(ops.IsJsonString(fs.readFileSync("./public/extract/" + fileName + "/data/" + f + '/' + f + '.json'))){
          let obj = JSON.parse(fs.readFileSync("./public/extract/" + fileName + "/data/" + f + '/' + f + '.json'))
          if(f == 'users'){
            await Users.overwrite(obj, req.query.token)
          }
          else if(f == 'pedidos'){
            await Pedidos.overwrite(obj, req.query.token)
          }
          else if(f == 'entidades'){
            await Entidades.overwrite(obj, req.query.token)
          }
          else if(f == 'legislacao'){
            await Legislacao.overwrite(obj, req.query.token)
          }
          else if(f == 'tipologias'){
            await Tipologia.overwrite(obj, req.query.token)
          }
          else if(f == 'classes'){
            await Classes.overwrite(obj, req.query.token)
          }          
        }
        else{
          console.log("erro:" + f)
        }        
      }
      await axios.get('http://clav-api.di.uminho.pt/v2/reload/cache?token=' + req.query.token)
        .then(dados => res.jsonp("Informação importada. A recarregar a cache..."))
        .catch(err => res.status(500).send("Erro no reload da cache"))  
    }
    else {
      res.status(400).jsonp({error: 'Opção não especificada'})
    }
  }
  else {
    res.status(500).jsonp({error: 'Erro no processo'})
  }  
})

module.exports = router;