const ObjectUtil = require("./ObjectUtil")

class Evento {

    constructor(json) {
        this.id = ''
        this.data = null
        this.nome = ''
        this.tipo = ''
        this.recorrente = false
        this.tipoRecorrencia = ''
        this.valor = 0.0
        this.realizado = false
        this.usuarioId = ''

        if (json) {
            ObjectUtil.copy(this, json)
        }
    }

}

module.exports = Evento