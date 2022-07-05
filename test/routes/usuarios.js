const Usuario = require("~/models/Usuario");
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");
const jwt = require('jwt-simple');

describe('Routes: Usuarios', () => {
    const usuarioDao = new UsuarioMongoDao();
    let token;

    describe('POST /api/usuarios', () => {
        beforeEach(async () => {
            await usuarioDao.deleteAll();
        });
        describe('status 200', () => {
            it('Retorna usuario cadastrado', done => {
                request.post('/api/usuarios')
                    .send({
                        nome: 'Samuel Santos',
                        email: 'samuca.santos@gmail.com',
                        senha: 'samuca'
                    })
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
        describe('status 412', () => {
            it('Retorna erro quando campo nome nao preenchido', done => {
                request.post('/api/usuarios')
                    .send({
                        nome: '',
                        email: 'samuca.santos@gmail.com',
                        senha: 'samuca'
                    })
                    .expect(412)
                    .end(done);
            });
            it('Retorna erro quando campo email nao preenchido', done => {
                request.post('/api/usuarios')
                    .send({
                        nome: 'Samuel Santos',
                        email: '',
                        senha: 'samuca'
                    })
                    .expect(412)
                    .end(done);
            });
            it('Retorna erro quando campo senha nao preenchido', done => {
                request.post('/api/usuarios')
                    .send({
                        nome: 'Samuel Santos',
                        email: 'samuca.santos@gmail.com',
                        senha: ''
                    })
                    .expect(412)
                    .end(done);
            });
        });
    });

    describe('DELETE /api/usuario', () => {
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
            it('Retorna OK', done => {
                request.delete('/api/usuario')
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
                request.delete('/api/usuario')
                    .expect(401)
                    .end(done);
            });
        });
    });

});
