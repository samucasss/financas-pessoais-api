const moment = require('moment');
const Usuario = require("~/models/Usuario");
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");
const EventoMongoDao = require("~/dao/EventoMongoDao");
const jwt = require('jwt-simple');

describe('Routes: Eventos', () => {
    const usuarioDao = new UsuarioMongoDao();
    const eventoDao = new EventoMongoDao()

    let token;
    let eventoList;
    let eventoFake;

    describe('GET /eventos', () => {
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
                }
            ]

            for (const evento of eventoList) {
                await eventoDao.save(evento)
            }

        });
        describe('status 200', () => {
            it('Retorna lista de eventos', done => {
                request.get('/eventos')
                    .set({ Authorization: `Bearer ${token}` })
                    .expect(200)
                    .end((err, res) => {

                        for (let i = 0; i < res.body.length; i++) {
                            const evento = res.body[i]

                            expect(evento.id).not.to.be.null
                            expect(evento.nome).to.eql(eventoList[i].nome);
                            expect(evento.tipo).to.eql(eventoList[i].tipo);
                            expect(evento.recorrente).to.eql(eventoList[i].recorrente);
                            expect(evento.tipoRecorrencia).to.eql(eventoList[i].tipoRecorrencia);
                            expect(evento.valor).to.eql(eventoList[i].valor);
                            expect(evento.realizado).to.eql(eventoList[i].realizado);

                            const dataEvento = moment.utc(evento.data).format('YYYY-MM-DD');
                            expect(dataEvento).to.eql(eventoList[i].data);
                        }

                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.get('/eventos')
                    .expect(401)
                    .end(done);
            });
        });
    });

    describe('POST /eventos', () => {
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

            //cria um evento para alteracao
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

            eventoFake = await eventoDao.save(evento)

        });
        describe('status 200', () => {
            it('Cadastra novo evento', done => {
                request.post('/eventos')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "data": "2022-06-10",
                        "nome": "Salário dia 10",
                        "tipo": "R",
                        "recorrente": true,
                        "tipoRecorrencia": "M",
                        "valor": 8300.00,
                        "realizado": false
                    })
                    .expect(200)
                    .end((err, res) => {
                        const evento = res.body

                        expect(evento.id).not.to.be.null
                        expect(evento.nome).to.eql("Salário dia 10");
                        expect(evento.tipo).to.eql("R");
                        expect(evento.recorrente).to.eql(true);
                        expect(evento.tipoRecorrencia).to.eql("M");
                        expect(evento.valor).to.eql(8300);
                        expect(evento.realizado).to.eql(false);

                        const dataEvento = moment.utc(evento.data).format('YYYY-MM-DD');
                        expect(dataEvento).to.eql("2022-06-10");

                        done(err);
                    });
            });
            it('Altera evento existente', done => {
                request.post('/eventos')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "eventoId": eventoFake.id,
                        "data": "2022-06-10",
                        "nome": "Salário dia 10",
                        "tipo": "R",
                        "recorrente": true,
                        "tipoRecorrencia": "M",
                        "valor": 8500.00,
                        "realizado": false
                    })
                    .expect(200)
                    .end((err, res) => {
                        const evento = res.body

                        expect(evento.id).not.to.be.null
                        expect(evento.nome).to.eql("Salário dia 10");
                        expect(evento.tipo).to.eql("R");
                        expect(evento.recorrente).to.eql(true);
                        expect(evento.tipoRecorrencia).to.eql("M");
                        expect(evento.valor).to.eql(8500);
                        expect(evento.realizado).to.eql(false);

                        const dataEvento = moment.utc(evento.data).format('YYYY-MM-DD');
                        expect(dataEvento).to.eql("2022-06-10");

                        done(err);
                    });
            });

        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.post('/eventos')
                    .expect(401)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o campo data nao foi preenchido', done => {
                request.post('/eventos')
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
                request.post('/eventos')
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
                request.post('/eventos')
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
            it('Retorna erro quando o campo tipoRecorrencia nao foi preenchido para evento recorrente', done => {
                request.post('/eventos')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "data": "2022-06-10",
                        "nome": "Salário dia 10",
                        "tipo": "",
                        "recorrente": true,
                        "tipoRecorrencia": "",
                        "valor": 8300.00,
                        "realizado": false
                    })
                    .expect(412)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o campo valor nao foi preenchido', done => {
                request.post('/eventos')
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

    describe('DELETE /eventos/:id', () => {
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

            eventoFake = await eventoDao.save(evento)

        });
        describe('status 200', () => {
            it('Retorna OK', done => {
                request.delete(`/eventos/${eventoFake.id}`)
                    .set({ Authorization: `Bearer ${token}` })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.eql('OK');
                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.delete(`/eventos/${eventoFake.id}`)
                    .expect(401)
                    .end(done);
            });
        });
    });


});
