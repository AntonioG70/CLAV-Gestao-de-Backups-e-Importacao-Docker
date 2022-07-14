const axios = require('axios');
var fs = require('fs')
var jsonSchemas = require('../models/jsonSchemas');
var Validator = require('jsonschema').Validator;
var v = new Validator();

var converter = require('../controllers/converter')

async function total(obj, token){
  for(const element of obj){
    let res = v.validate(element, jsonSchemas.entidadesSchema)
    if(!res.valid){
      console.log(element)
    }
    else{
      element.tipologiasSel = []
      await axios.get("http://clav-api.di.uminho.pt/v2/entidades/" + element.id +"/tipologias?token=" + token)
        .then(async dados => {
          dados.data.forEach(tip => {
            element.tipologiasSel.push({
              id: tip.id
            })
          })
          if(element.internacional == ""){
            element.internacional = "Não"
          }
          
          let query = converter.entidadesToTtl([element])

          await axios({
            method: 'post',
            url: "http://clav-api.di.uminho.pt/v2/entidades/repor?token=" + token,
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
        .catch(e => console.log(e))
    }
  }
}

module.exports.total = total

async function add(obj, token){
  for(const element of obj){
    let res = v.validate(element, jsonSchemas.entidadesSchema)
    if(!res.valid){
      console.log(element)
    }
    else {
      element.tipologiasSel = []
      let id = 'ent_' + element.sigla
      await axios.get('http://clav-api.di.uminho.pt/v2/entidades/' + id + '?token=' + token)
      .then(dados => {
        console.log(id + " existe")
      })
      .catch( async e => {
        console.log("Entidade nao existe: " + element.id)
        await axios.get("http://clav-api.di.uminho.pt/v2/entidades/" + element.id +"/tipologias?token=" + token)
        .then(async dados => {
          dados.data.forEach(tip => {
            element.tipologiasSel.push({
              id: tip.id
            })
          })

          if(element.internacional == ""){
            element.internacional = "Não"
          }

          let query = converter.entidadesToTtl([element])
          await axios({
            method: 'post',
            url: "http://clav-api.di.uminho.pt/v2/entidades/repor?token=" + token,
            headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
            data: {
              query: query
            }
          })
          .then(() => {
            console.log("triplos inserido " + id)
          })
          .catch(e => console.log("ERRO na inserção dos triplos: " + id))
        })
        .catch(e => console.log(e))
      })
    }
  }
}

module.exports.add = add

async function overwrite(obj, token){
  await axios.get('http://clav-api.di.uminho.pt/v2/entidades?token=' + token)
  .then(async dados => {
    for(const e of dados.data){
      await axios.delete('http://clav-api.di.uminho.pt/v2/entidades/' + e.id  + '?token=' + token)
        .then(async () => {
          console.log(e.id + ' eliminada')
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