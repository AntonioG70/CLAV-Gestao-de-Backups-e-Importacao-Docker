var fs = require('fs')
const axios = require('axios');
var bagIt = require('../package-generators/bagIt')
var ops = require('../controllers/ops')
var converter = require('../controllers/converter')

function count(obj){
  let c1 = 0
  let c2 = 0
  let c3 = 0
  let c4 = 0

  obj.forEach(c => {
    if(c.nivel == 1){
      c1++
    }
    else if(c.nivel == 2){
      c2++
    }
    else if(c.nivel == 3){
      c3++
    }
    else if(c.nivel == 4){
      c4++
    }
    
  });
  let res = {"c1": c1, "c2": c2, "c3":c3, "c4": c4}
  return res
}  

module.exports.count = count

async function setUp(c, body, dados, path){
  if(fs.existsSync(path)){
    fs.mkdirSync(path + "/data/" + c)
  }
  else{
    await bagIt.buildBag(path, c)
  }
  
  let filepath = path + '/data/' + c + '/' + c + '.json'
  fs.writeFileSync(filepath, JSON.stringify(dados.data, null, 2))

  let csum = ops.calcCheckSum(filepath)
  fs.appendFileSync(path + '/manifest-sha256.txt', csum + ' data/' + c + '/' + c + '.json' + '\n')
  
  if(body.col[0] == c){
    let htmlBegin = `<!DOCTYPE html>
    <html>
    <body>
    <h1 style="color:#2d364e; text-align: center;">Informações</h1>`
    fs.appendFileSync(path + '/stats.html', htmlBegin)
  }
  let resp = count(dados.data)
  fs.appendFileSync(path + '/stats.html', "<p style ='text-align: center;'>" + resp["c1"] + " classes de nível 1" + "</p>" + "<p style ='text-align: center;'>" +  resp["c2"] + 
  " classes de nível 2" + "</p>" + "<p style ='text-align: center;'>" + resp["c3"] + " classes de nível 3" + "</p>" + "<p style ='text-align: center;'>" + resp["c4"] + " classes de nível 4" + "</p>")
  if(body.col[body.col.length - 1] == c){
    let htmlEnd = `</body>
    </html>`
    fs.appendFileSync(path + '/stats.html', htmlEnd)
  }
}

module.exports.setUp = setUp

async function total(obj, token){
  for(const element of obj) {
    let query = converter.classeToTtl([element])

    await axios({
      method: 'post',
      url: "http://clav-api.di.uminho.pt/v2/classes/repor?token=" + token,
      headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
      data: {
        query: query
      }
    })
    .then(() => {
      console.log("triplo " + element.codigo + " inserido")
    })
    .catch(e => console.log("ERRO na inserção dos triplos: " + element.codigo))
  }
}

module.exports.total = total

async function add(obj, token){
  for(const element of obj){
    var id = "c" + element.codigo
    await axios.get('http://clav-api.di.uminho.pt/v2/classes/' + id + '?token=' + token)
      .then(dados => {
        console.log(id + " existe")
      })
      .catch( async e => {
        console.log("Classe nao existe: " + id)
        let query = converter.classeToTtl([element])
        await axios({
          method: 'post',
          url: "http://clav-api.di.uminho.pt/v2/classes/repor?token=" + token,
          headers: {"User-Agent": "PostmanRuntime/7.26.8"}, 
          data: {
            query: query
          }
        })
        .then(() => {
          console.log("triplo " + id + " inserido")
        })
        .catch(e => console.log("ERRO na inserção dos triplos: " + id))     
    })
  }
}

module.exports.add = add

async function overwrite(obj, token){
  await axios.get('http://clav-api.di.uminho.pt/v2/classes?info=completa&estrutura=lista&token=' + token)
  .then(async dados => {
    for(const t of dados.data){
      var id = "c" + t.codigo
      await axios.delete('http://clav-api.di.uminho.pt/v2/classes/' + id  + '?token=' + token)
        .then(() => {
          console.log(id + ' eliminada')
        })
        .catch(err => {
          console.log(err)
        })
    }
    await total(obj, token)

  })
  .catch(e => {
    console.log(e.message)
  })  
}

module.exports.overwrite = overwrite





