var fs = require('fs')
var bagIt = require('../package-generators/bagIt')
var ops = require('../controllers/ops')

function count(obj){
  let c1 = 0
  let c2 = 0
  let c3 = 0
  let c4 = 0

  obj.forEach(c => {
    c1++
    if(c.filhos.length > 0){
      c.filhos.forEach(f1 => {
        c2++
        if(f1.filhos.length > 0){
          f1.filhos.forEach(f2 => {
            c3++
            if(f2.filhos.length > 0){
              f2.filhos.forEach(f3 => {
                c4++
              })
            }
          })
        }
      })
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






