var usersSchema = {
  "id": "/users",
  "type": "object",
  "properties": {
    "nCalls": {"type": "integer"},
    "notificacoes": {"type": "array"},
    "_id": {"type": "string"},
    "name": {"type": "string"},
    "email": {"type": "string"},
    "entidade": {"type": "string"},
    "internal": {"type": "boolean"},
    "level": {"type": "number"},
    "__v": {"type": "integer"},
    "cc": {"type": "number"},
    "local": {
      "type": "object",
      "password": {"type": "string"},
      "required": ["password"]
    },
  },
  "required": ["nCalls", "notificacoes", "_id", "name", "email", "entidade", "internal", "level", "__v"]    
}

module.exports.usersSchema = usersSchema

var pedidosSchema = {
  "id": "/pedidos",
  "type": "object",
  "properties": {
    "codigo": {"type": "string"},
    "estado": {"type": "string"},
    "data": {"type": "string"},
    "criadoPor": {"type": "string"},
    "objeto": {
      "type": "object",
      "codigo": {"type": "string"},
      "dados": {"type": "object"},
      "dadosOriginais": {"type": "object"},
      "tipo": {"type": "string"}, //required
      "acao": {"type": "string"}, //required
      "required": ["tipo", "acao"]
    },
    "historico": {"type": "array"},
    "pedidos_dependentes": {"type": "array"},
    "_id": {"type": "string"},
    "__v": {"type": "integer"},
    "distribuicao": {
      "type": "array",
      "itens": {
        "type": "object",
        "estado": {"type": "string"}, //required
        "responsavel": {"type": "string"},
        "proximoResponsavel": {
          "nome": {"type": "string"},
          "entidade": {"type": "string"},
          "email": {"type": "string"}
        },
        "data": {"type": "date"}, //required
        "despacho": {"type": "string"},
        "required": ["data", "estado"]
      }
    },
    "entidade": {"type": "string"}
  },
  "required": ["codigo", "estado", "data", "criadoPor", "entidade", "__v"]    
}

module.exports.pedidosSchema = pedidosSchema

var entidadesSchema = {
  "id" : "/entidades",
  "type": "/object",
  "properties": {
    "estado": {"type": "string"},
    "sigla": {"type": "string"},
    "sioe": {"type": "string"},
    "designacao": {"type": "string"},
    "id": {"type": "string"},
    "internacional": {"type": "string"}
  },
  "required": ["estado", "sigla", "designacao", "id", "internacional"]
}

module.exports.entidadesSchema = entidadesSchema