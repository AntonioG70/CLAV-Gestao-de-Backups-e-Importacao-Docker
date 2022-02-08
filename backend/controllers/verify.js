let lista = ["entidades", "tipologias", "legislacao", "noticias", "users", "pendentes", "classes", 
"documentacaoApoio", "pedidos", "invariantes", "termosIndice", "pgd", "pgdLC", "vocabularios", "radaOLD"]

let listaApiKey = ["entidades", "tipologias", "legislacao", "noticias", "classes", "documentacaoApoio", "radaOLD", "vocabularios", "pgd", "pgdLC", "termosIndice"]

function check(name){
  return lista.includes(name)
}

module.exports.check = check

function getLista(){
  return lista
}

module.exports.getLista = getLista

function getListaKey(){
  return listaApiKey
}

module.exports.getListaKey = getListaKey
/*
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzJlNjZkN2MzMGVkNWUzOGM0YWFjYiIsImlhdCI6MTY0MTMyMDc5OCwiZXhwIjoxNjQzOTEyNzk4fQ.XGBrVSkWrRpEYJWYG4u_i8xSePEyd_I5eR1qRJDx4AWtahnxI9duWxYRBNZEgRXxgRdI0CYrTIT0wzNiwd8j9h8tUJxeiSRDVLpXCi05iRbAz_n0hIRhXKfzDKsI3mn57fLa2F6ipqjIK_SXFiIzz0MyjzmRxQlUINjQgTYsck7O5V2p3gi3GdEbdijZqdG8C1K12n539LXwufoSIEH8VIdDNfhknJutK_zLRV1eji6KCe3ggaEXWNxykhcWfRrudjdOFxey8R4tRvvRK9wgLPtz_2Hwgg0kLNCbarTlf3jmG4jW0z9hPBWlBJxHZb4x2jxhTCqAQLGs3zG97fC2bA
*/