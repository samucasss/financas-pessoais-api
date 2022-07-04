const ObjectUtil = require("./ObjectUtil")

class RealizacaoEvento {

    constructor(json) {
        this.eventoId = null
        this.tipo = ''
        this.recorrente = false
        this.nome = ''
        this.data = null
        this.valor = 0.0
        this.realizado = false
        this.usuarioId = ''

        if (json) {
            ObjectUtil.copy(this, json)
        }
    }

}

module.exports = RealizacaoEvento;