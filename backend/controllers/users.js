const axios = require('axios');
var fs = require('fs')
var jsonSchemas = require('../models/jsonSchemas');
var Validator = require('jsonschema').Validator;
var v = new Validator();

async function total(obj, token){
  for(const element of obj){
    let res = v.validate(element, jsonSchemas.usersSchema)
    if(!res.valid || !element.local){
      console.log(element)
    }
    else{
      await axios({
        method: 'post',
        url: "http://clav-api.di.uminho.pt/v2/users/registar?token=" + token,
        headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
        data: {
          name: element.name,
          email: element.email,
          entidade: element.entidade,
          internal: element.internal,
          type: element.level,
          password: element.local.password                     
        }
      })
      .then(() => {
        console.log(element.name + " inserido")
      })
      .catch(e => console.log(e))
    }
  }
}

module.exports.total = total

async function add(obj, token){
  for(const element of obj){
    console.log(element.name)
    let res = v.validate(element, jsonSchemas.usersSchema)
    if(!res.valid || !element.local){
      console.log(element)
    }
    else{
      console.log(element.name + " e valido")
      /*
      await axios.get('http://clav-api.di.uminho.pt/v2/users/' + element._id + '?token=' + token)
        .then(dados => {
          console.log(dados.data)
          console.log("user " + element._id + " existe")
        })
        .catch(() => {
          console.log("user nao existe")
          
          await axios({
            method: 'post',
            url: "http://clav-api.di.uminho.pt/v2/users/registar?token=" + token,
            headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
            data: {
              //ADICIONAR SO O OBJETO E VER SE DA (element)
              name: element.name,
              email: element.email,
              entidade: element.entidade,
              internal: element.internal,
              type: element.level,
              password: element.local.password                     
            }
          })
          .then(() => {
            console.log(element.name + " inserido")
          })
          .catch(e => console.log(e))
        })*/
    }
  }
}

module.exports.add = add

async function overwrite(obj, token){
  await axios.get('http://clav-api.di.uminho.pt/v2/users?token=' + token)
  .then(async dados => {
    for(const u of dados.data){
      await axios.delete('http://clav-api.di.uminho.pt/v2/users/' + u._id  + '?token=' + token)
        .then(async () => {
          console.log(u.name + ' eliminado')
        })
        .catch(e => {
          console.log(e.message)
        })
    }
    await total(obj, token)
  })
  .catch(e => {
    console.log(e.message)
  })
}

module.exports.overwrite = overwrite