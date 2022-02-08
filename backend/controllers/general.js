var fs = require('fs')
var bagIt = require('../package-generators/bagIt')
var ops = require('../controllers/ops')

function checkLast(c, body, res, nome){
  if (body.col[body.col.length - 1] == c){
    res.send(nome)
  }
}  

module.exports.checkLast = checkLast

async function setUp(c, body, dados, path){
  console.log(c)

  if(fs.existsSync(path)){
    fs.mkdirSync(path + "/data/" + c)
  }
  else{
    await bagIt.buildBag(path, c)
  }

  let filepath = path + '/data/' + c + '/' + c + '.json'
  fs.writeFileSync(filepath, JSON.stringify(dados.data, null, 2))
  let num = 0
  dados.data.forEach(element => {
    num++
  });
  
  let csum = ops.calcCheckSum(filepath)
  fs.appendFileSync(path + '/manifest-sha256.txt', csum + ' data/' + c + '/' + c + '.json' + '\n')
  
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

async function errorSetup(c, body, path){
  if(body.col[0] == c){
    fs.mkdirSync(path)
    let htmlBegin = `<!DOCTYPE html>
    <html>
    <body>
    <h1 style="color:#2d364e; text-align: center;">Informações</h1>`
    fs.appendFileSync(path + '/stats.html', htmlBegin)
  }
  fs.appendFileSync(path + '/stats.html', "<p style ='text-align: center;'>Erro: " + c + " é inválido.</p>")
  if(body.col[body.col.length - 1] == c){
    let htmlEnd = `</body>
    </html>`
    fs.appendFileSync(path + '/stats.html', htmlEnd)
  }
}

module.exports.errorSetup = errorSetup


   