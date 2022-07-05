const Usuario = require("~/models/Usuario");
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");
const config = require('../../config.js');
const jwt = require('jwt-simple');

describe('Routes: Auth', () => {
    const usuarioDao = new UsuarioMongoDao();

    let token;

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await usuarioDao.deleteAll();

            const json = {
                nome: 'Samuel Santos',
                email: 'samuca.santos@gmail.com',
                senha: 'samuca'
            }
            const usuario = new Usuario(json)
            await usuarioDao.save(usuario)

        });
        describe('status 200', () => {
            it('Retorna token do usuario autenticado', done => {
                request.post('/api/auth/login')
                    .send({
                        email: 'samuca.santos@gmail.com',
                        senha: 'samuca'
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.include.keys('token');
                        done(err);
                    });
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando senha incorreta', done => {
                request.post('/api/auth/login')
                    .send({
                        email: 'samuca.santos@gmail.com',
                        password: 'samuca20'
                    })
                    .expect(412)
                    .end(done);
            });
            it('Retorna erro quando email nao existe', done => {
                request.post('/api/auth/login')
                    .send({
                        email: 'samuca@gmail.com',
                        password: 'samuca20'
                    })
                    .expect(412)
                    .end(done);
            });
            it('Retorna erro quando campos nao preenchidos', done => {
                request.post('/api/auth/login')
                    .expect(412)
                    .end(done);
            });
        });
    });

    describe('POST /api/auth/logout', () => {
        beforeEach(async () => {
            await usuarioDao.deleteAll();

            const json = {
                nome: 'Samuel Santos',
                email: 'samuca.santos@gmail.com',
                senha: 'samuca'
            }

            const usuario = new Usuario(json)

            const result = await usuarioDao.save(usuario)

            const { secret } = config.jwt;
            const payload = { id: result.id };
            token = jwt.encode(payload, secret);

            await usuarioDao.saveToken(result.id, token)
            
        });
        describe('status 200', () => {
            it('Retorna usuario deslogado', done => {
                request.post('/api/auth/logout')
                    .set({ Authorization: `Bearer ${token}` })
                    .expect(200)
                    .end((err, res) => {
                        console.log('res.body: ' + JSON.stringify(res.body))
                        expect(res.body.token).to.eql('');
                        expect(res.body.status).to.eql('OK');

                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.post('/api/auth/logout')
                    .expect(401)
                    .end(done);
            });
        });
    });

    describe('GET /api/auth/user', () => {
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
        });
        describe('status 200', () => {
            it('Retorna usuario logado', done => {
                request.get('/api/auth/user')
                    .set({ Authorization: `Bearer ${token}` })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.nome).to.eql('Samuel Santos');
                        expect(res.body.email).to.eql('samuca.santos@gmail.com');
                        expect(res.body.id).not.to.be.null
                        expect(res.body.hash).to.be.undefined
                        expect(res.body.salt).to.be.undefined
                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.get('/api/auth/user')
                    .expect(401)
                    .end(done);
            });
        });
    });

});
