const moment = require('moment');
const PlanejamentoEvento = require('~/models/PlanejamentoEvento');

class PlanejamentoEventoManager {

    constructor(eventoList, realizacaoEventoList, mes, ano) {
        this.eventoList = eventoList;
        this.realizacaoEventoList = realizacaoEventoList;
        this.mes = mes;
        this.ano = ano;
    }

    build() {
        const eventoList = this.eventoList
        const realizacaoEventoList = this.realizacaoEventoList
        const mes = this.mes
        const ano = this.ano

        const inicio = moment(new Date(ano, mes, 1))
        const fim = inicio.clone().endOf('month')

        // recupera apenas os eventos que não tenham realizacao
        let realizacaoEventoIds = realizacaoEventoList.map(obj => obj.eventoId)

        const eventoNaoRealizadoList = eventoList.filter(obj => !realizacaoEventoIds.includes(obj.id))
        //console.log('eventoNaoRealizadoList: ' + JSON.stringify(eventoNaoRealizadoList))

        // constroe a lista de planejamento de eventos a partir dos eventos armazenados  
        let planejamentoEventoList = []
        planejamentoEventoList = planejamentoEventoList.concat(realizacaoEventoList)

        // 1. Eventos nao recorrentes programados para o mes
        const eventoNaoRecorrenteList = eventoNaoRealizadoList.filter(obj => !obj.recorrente &&
            moment(obj.data).isBetween(inicio, fim))
        // console.log('eventoNaoRecorrenteList: ' + JSON.stringify(eventoNaoRecorrenteList))

        for (const evento of eventoNaoRecorrenteList) {
            const planejamentoEvento = new PlanejamentoEvento(evento, evento.data)
            planejamentoEventoList.push(planejamentoEvento)
        }


        // 2. Eventos recorrentes mensais
        const eventoRecorrenteMensalList = eventoNaoRealizadoList.filter(obj => obj.recorrente &&
            obj.tipoRecorrencia === 'M')
        // console.log('eventoRecorrenteMensalList: ' + JSON.stringify(eventoRecorrenteMensalList))

        for (const evento of eventoRecorrenteMensalList) {
            const day = moment.utc(evento.data).date()
            const data = moment.utc(new Date(ano, mes, day)).toDate()

            const planejamentoEvento = new PlanejamentoEvento(evento, data)
            planejamentoEventoList.push(planejamentoEvento)
        }


        // 3. Eventos recorrentes anuais
        const eventoRecorrenteAnualList = eventoNaoRealizadoList.filter(obj => obj.recorrente &&
            obj.tipoRecorrencia === 'A' && moment(obj.data).month() === mes)

        for (const evento of eventoRecorrenteAnualList) {
            const day = moment.utc(evento.data).date()
            const data = moment.utc(new Date(ano, mes, day)).toDate()

            const planejamentoEvento = new PlanejamentoEvento(evento, data)
            planejamentoEventoList.push(planejamentoEvento)
        }

        return planejamentoEventoList
    }
}

module.exports = PlanejamentoEventoManager;