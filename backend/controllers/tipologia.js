const axios = require('axios');
var fs = require('fs')
var jsonSchemas = require('../models/jsonSchemas');
var Validator = require('jsonschema').Validator;
var v = new Validator();

var converter = require('../controllers/converter')

async function total(obj, token){
  for(const element of obj) {
    let query = converter.tipologiaToTtl([element])

    await axios({
      method: 'post',
      url: "http://clav-api.di.uminho.pt/v2/tipologias/repor?token=" + token,
      headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
      data: {
        query: query
      }
    })
    .then(() => {
      console.log("triplo " + element.id + " inserido")
    })
    .catch(e => console.log("ERRO na inserção dos triplos: " + element.id))
  }
}

module.exports.total = total

async function add(obj, token){
  for(const element of obj){
    await axios.get('http://clav-api.di.uminho.pt/v2/tipologias/' + element.id + '?token=' + token)
      .then(dados => {
        console.log(element.id + " existe")
      })
      .catch( async e => {
        console.log("Tipologia nao existe: " + element.id)
        let query = converter.tipologiaToTtl([element])
        await axios({
          method: 'post',
          url: "http://clav-api.di.uminho.pt/v2/tipologias/repor?token=" + token,
          headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
          data: {
            query: query
          }
        })
        .then(() => {
          console.log("triplo " + element.id + " inserido")
        })
        .catch(e => console.log("ERRO na inserção dos triplos: " + element.id))     
    })
  }
}

module.exports.add = add

async function overwrite(obj, token){
  await axios.get('http://clav-api.di.uminho.pt/v2/tipologias?token=' + token)
  .then(async dados => {
    for(const t of dados.data){
      await axios.delete('http://clav-api.di.uminho.pt/v2/tipologias/' + t.id  + '?token=' + token)
        .then(() => {
          console.log(t.id + ' eliminada')
        })
        .catch(err => {
          console.log(err.message)
        })
    }
    await total(obj, token)

  })
  .catch(e => {
    console.log(e.message)
  })  
}

module.exports.overwrite = overwrite