class PlanejamentoEvento {

    constructor(evento, data) {
        this.eventoId = evento.id
        this.tipo = evento.tipo
        this.recorrente = evento.recorrente
        this.nome = evento.nome
        this.data = data
        this.valor = evento.valor
        this.realizado = evento.realizado
    }
    
}
 
module.exports = PlanejamentoEvento;