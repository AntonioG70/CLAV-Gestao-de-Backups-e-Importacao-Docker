const axios= require('axios');
var fs = require('fs')
var bagIt = require('../package-generators/bagIt');
var ops = require('../controllers/ops')

async function writeFile(c, dados, token, flag, path){
  let num = 0

  if(flag){
    for(const pgd of dados.data){
      num++
      let pgdID = pgd.idPGD
      await axios.get('http://clav-api.di.uminho.pt/v2/pgd/' + pgdID + '?apikey=' + token)
        .then(async p => {
          let data = JSON.stringify(p.data, null, 2)
          console.log("written")
          fs.appendFileSync(path + '/data/' + c + '/' + pgdID + '.json', data)
          let sum = ops.calcCheckSum(path + '/data/' + c + '/' + pgdID + '.json')
          fs.appendFileSync(path + "/manifest-sha256.txt", sum + " data/pgd/" + pgdID + '.json\n')
        })
        .catch(err => console.log(err))
    }
    return num
  }
  else{
    for(const pgd of dados.data){
      num++
      let pgdID = pgd.idPGD
      await axios.get('http://clav-api.di.uminho.pt/v2/pgd/' + pgdID + '?token=' + token)
        .then(async p => {
          let data = JSON.stringify(p.data, null, 2)
          console.log("written")
          fs.appendFileSync(path + '/data/' + c + '/' + pgdID + '.json', data)
          let sum = ops.calcCheckSum(path + '/data/' + c + '/' + pgdID + '.json')
          fs.appendFileSync(path + "/manifest-sha256.txt", sum + " data/pgd/" + pgdID + '.json\n')
        })
        .catch(err => console.log(err))
    }
    return num
  }
  
}

async function setUp(c, body, dados, token, flag, path){
  let num = 0

  if(fs.existsSync(path)){
    fs.mkdirSync(path + "/data/" + c)
  }
  else{
    await bagIt.buildBag(path, c)
  }

  num = await writeFile(c, dados, token, flag, path)
  
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