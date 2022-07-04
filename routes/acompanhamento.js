const moment = require('moment');
const EventoMongoDao = require("~/dao/EventoMongoDao");
const RealizacaoEventoMongoDao = require("~/dao/RealizacaoEventoMongoDao");
const PlanejamentoEventoManager = require('~/models/PlanejamentoEventoManager');

module.exports = app => {
    const eventoDao = new EventoMongoDao()
    const realizacaoEventoDao = new RealizacaoEventoMongoDao()

    app.route('/acompanhamento')
        .all(app.auth.authenticate())
        .get(async (req, res) => {
            try {
                const mes = req.body.mes
                const ano = req.body.ano

                if (!mes || !ano) {
                    res.status(412).json({ msg: 'parametros mes e/ou ano nao informados' });
                    return;
                }

                if (mes > 11) {
                    res.status(412).json({ msg: 'parametros mes invalido' });
                    return;
                }

                if (ano < 2022) {
                    res.status(412).json({ msg: 'parametros ano invalido' });
                    return;
                }

                //console.log('mes: ' + mes)
                //console.log('ano: ' + ano)

                const inicio = moment(new Date(ano, mes, 1))
                const fim = inicio.clone().endOf('month')
                console.log('inicio: ' + inicio.format('DD/MM/YYYY'))
                console.log('fim: ' + fim.format('DD/MM/YYYY'))

                const usuarioId = req.user.id

                // recupera as realizações de eventos do mes
                const realizacaoEventoList = await realizacaoEventoDao.findAll(usuarioId, inicio, fim)
                // console.log('realizacaoEventoList: ' + JSON.stringify(realizacaoEventoList))

                // recupera todos os eventos
                const eventoList = await eventoDao.findAll(usuarioId)
                // console.log('eventoList: ' + JSON.stringify(eventoList))

                const planejamentoEventoManager = new PlanejamentoEventoManager(eventoList,
                    realizacaoEventoList, mes, ano);

                const planejamentoEventoList = planejamentoEventoManager.build();

                res.json(planejamentoEventoList);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        })
        .post(async (req, res) => {
            try {
                const json = req.body

                const realizacaoEvento = ({...json, usuarioId: req.user.id})
                const result = await realizacaoEventoDao.save(realizacaoEvento)
                res.json(result);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

};
