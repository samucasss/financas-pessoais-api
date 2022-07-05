const Usuario = require("~/models/Usuario");
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");
const config = require('../../config.js');
const jwt = require('jwt-simple');

describe('Routes: Auth', () => {
    const usuarioDao = new UsuarioMongoDao();

    let token;

    describe('POST /auth/login', () => {
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
                request.post('/auth/login')
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
                request.post('/auth/login')
                    .send({
                        email: 'samuca.santos@gmail.com',
                        password: 'samuca20'
                    })
                    .expect(412)
                    .end(done);
            });
            it('Retorna erro quando email nao existe', done => {
                request.post('/auth/login')
                    .send({
                        email: 'samuca@gmail.com',
                        password: 'samuca20'
                    })
                    .expect(412)
                    .end(done);
            });
            it('Retorna erro quando campos nao preenchidos', done => {
                request.post('/auth/login')
                    .expect(412)
                    .end(done);
            });
        });
    });

    describe('GET /auth/user', () => {
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
                request.get('/auth/user')
                    .set({ Authorization: `Bearer ${token}` })
                    .expect(200)
                    .end((err, res) => {
                        const user = res.body.user
                        expect(user.nome).to.eql('Samuel Santos');
                        expect(user.email).to.eql('samuca.santos@gmail.com');
                        expect(user.id).not.to.be.null
                        expect(user.hash).to.be.undefined
                        expect(user.salt).to.be.undefined
                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.get('/auth/user')
                    .expect(401)
                    .end(done);
            });
        });
    });

});
