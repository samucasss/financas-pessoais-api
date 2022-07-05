const moment = require('moment');
const Usuario = require("~/models/Usuario");
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");
const EventoMongoDao = require("~/dao/EventoMongoDao");
const RealizacaoEventoMongoDao = require("~/dao/RealizacaoEventoMongoDao");
const jwt = require('jwt-simple');

describe('Routes: Eventos', () => {
    const usuarioDao = new UsuarioMongoDao();
    const eventoDao = new EventoMongoDao()
    const realizacaoEventoDao = new RealizacaoEventoMongoDao()

    let token;
    let eventoList;
    let eventoFake;

    describe('GET /acompanhamento', () => {
        beforeEach(async () => {
            await usuarioDao.deleteAll();

            const json = {
                nome: 'Samuel Santos',
                email: 'samuca.santos@gmail.com',
                senha: 'samuca'
            }
            const usuario = new Usuario(json)
            const result = await usuarioDao.save(usuario)

            token = jwt.encode({ id: result.id }, config.jwt.secret);

            await eventoDao.deleteAll();
            await realizacaoEventoDao.deleteAll();

            eventoList = [
                {
                    "data": "2022-06-10",
                    "nome": "Salário dia 10",
                    "tipo": "R",
                    "recorrente": true,
                    "tipoRecorrencia": "M",
                    "valor": 8300.00,
                    "realizado": false,
                    "usuarioId": result.id
                },
                {
                    "data": "2022-06-12",
                    "nome": "Conta energia",
                    "tipo": "D",
                    "recorrente": true,
                    "tipoRecorrencia": "M",
                    "valor": 280.00,
                    "realizado": false,
                    "usuarioId": result.id
                },
                {
                    "data": "2022-06-15",
                    "nome": "Vacina Bob",
                    "tipo": "D",
                    "recorrente": false,
                    "tipoRecorrencia": "",
                    "valor": 80.00,
                    "realizado": false,
                    "usuarioId": result.id
                },
                {
                    "data": "2022-05-15",
                    "nome": "Compra gás",
                    "tipo": "D",
                    "recorrente": false,
                    "tipoRecorrencia": "",
                    "valor": 120.00,
                    "realizado": false,
                    "usuarioId": result.id
                }

            ]

            let eventoId = null
            for (const evento of eventoList) {
                let resultEvento = await eventoDao.save(evento)
                eventoId = resultEvento.id
            }

            const realizacaoEvento = {
                "eventoId": eventoId,
                "data": "2022-05-15",
                "nome": "Compra gás",
                "tipo": "D",
                "recorrente": false,
                "tipoRecorrencia": "",
                "valor": 125.00,
                "realizado": true,
                "usuarioId": result.id
            }

            await realizacaoEventoDao.save(realizacaoEvento)
        });
        describe('status 200', () => {
            it('Retorna planejamento mensal de maio', done => {
                request.get('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "mes": 4,
                        "ano": 2022,
                    })
                    .expect(200)
                    .end((err, res) => {
                        let planejamentoList = res.body;

                        //ordena pela data
                        planejamentoList = planejamentoList.sort((a, b) => a.data.localeCompare(b.data));

                        expect(planejamentoList).to.have.length(3);
                        expect(planejamentoList[0].nome).to.eql('Salário dia 10');
                        expect(planejamentoList[1].nome).to.eql('Conta energia');
                        expect(planejamentoList[2].nome).to.eql('Compra gás');

                        expect(planejamentoList[2].valor).to.eql(125);
                        expect(planejamentoList[2].realizado).to.eql(true);

                        done(err);
                    });
            });
            it('Retorna planejamento mensal de junho', done => {
                request.get('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "mes": 5,
                        "ano": 2022,
                    })
                    .expect(200)
                    .end((err, res) => {
                        let planejamentoList = res.body;

                        //ordena pela data
                        planejamentoList = planejamentoList.sort((a, b) => a.data.localeCompare(b.data));

                        expect(planejamentoList).to.have.length(3);
                        expect(planejamentoList[0].nome).to.eql('Salário dia 10');
                        expect(planejamentoList[1].nome).to.eql('Conta energia');
                        expect(planejamentoList[2].nome).to.eql('Vacina Bob');

                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.get('/acompanhamento')
                    .expect(401)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o mes nao foi preenchido', done => {
                request.post('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "mes": '',
                        "ano": 2022,
                    })
                    .expect(412)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o ano nao foi preenchido', done => {
                request.post('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "mes": 5,
                        "ano": '',
                    })
                    .expect(412)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o mes for invalido', done => {
                request.post('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "mes": 12,
                        "ano": 2022,
                    })
                    .expect(412)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o ano for invalido', done => {
                request.post('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "mes": 11,
                        "ano": 2021,
                    })
                    .expect(412)
                    .end(done);
            });
        });
    });

    describe('POST /acompanhamento', () => {
        beforeEach(async () => {
            await usuarioDao.deleteAll();

            const json = {
                nome: 'Samuel Santos',
                email: 'samuca.santos@gmail.com',
                senha: 'samuca'
            }
            const usuario = new Usuario(json)
            const result = await usuarioDao.save(usuario)

            token = jwt.encode({ id: result.id }, config.jwt.secret);

            await eventoDao.deleteAll();

            const evento = {
                "data": "2022-06-10",
                "nome": "Salário dia 10",
                "tipo": "R",
                "recorrente": true,
                "tipoRecorrencia": "M",
                "valor": 8300.00,
                "realizado": false,
                "usuarioId": result.id
            }

            eventoFake = await eventoDao.save(evento);
        });
        describe('status 200', () => {
            it('Registra realização de evento', done => {
                request.post('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "eventoId": eventoFake.id,
                        "tipo": "R",
                        "recorrente": true,
                        "nome": "Salário dia 10",
                        "data": "2022-06-11",
                        "valor": 8500.00,
                        "realizado": true
                    })
                    .expect(200)
                    .end((err, res) => {
                        const realizacaoEvento = res.body

                        expect(realizacaoEvento.eventoId).to.eql(eventoFake.id);
                        expect(realizacaoEvento.tipo).to.eql("R");
                        expect(realizacaoEvento.recorrente).to.eql(true);
                        expect(realizacaoEvento.nome).to.eql("Salário dia 10");
                        expect(realizacaoEvento.valor).to.eql(8500);
                        expect(realizacaoEvento.realizado).to.eql(true);

                        const dataEvento = moment.utc(realizacaoEvento.data).format('YYYY-MM-DD');
                        expect(dataEvento).to.eql("2022-06-11");

                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.post('/acompanhamento')
                    .expect(401)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o campo data nao foi preenchido', done => {
                request.post('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "data": "",
                        "nome": "Salário dia 10",
                        "tipo": "R",
                        "recorrente": true,
                        "tipoRecorrencia": "M",
                        "valor": 8300.00,
                        "realizado": false
                    })
                    .expect(412)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o campo nome nao foi preenchido', done => {
                request.post('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "data": "2022-06-10",
                        "nome": "",
                        "tipo": "R",
                        "recorrente": true,
                        "tipoRecorrencia": "M",
                        "valor": 8300.00,
                        "realizado": false
                    })
                    .expect(412)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o campo tipo nao foi preenchido', done => {
                request.post('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "data": "2022-06-10",
                        "nome": "Salário dia 10",
                        "tipo": "",
                        "recorrente": true,
                        "tipoRecorrencia": "M",
                        "valor": 8300.00,
                        "realizado": false
                    })
                    .expect(412)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o campo valor nao foi preenchido', done => {
                request.post('/acompanhamento')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "data": "2022-06-10",
                        "nome": "Salário dia 10",
                        "tipo": "R",
                        "recorrente": true,
                        "tipoRecorrencia": "M",
                        "valor": "",
                        "realizado": false
                    })
                    .expect(412)
                    .end(done);
            });
        });

    });


});
