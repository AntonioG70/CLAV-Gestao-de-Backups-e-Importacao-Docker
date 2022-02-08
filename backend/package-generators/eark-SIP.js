var fs = require('fs')
var uuid = require('uuid')
var crypto = require('crypto')
var schemas = require('./genSchemas')
const MongoClient = require('mongodb').MongoClient;
const dbName = 'm51-clav';
const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology:true });


function getFileSize(f) {
  try {
    const stats = fs.statSync(f);
    return stats.size
  } catch (err) {
      console.log(err);
  }
}

function getFileCreateDate(f) {
  try {
    const stats = fs.statSync(f);
    stats.birthtime.toLocaleTimeString()
    return stats.birthtime.toString()
  } catch (err) {
      console.log(err);
  }
}  

function getJsonDoc (col, path) {
  let file = path + '/data/' + col + '.json'
    client.connect(function(err) {
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        getDocuments(db, col, function(docs) {
          console.log('Closing connection.');
          client.close();
          try {
            fs.writeFileSync(file, JSON.stringify(docs, null, 2));
            console.log('Done writing to file.');
            return col
          }
          catch(err) {
            console.log('Error writing to file', err)
          }
      }); 
    })
    console.log("done")
}
  
const getDocuments = function(db, col, callback) {
  const query = { }; 
  db.collection(col)
    .find(query)
    .toArray(function(err, result) { 
        if (err) throw err; 
        callback(result); 
    });
};


function calcCheckSum(file){
  var algo = 'sha256';

  const fileBuffer = fs.readFileSync(file);
  const hashSum = crypto.createHash(algo);
  hashSum.update(fileBuffer);

  return hashSum.digest('hex');

}

async function writeMetsRepre(path, repr, col){
  let date = new Date().toISOString().substr(0,19)

  let root = `<mets xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.loc.gov/METS/" xmlns:xlink="http://www.w3.org/1999/xlink" OBJID="rep` + repr + `" LABEL="" TYPE="representation:MIXED" PROFILE="" xsi:schemaLocation="http://www.loc.gov/METS/ ../../schemas/IP.xsd http://www.w3.org/1999/xlink ../../schemas/xlink.xsd">`

  let hdr = `<metsHdr CREATEDATE="` + date +`" LASTMODDATE=""` + date +`"" RECORDSTATUS="NEW"/>
  <amdSec ID="uuid-` + uuid.v4() + `"/>`

  let fileSec = `<fileSec ID="uuid-` + uuid.v4() + `">
  <fileGrp ID="uuid-` + uuid.v4() + `" USE="Common Specification files representation rep` + repr +`">
  <fileGrp ID="uuid-` + uuid.v4() + `" USE="representations"/>
  <fileGrp ID="uuid-` + uuid.v4() + `" USE="data">`

  fs.appendFileSync(path + "/representations/rep" + repr + '/METS.xml', root + hdr + fileSec, function (err) {
    if (err) throw err;
  });

  let filePath = path + "/representations/rep" + repr + "/data/" + col + '.json'

  let idFile = uuid.v4()

  let file = `<file ID="uuid-` + idFile + `" MIMETYPE="application/json" SIZE="` + getFileSize(filePath) +`" CREATED="` + date +`" CHECKSUM="` + calcCheckSum(filePath) + `" CHECKSUMTYPE="SHA-256">
  <FLocat LOCTYPE="URL" xlink:type="simple" xlink:href="data%2F` + col + `.json"/>
  </file>`

  fs.appendFileSync(path + "/representations/rep" + repr + '/METS.xml', file, function (err) {
    if (err) throw err;
  });

  let endFileTags = `</fileGrp>
    </fileGrp>
  </fileSec>`

  fs.appendFileSync(path + "/representations/rep" + repr + '/METS.xml', endFileTags, function (err) {
    if (err) throw err;
  });

  let struct = `<structMap ID="uuid-` + uuid.v4() + `" TYPE="physical" LABEL="Common Specification structural map">
  <div ID="uuid-` + uuid.v4() + `" TYPE="ORIGINAL" LABEL="rep` + repr +`">
      <div ID="uuid-` + uuid.v4() + `" LABEL="representations"/>
      <div ID="uuid-` + uuid.v4() + `" LABEL="data">`

  fs.appendFileSync(path + "/representations/rep" + repr + '/METS.xml', struct, function (err) {
    if (err) throw err;
  });
  

  let fileid = `<fptr FILEID="uuid-` + idFile + `"/>`

  fs.appendFileSync(path + "/representations/rep" + repr + '/METS.xml', fileid, function (err) {
    if (err) throw err;
  });


  let endStructTags = `</div>
    </div>
  </structMap>
</mets>`

  fs.appendFileSync(path + "/representations/rep" + repr + '/METS.xml', endStructTags, function (err) {
    if (err) throw err;
  });
}


async function writeMets(path, repr, col){
  let date = new Date().toISOString().substr(0,19)

  let hdr = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <mets xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.loc.gov/METS/" xmlns:xlink="http://www.w3.org/1999/xlink" OBJID="uuid-` + uuid.v4() + `" LABEL="" TYPE="SIP:MIXED" PROFILE="http://www.eark-project.com/METS/IP.xml" xsi:schemaLocation="http://www.loc.gov/METS/ schemas/IP.xsd http://www.w3.org/1999/xlink schemas/xlink.xsd">
      <metsHdr CREATEDATE="` + date + `" LASTMODDATE="` + date + `" RECORDSTATUS="NEW">
          <agent ROLE="CREATOR" TYPE="OTHER" OTHERTYPE="SOFTWARE">
              <name>CLAV</name>
              <note></note>
          </agent>
      </metsHdr>
      <dmdSec ID="uuid-` + uuid.v4() + `"/>
      <amdSec ID="uuid-` + uuid.v4() + `"/>`

  let idxlink = "uuid-" + uuid.v4()
  let idmets = "uuid-" + uuid.v4()

  let fileSec = `<fileSec ID="uuid-` + uuid.v4() + `">
  <fileGrp ID="uuid-` + uuid.v4() + `" USE="Common Specification files root">
      <fileGrp ID="uuid-` + uuid.v4() + `" USE="representations"/>
      <fileGrp ID="uuid-` + uuid.v4() + `" USE="schemas">
          <file ID="` + idmets +`" MIMETYPE="application/octet-stream" SIZE="` + getFileSize(path + '/schemas/mets.xsd') + `" CREATED="` + date + `" CHECKSUM="` + calcCheckSum(path + '/schemas/mets.xsd') + `" CHECKSUMTYPE="SHA-256">
              <FLocat LOCTYPE="URL" xlink:type="simple" xlink:href="schemas%2Fmets.xsd"/>
          </file>
          <file ID="` + idxlink + `" MIMETYPE="application/octet-stream" SIZE="` + getFileSize(path + '/schemas/xlink.xsd') + `" CREATED="` + date + `" CHECKSUM="` + calcCheckSum(path + '/schemas/xlink.xsd') + `" CHECKSUMTYPE="SHA-256">
              <FLocat LOCTYPE="URL" xlink:type="simple" xlink:href="schemas%2Fxlink.xsd"/>
          </file>
      </fileGrp>
  </fileGrp>
</fileSec>`

  let structMap = `<structMap ID="uuid-` + uuid.v4() + `" TYPE="physical" LABEL="Common Specification structural map">
  <div ID="uuid-` + uuid.v4() + `" LABEL="uuid-` + uuid.v4() + `">
      <div ID="uuid-` + uuid.v4() + `" LABEL="representations">
          <div ID="uuid-` + uuid.v4() + `" LABEL="rep` + repr + `">
              <mptr xlink:type="simple" xlink:href="representations%2Frep1%2FMETS.xml" LOCTYPE="URL"/>
          </div>
      </div>
      <div ID="uuid-DE36781B-CC4C-4DF6-ABB5-CE410B1279DC" LABEL="schemas">
          <fptr FILEID="` + idmets +`"/>
          <fptr FILEID="` + idxlink + `"/>
      </div>
  </div>
</structMap>
</mets>`

  fs.appendFileSync(path + '/METS.xml', hdr + fileSec + structMap, function (err) {
    if (err) throw err;
  });
}


function buildEarkSIP(col, path, repr){
    if(fs.existsSync(path)){
      if(!fs.existsSync(path + "/representations/rep" + repr)){
        fs.mkdirSync(path + "/representations/rep" + repr)
        fs.mkdirSync(path + "/representations/rep" + repr + "/data")
      }
      getJsonDoc(col, path + "/representations/rep" + repr)
      setTimeout(function() {
        let filePath = path + "/representations/rep" + repr + "/data/" + col + '.json'
        
        let file = `<mets:file ID="docx-file" MIMETYPE="application/vnd.openxmlformats-officedocument.wordprocessingml.document" SIZE="` + getFileSize(filePath) +`" CREATED="` + getFileCreateDate(filePath) + `" CHECKSUM="` + calcCheckSum(filePath) + `" CHECKSUMTYPE="SHA-256" sip:FILEFORMATNAME="Microsoft Word for Windows" sip:FILEFORMATVERSION="2007 onwards" sip:FORMATREGISTRY="PRONOM" sip:FORMATREGISTRYKEY="fmt/412">
        <mets:FLocat LOCTYPE="URL" xlink:type="simple" xlink:href="documentation/File.docx">
        </mets:FLocat>
        </mets:file>
        </mets:mets>`

      fs.appendFile(path + '/METS.xml', file, function (err) {
        if (err) throw err;
      });}, 90)
    }
    else{
      fs.mkdirSync(path)
      //fs.mkdirSync(path + "/metadata")
      //fs.mkdirSync(path + "/metadata/descriptive")
      //fs.mkdirSync(path + "/metadata/preservation")
      fs.mkdirSync(path + "/schemas")
      //fs.mkdirSync(path + "/documentation")
      fs.mkdirSync(path + "/representations")
      fs.mkdirSync(path + "/representations/rep" + repr)
      fs.mkdirSync(path + "/representations/rep" + repr + "/data")
      schemas.genMetsXSD(path)
      schemas.genXlinkXSD(path)
      getJsonDoc(col, path + "/representations/rep" + repr)
      setTimeout(function() { writeMetsRepre(path, repr, col) }, 90)
      writeMets(path, repr, col)
      
    }
      
}

buildEarkSIP("noticias", "D:/eark", 1)