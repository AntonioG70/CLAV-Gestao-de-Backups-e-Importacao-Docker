const axios = require('axios');
var fs = require('fs')
var jsonSchemas = require('../models/jsonSchemas');
var Validator = require('jsonschema').Validator;
var v = new Validator();

async function total(obj, token){
  for(const element of obj){
    let res = v.validate(element, jsonSchemas.pedidosSchema)
    if(!res.valid){
      console.log(element)
    }
    else{
      await axios({
        method: 'post',
        url: "http://clav-api.di.uminho.pt/v2/pedidos/repor?token=" + token,
        headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
        data: element
      })
      .then(() => {
        console.log(element.codigo + " inserido")
      })
      .catch(e => console.log(e.config.data))
    }
  }
}

module.exports.total = total

async function add(obj, token){
  for(const element of obj){
    let res = v.validate(element, jsonSchemas.pedidosSchema)
    if(!res.valid){
      console.log(element)
    }
    else {
      await axios.get('http://clav-api.di.uminho.pt/v2/pedidos/' + element.codigo + '?token=' + token)
        .then(dados => {
          console.log(element.codigo + " existe")
        })
        .catch( async e => {
          console.log("Pedido nao existe")
          await axios({
            method: 'post',
            url: "http://clav-api.di.uminho.pt/v2/pedidos/repor?token=" + token,
            headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
            data: element
          })
          .then(() => {
            console.log(element.codigo + " inserido")
          })
          .catch(e => console.log(e))
        })
    }
  }
}

module.exports.add = add

async function overwrite(obj, token){
  await axios.delete('http://clav-api.di.uminho.pt/v2/pedidos?token=' + token)
  .then(async () => {
    console.log('Pedidos eliminados')
    await total(obj, token)
  })
  .catch(e => {
    console.log(e.message)
  }) 
}

module.exports.overwrite = overwrite































