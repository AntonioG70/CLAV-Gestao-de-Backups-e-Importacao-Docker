var axios = require('axios')

function entidadesToTtl(obj){
  var query = ``
  obj.forEach(element => {
    let res = `
    clav:`+ element.id +` rdf:type owl:NamedIndividual, clav:Entidade ;
        clav:entDesignacao "`+ element.designacao +`";
        clav:entEstado "`+ element.estado +`";
        clav:entInternacional "`+ element.internacional +`";
        clav:entSigla "`+ element.sigla +`";`

    if(element.sioe){
      res = res + `\n    clav:entSIOE "`+ element.sioe +`";`;
    }
    
    if(element.dataCriacao){
      res = res + `\n    clav:entDataCriacao "`+ element.dataCriacao +`";`;
    }

    if(element.dataExtincao){
      res = res + `\n    clav:entDataExtincao "`+ element.dataExtincao +`";`;
    }
     
    element.tipologiasSel.forEach(e => {
      if(element.tipologiasSel[element.tipologiasSel.length - 1] == e && element.tipologiasSel[0] == e){
        res = res + '\n    clav:pertenceTipologiaEnt clav:' + e.id +';'   
      }
      else if(element.tipologiasSel[element.tipologiasSel.length - 1] == e){
        res = res + '\n       clav:' + e.id +';'    
      }
      else if(element.tipologiasSel[0] == e){
        res = res + '\n    clav:pertenceTipologiaEnt clav:' + e.id +','
      }
      else {
        res = res + '\n       clav:' + e.id +','
      }     
    })
    query = query + '\n' + res + '.'    
  })

  return query
}

module.exports.entidadesToTtl = entidadesToTtl

function legislacaoToTtl(obj){
  var query = ``
  obj.forEach(element => {
    let res = `
    clav:`+ element.id +` rdf:type owl:NamedIndividual, clav:Legislacao ;
        clav:diplomaData "`+ element.data +`";
        clav:diplomaEstado "`+ element.estado +`";
        clav:diplomaLink "`+ element.link +`";
        clav:diplomaNumero "`+ element.numero +`";
        clav:diplomaTipo "`+ element.tipo +`";
        clav:diplomaSumario '`+ element.sumario +`';`

    if(element.entidades){
      res = res + `clav:rdfs:label "`+ "Leg.: " + element.tipo
      element.entidades.forEach(ent => {
        res = res + " " + ent.sigla
      })
      res = res + " " + element.numero +`";`
    }
    else {
      res = res + `clav:rdfs:label "`+ "Leg.: " + element.tipo + " " + element.numero +`";`
    }  
        
    if(element.entidades.length > 0){
      element.entidades.forEach(ent => {
        if(element.entidades[element.entidades.length - 1] == ent && element.entidades[0] == ent){
          res = res + '\n    clav:temEntidadeResponsavel clav:' + ent.id +';'
        }
        else if(element.entidades[0] == ent){
          res = res + '\n    clav:temEntidadeResponsavel clav:' + ent.id +','   
        }
        else if (element.entidades[element.entidades.length - 1] == ent){
          res = res + '\n       clav:' + ent.id +';'
        }
        else {
          res = res + '\n       clav:' + ent.id +','
        }
      })
    }
    query = query + '\n' + res + '.'    
  })

  return query
}

module.exports.legislacaoToTtl = legislacaoToTtl

function tipologiaToTtl(obj){
  var query = ``
  obj.forEach(element => {
    let res = `
    clav:`+ element.id +` rdf:type owl:NamedIndividual, clav:TipologiaEntidade ;
        clav:tipDesignacao "`+ element.designacao +`";
        clav:tipEstado "`+ element.estado +`";
        clav:tipSigla "`+ element.sigla +`";`
        
    query = query + '\n' + res + '.'    
  })

  return query
}

module.exports.tipologiaToTtl = tipologiaToTtl

function classeToTtl(obj){
  var query = ``
  obj.forEach(c => {
    if(c.nivel == 1){
      var res = `clav:`+ c.id.split('#')[1] +` rdf:type owl:NamedIndividual, clav:Classe_N1 ;
        clav:codigo "`+ c.codigo +`";
        clav:classeStatus "`+ c.status +`";
        clav:pertenceLC clav:lc1;
        clav:temPai clav:lc1;
        clav:descricao '` + c.descricao + `';
        clav:titulo "` + c.titulo + `";`

      if(c.notasAp.length > 0){
        c.notasAp.forEach(ap => {
          res = res + '\n' + `clav:temNotaAplicacao clav:` + ap.idNota.split("#")[1] + ";"
        })
      }
      
      if(c.notasEx.length > 0){
        c.notasEx.forEach(ex => {
          res = res + '\n' + `clav:temNotaExclusao clav:` + ex.idNota.split("#")[1] + ";"
        })
      }

      query = query + '\n' + res + '.'
    }
    else if(c.nivel == 2){
      var res = `clav:`+ c.id.split('#')[1] +` rdf:type owl:NamedIndividual, clav:Classe_N2 ;
      clav:codigo "`+ c.codigo +`";
      clav:classeStatus "`+ c.status +`";
      clav:pertenceLC clav:lc1;
      clav:temPai clav:c` + c.pai.codigo + `;
      clav:descricao '` + c.descricao + `';
      clav:titulo "` + c.titulo + `";`

    if(c.notasAp.length > 0){
      c.notasAp.forEach(ap => {
        res = res + '\n' + `clav:temNotaAplicacao clav:` + ap.idNota.split("#")[1] + ";"
      })
    }
    
    if(c.notasEx.length > 0){
      c.notasEx.forEach(ex => {
        res = res + '\n' + `clav:temNotaExclusao clav:` + ex.idNota.split("#")[1] + ";"
      })
    }

    query = query + '\n' + res + '.'
    }

    else if(c.nivel == 3){
      var res = `clav:`+ c.id.split('#')[1] +` rdf:type owl:NamedIndividual, clav:Classe_N3 ;
      clav:codigo "`+ c.codigo +`";
      clav:classeStatus "`+ c.status +`";
      clav:pertenceLC clav:lc1;
      clav:temPai clav:c` + c.pai.codigo + `;
      clav:descricao '` + c.descricao + `';
      clav:titulo "` + c.titulo + `";
      clav:processoTipoVC clav:` + c.pt.split("#")[1] + `;
      clav:processoTransversal "` + c.procTrans + `";
      `

    if(c.notasAp.length > 0){
      c.notasAp.forEach(ap => {
        res = res + '\n' + `clav:temNotaAplicacao clav:` + ap.idNota.split("#")[1] + ";"
      })
    }

    if(c.notasEx.length > 0){
      c.notasEx.forEach(ex => {
        res = res + '\n' + `clav:temNotaExclusao clav:` + ex.idNota.split("#")[1] + ";"
      })
    }

    if(c.processosRelacionados.length > 0){
      c.processosRelacionados.forEach(pr => {
        if(pr.tipoRel == "eAntecessorDe"){
          res = res + '\n' + `clav:eAntecessorDe clav:c` + pr.codigo + ";"
        }
        else if(pr.tipoRel == "eComplementarDe"){
          res = res + '\n' + `clav:eComplementarDe clav:c` + pr.codigo + ";"
        }
        else if(pr.tipoRel == "eCruzadoCom"){
          res = res + '\n' + `clav:eCruzadoCom clav:c` + pr.codigo + ";"
        }
        else if(pr.tipoRel == "eSucessorDe"){
          res = res + '\n' + `clav:eSucessorDe clav:c` + pr.codigo + ";"
        }
        else if(pr.tipoRel == "eSinteseDe"){
          res = res + '\n' + `clav:eSinteseDe clav:c` + pr.codigo + ";"
        }
        else if(pr.tipoRel == "eSintetizadoPor"){
          res = res + '\n' + `clav:eSintetizadoPor clav:c` + pr.codigo + ";"
        }
      })
    }

    if(c.donos.length > 0){
      c.donos.forEach(d => {
        res = res + '\n' + `clav:temDono clav:` + d.idDono + ";" 
      })
    }

    if(c.exemplosNotasAp.length > 0){
      c.exemplosNotasAp.forEach(d => {
        res = res + '\n' + `clav:temExemploNA clav:` + d.idExemplo.split("#")[1] + ";" 
      })
    }

    if(c.legislacao.length > 0){
      c.legislacao.forEach(d => {
        res = res + '\n' + `clav:temLegislacao clav:` + d.idLeg + ";" 
      })
    }

    if(c.participantes.length > 0){
      c.participantes.forEach(p => {
        if(p.participLabel == "Assessor"){
          res = res + '\n' + `clav:temParticipanteAssessor clav:` + p.idParticipante + ";" 
        }
        else if(p.participLabel == "Decisor"){
          res = res + '\n' + `clav:temParticipanteDecisor clav:` + p.idParticipante + ";" 
        }
        else if(p.participLabel == "Apreciador"){
          res = res + '\n' + `clav:temParticipanteApreciador clav:` + p.idParticipante + ";" 
        }
        else if(p.participLabel == "Comunicador"){
          res = res + '\n' + `clav:temParticipanteComunicador clav:` + p.idParticipante + ";" 
        }
        else if(p.participLabel == "Iniciador"){
          res = res + '\n' + `clav:temParticipanteIniciador clav:` + p.idParticipante + ";" 
        }
        else if(p.participLabel == "Executor"){
          res = res + '\n' + `clav:temParticipanteExecutor clav:` + p.idParticipante + ";" 
        }
      })
    }

    if(c.pca && c.pca.idPCA){
      res = res + '\n' + `clav:temPCA clav:` + c.pca.idPCA.split("#")[1] + ";"
    }

    if(c.df && c.df.idDF){
      res = res + '\n' + `clav:temDF clav:` + c.df.idDF.split("#")[1] + ";"
    }
    query = query + '\n' + res + '.'
    }
    else if(c.nivel == 4){
      var res = `clav:`+ c.id.split('#')[1] +` rdf:type owl:NamedIndividual, clav:Classe_N4 ;
      clav:codigo "`+ c.codigo +`";
      clav:classeStatus "`+ c.status +`";
      clav:pertenceLC clav:lc1;
      clav:temPai clav:c` + c.pai.codigo + `;
      clav:descricao '` + c.descricao + `';
      clav:titulo "` + c.titulo + `";
      `

      if(c.pca){
        if(c.pca.idPCA){
          res = res + '\n' + `clav:temPCA clav:` + c.pca.idPCA.split("#")[1] + ";"
        }
      }
  
      if(c.df){
        if(c.df.idDF){
          res = res + '\n' + `clav:temDF clav:` + c.df.idDF.split("#")[1] + ";"
        }
      }
      query = query + '\n' + res + '.'
    }
  })
  return query
}

module.exports.classeToTtl = classeToTtl
