var crypto = require('crypto');
const { DownloaderHelper } = require('node-downloader-helper');
var fs = require('fs')
const path = require("path")

function calcCheckSum(file){
  var algo = 'sha256';
  
  const fileBuffer = fs.readFileSync(file);
  const hashSum = crypto.createHash(algo);
  hashSum.update(fileBuffer);
  
  return hashSum.digest('hex');
}

module.exports.calcCheckSum = calcCheckSum

async function download(fileUrl, path) {
  let split = fileUrl.split("/")
  let f = split[split.length-1]
  const dl = new DownloaderHelper(fileUrl, path + "/data/documentacaoApoio/ficheiros/", {fileName: decodeURI(f)});
  
  dl.on('end', () => console.log('Download Completed'))
  await dl.start();
    
  let sum = calcCheckSum(path + "/data/documentacaoApoio/ficheiros/" + decodeURI(f))
  fs.appendFileSync(path + "/manifest-sha256.txt", sum + " data/documentacaoApoio/ficheiros/" + decodeURI(f) + '\n')
}

module.exports.download = download

const getAllFiles = function(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join("", dirPath, file))
    }
  })

  return arrayOfFiles
}

const convertBytes = function(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  if (bytes == 0) {
    return "n/a"
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

  if (i == 0) {
    return bytes + " " + sizes[i]
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}

const writeSize = function(directoryPath, location) {
  const arrayOfFiles = getAllFiles(directoryPath)

  let totalSize = 0

  arrayOfFiles.forEach(function(filePath) {
    totalSize += fs.statSync(filePath).size
  })
  
  fs.appendFileSync(location + '/bag-info.txt', 'Bag-Size: ' + convertBytes(totalSize) + '\n')
  console.log("size done")
  return convertBytes(totalSize)
}

module.exports.writeSize = writeSize

function IsJsonString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

module.exports.IsJsonString = IsJsonString