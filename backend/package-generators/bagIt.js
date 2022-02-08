var BagIt = require('bagit-fs')
var fs = require('fs')
var ops = require('../controllers/ops')
var pretty = require('prettier-bytes')


async function buildBag (path, dir) {
  dir = dir || "/";
  let info = {'Contact-Name': 'CLAV', 'Organization-Address': 'Universidade do Minho'}

  fs.mkdirSync(path)
  fs.mkdirSync(path + '/data')

  if(dir != '/'){
    fs.mkdirSync(path + "/data/" + dir)
  }
  
  for(var i in info){
    let key = i
    let val = info[i]
    fs.appendFileSync(path + '/bag-info.txt', key + ": " + val + '\n')
  }
  
  let date = new Date()
  date = date.toISOString().split("T")[0]
  fs.appendFileSync(path + '/bag-info.txt', 'Bagging-Date: ' + date + '\n')
  fs.appendFileSync(path + '/bagit.txt', `BagIt-Version: 0.97
Tag-File-Character-Encoding: UTF-8`)
}

module.exports.buildBag = buildBag

function addCheckSum(file, path, dir){
  let sum = ops.calcCheckSum(file)
  file = file.split("/")
  file = file[file.length-1]
  fs.appendFileSync(path + '/manifest-sha256.txt', sum + " data/" + dir + "/" + file)
}

module.exports.addCheckSum = addCheckSum

function writeSize(path){
  let size = ops.getSize(path)
  fs.appendFileSync(path + '/bag-info.txt', 'Bag-Size: ' + pretty(size) + '\n')
}

module.exports.writeSize = writeSize

async function finalizeBag(path){
  var bag = BagIt(path, 'sha256', {'Contact-Name': 'CLAV', 'Organization-Address': 'Universidade do Minho'})
  bag.finalize(function (cb, entries) {
    console.log("updated")
  })
}

module.exports.finalizeBag = finalizeBag

function buildEmptyBag (path, dir) {
  dir = dir || "/";
  var bag = BagIt(path, 'sha256', {'Contact-Name': 'CLAV', 'Organization-Address': 'Universidade do Minho'})
  bag.mkdir(dir , function (cb, entries) {
    console.log("Dir created")
  })
  bag.finalize(function (cb, entries) {
    console.log("Bag created")
  })
}

module.exports.buildEmptyBag = buildEmptyBag