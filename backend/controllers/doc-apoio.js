const axios= require('axios');
var fs = require('fs')
var bagIt = require('../package-generators/bagIt')
var ops = require('../controllers/ops');
const { Console } = require('console');

async function setUp(c, body, dados, token, flag, path){
  console.log(c)
  let num = 0
  let idClasse = ""
  let idEntrada = ""
  let idElemento = ""
  let lista = []

  if(fs.existsSync(path)){
    fs.mkdirSync(path + "/data/" + c)
  }
  else{
    await bagIt.buildBag(path, c)
  }

  let filepath = path + '/data/' + c + '/' + c + '.json'
  fs.writeFileSync(filepath, JSON.stringify(dados.data, null, 2))
  fs.mkdirSync(path + "/data/documentacaoApoio/ficheiros")

  let csum = ops.calcCheckSum(filepath)
  fs.appendFileSync(path + '/manifest-sha256.txt', csum + ' data/' + c + '/' + c + '.json' + '\n')

  dados.data.forEach(async o =>{
    num++
    idClasse = o._id
    o.entradas.forEach(async e => {
      idEntrada = e._id
      e.elementos.forEach(async el => {
        idElemento = el._id
        if(el.texto){
          let link = el.texto.match('\((h.*pdf)\)')
        
          if(link){
            lista.push(link[0])
          }
          
        }
        if(el.ficheiro && !flag){
          let s = el.ficheiro.path.split("/")
          let name = s[s.length-1]
          const fich = await axios({
            method: 'GET',
            url: 'http://clav-api.di.uminho.pt/v2/documentacaoApoio/' + idClasse + '/entradas/' + idEntrada + '/elementos/' + idElemento + '/ficheiro?token=' + token,
            responseType: 'arraybuffer',
            responseEncoding: null
          });
          fs.appendFileSync(path + "/data/documentacaoApoio/ficheiros/" + decodeURI(name), fich.data)
          let sum = ops.calcCheckSum(path + "/data/documentacaoApoio/ficheiros/" + decodeURI(name))
          fs.appendFileSync(path + "/manifest-sha256.txt", sum + " data/documentacaoApoio/ficheiros/" + decodeURI(name) + '\n')                                                
        }
        else if(el.ficheiro && flag){
          let s = el.ficheiro.path.split("/")
          let name = s[s.length-1]
          const fich = await axios({
            method: 'GET',
            url: 'http://clav-api.di.uminho.pt/v2/documentacaoApoio/' + idClasse + '/entradas/' + idEntrada + '/elementos/' + idElemento + '/ficheiro?apikey=' + token,
            responseType: 'arraybuffer',
            responseEncoding: null
          });
          fs.appendFileSync(path + "/data/documentacaoApoio/ficheiros/" + decodeURI(name), fich.data)
          let sum = ops.calcCheckSum(path + "/data/documentacaoApoio/ficheiros/" + decodeURI(name))
          fs.appendFileSync(path + "/manifest-sha256.txt", sum + " data/documentacaoApoio/ficheiros/" + decodeURI(name) + '\n') 
        }
      })
    })
  })
  for(const f of lista){
    await ops.download(f, path)
  }
  
  if(body.col[0] == c){
    let htmlBegin = `<!DOCTYPE html>
    <html>
    <body>
    <h1 style="color:#2d364e; text-align: center;">Informações</h1>`
    fs.appendFileSync(path + '/stats.html', htmlBegin)
  }
  fs.appendFileSync(path + '/stats.html', "<p style ='text-align: center;'>" + num + " " + c + "</p>")
  if(body.col[body.col.length - 1] == c){
    let htmlEnd = `</body>
    </html>`
    fs.appendFileSync(path + '/stats.html', htmlEnd)
  }

}

module.exports.setUp = setUp
