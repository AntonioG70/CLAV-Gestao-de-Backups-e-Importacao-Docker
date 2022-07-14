var express = require('express');
var router = express.Router();
var axios = require('axios')
var fs = require('fs')
var AdmZip = require("adm-zip");

var verify = require('../controllers/verify')
var classes = require('../controllers/classes')
var general = require('../controllers/general')
var docApoio = require('../controllers/doc-apoio')
var pgd = require('../controllers/pgd');
var ops = require('../controllers/ops')
var vocabularios = require('../controllers/vocabularios')
var rada = require('../controllers/rada')
var BagIt = require('../controllers/bagIt')

router.post('/', async function(req, res){
  console.log(req.body)
    if(req.query.token && req.body.username){
      let path = __dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/bagit-' + Date.now()
      let today = new Date()
      let data = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0') + " " + String(today.getHours()+1).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0')
      let pathSplit = path.split('/')
      let nome = pathSplit[pathSplit.length-1]
      var zip = new AdmZip()

      for(const c of req.body.col) {
        if(verify.check(c)){
          if(c == 'pgdLC'){
            await axios.get('http://clav-api.di.uminho.pt/v2/pgd/lc?token=' + req.query.token)
              .then(async dados =>{
                await pgd.setUp("pgdLC", req.body, dados, req.query.token, false, path)
                general.checkLast("pgdLC", req.body, res, nome)
              })
              .catch(e => {
                res.send(e.message)
              })
            }
            else if (c == 'radaOLD') {
              await axios.get('http://clav-api.di.uminho.pt/v2/rada/old?token=' + req.query.token)
                .then(async dados =>{
                  await rada.setUp("radaOLD", req.body, dados, req.query.token, false, path)
                  general.checkLast("radaOLD", req.body, res, nome)
                })
                .catch(e => {
                  res.send(e.message)
                })
            }
            else if (c == "classes"){
              await axios.get('http://clav-api.di.uminho.pt/v2/classes?info=completa&estrutura=lista&token=' + req.query.token)
                .then(async dados => {
                  await classes.setUp(c, req.body, dados, path)
                  general.checkLast(c, req.body, res, nome)
                })
                .catch(e => {
                  res.send(e.message)
                })
            }
            else{
              await axios.get('http://clav-api.di.uminho.pt/v2/' + c + '?token=' + req.query.token)
                .then(async dados => {
                  if(c == "vocabularios"){
                    await vocabularios.setUp(c, req.body, dados, req.query.token, false, path)
                    general.checkLast(c, req.body, res, nome)
                  }
                  else if(c == "documentacaoApoio"){
                    await docApoio.setUp(c, req.body, dados, req.query.token, false, path)
                    general.checkLast(c, req.body, res, nome)
                  }
                  else if (c == "pgd"){
                    await pgd.setUp(c, req.body, dados, req.query.token, false, path)
                    general.checkLast(c, req.body, res, nome)
                  }
                  else{
                    await general.setUp(c, req.body, dados, path)
                    general.checkLast(c, req.body, res, nome)
                  }
                })
                .catch(e => {
                  console.log(e.message)
                  res.send(e.message)
                })
            }  
          }
          else{
            await general.errorSetup(c, req.body, path)
            general.checkLast(c, req.body, res, nome)
          }  
        }
        let size = ops.writeSize(path + '/data', path)

        zip.addLocalFolder(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/' + nome)
        zip.writeZip(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/' + nome + '.zip')

        var bag = {
          nome: nome,
          criador: req.body.username,
          data_criacao: data,
          tamanho: size,
          ficheiros: req.body.col
        }
        console.log(bag)
        BagIt.inserir(bag)
        console.log("inserido")
    }
    else if (req.query.apikey){
      let path = __dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/bagit-' + Date.now()
      let today = new Date()
      let data = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0') + " " + String(today.getHours()+1).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0')      
      let pathSplit = path.split('/')
      let nome = pathSplit[pathSplit.length-1]
      var zip = new AdmZip()
       
      for(const c of req.body.col) {
        if(verify.check(c)){
          if(c == 'pgdLC'){
            await axios.get('http://clav-api.di.uminho.pt/v2/pgd/lc?apikey=' + req.query.apikey)
              .then(async dados =>{
                await pgd.setUp("pgdLC", req.body, dados, req.query.apikey, true, path)
                general.checkLast("pgdLC", req.body, res, nome)
              })
              .catch(e => {
                res.send(e.message)
              })
          }
          else if (c == 'radaOLD') {
            await axios.get('http://clav-api.di.uminho.pt/v2/rada/old?apikey=' + req.query.apikey)
              .then(async dados =>{
                await rada.setUp("radaOLD", req.body, dados, req.query.apikey, true, path)
                general.checkLast("radaOLD", req.body, res, nome)
              })
              .catch(e => {
                res.send(e.message)
              })
          }
          else if (c == "classes"){
            await axios.get('http://clav-api.di.uminho.pt/v2/classes?info=completa&estrutura=lista&apikey=' + req.query.apikey)
              .then(async dados => {
                await classes.setUp(c, req.body, dados, path)
                general.checkLast(c, req.body, res, nome)
              })
              .catch(e => {
                res.send(e.message)
              })
          }          
          else{
            await axios.get('http://clav-api.di.uminho.pt/v2/' + c + '?apikey=' + req.query.apikey)
              .then(async dados => {
                if(c == "vocabularios"){
                  await vocabularios.setUp(c, req.body, dados, req.query.apikey, true, path)
                  general.checkLast(c, req.body, res, nome)
                }
                else if(c == "documentacaoApoio"){
                  await docApoio.setUp(c, req.body, dados, req.query.apikey, true, path)
                  general.checkLast(c, req.body, res, nome)
                }
                else if (c == "pgd"){
                  await pgd.setUp(c, req.body, dados, req.query.apikey, true, path)
                  general.checkLast(c, req.body, res, nome)
                }
                else{
                  await general.setUp(c, req.body, dados, path)
                  general.checkLast(c, req.body, res, nome)
                }
              })
              .catch(e => {
                res.send(e.message)
              })
          }    
        }
        else{
          await general.errorSetup(c, req.body, path)
          general.checkLast(c, req.body, res, nome)
        }  
      }
      let size = ops.writeSize(path + '/data', path)

      zip.addLocalFolder(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/' + nome)
      zip.writeZip(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/' + nome + '.zip')

      var bag = {
        nome: nome,
        criador:  "apikey",
        data_criacao: data,
        tamanho: size,
        ficheiros: req.body.col
      }
      console.log(bag)
      BagIt.inserir(bag)
      console.log("inserido")
    }
    else if(req.body.username && req.body.password){
      await axios({
        method: 'post',
        url: "http://clav-api.di.uminho.pt/v2/users/login",
        headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
        data: {
          username: req.body.username,
          password: req.body.password
        }
      })
      .then(async user => {
        let path = __dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/bagit-' + Date.now()
        let today = new Date()
        let data = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0') + " " + String(today.getHours()+1).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0')
        let pathSplit = path.split('/')
        let nome = pathSplit[pathSplit.length-1]
        var zip = new AdmZip()
  
        for(const c of req.body.col) {
          if(verify.check(c)){
            if(c == 'pgdLC'){
              await axios.get('http://clav-api.di.uminho.pt/v2/pgd/lc?token=' + user.data.token)
                .then(async dados =>{
                  await pgd.setUp("pgdLC", req.body, dados, user.data.token, false, path)
                  general.checkLast("pgdLC", req.body, res, nome)
                })
                .catch(e => {
                  res.send(e.message)
                })
              }
              else if (c == 'radaOLD') {
                await axios.get('http://clav-api.di.uminho.pt/v2/rada/old?token=' + user.data.token)
                  .then(async dados =>{
                    await rada.setUp("radaOLD", req.body, dados, user.data.token, false, path)
                    general.checkLast("radaOLD", req.body, res, nome)
                  })
                  .catch(e => {
                    res.send(e.message)
                  })
              }
              else if (c == "classes"){
                await axios.get('http://clav-api.di.uminho.pt/v2/classes?info=completa&estrutura=lista&token=' + user.data.token)
                  .then(async dados => {
                    await classes.setUp(c, req.body, dados, path)
                    general.checkLast(c, req.body, res, nome)
                  })
                  .catch(e => {
                    res.send(e.message)
                  })
              }
              else{
                await axios.get('http://clav-api.di.uminho.pt/v2/' + c + '?token=' + user.data.token)
                  .then(async dados => {
                    if(c == "vocabularios"){
                      await vocabularios.setUp(c, req.body, dados, user.data.token, false, path)
                      general.checkLast(c, req.body, res, nome)
                    }
                    else if(c == "documentacaoApoio"){
                      await docApoio.setUp(c, req.body, dados, user.data.token, false, path)
                      general.checkLast(c, req.body, res, nome)
                    }
                    else if (c == "pgd"){
                      await pgd.setUp(c, req.body, dados, user.data.token, false, path)
                      general.checkLast(c, req.body, res, nome)
                    }
                    else{
                      await general.setUp(c, req.body, dados, path)
                      general.checkLast(c, req.body, res, nome)
                    }
                  })
                  .catch(e => {
                    console.log(e.message)
                    res.send(e.message)
                  })
              }  
            }
            else{
              await general.errorSetup(c, req.body, path)
              general.checkLast(c, req.body, res, nome)
            }  
          }
          let size = ops.writeSize(path + '/data', path)
  
          zip.addLocalFolder(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/' + nome)
          zip.writeZip(__dirname.split('routes')[0].replace(/\\/g, "/") + 'public/fileStore/' + nome + '.zip')
  
          var bag = {
            nome: nome,
            criador: req.body.username,
            data_criacao: data,
            tamanho: size,
            ficheiros: req.body.col
          }
          console.log(bag)
          BagIt.inserir(bag)
          console.log("inserido")        
      })
    }
    else{
      res.status(401).send("Unauthorized")
    }
})

module.exports = router;
