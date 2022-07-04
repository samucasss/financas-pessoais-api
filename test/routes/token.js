const Usuario = require("~/models/Usuario");
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");

describe('Routes: Token', () => {
    const usuarioDao = new UsuarioMongoDao()

    describe('POST /token', () => {
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
            it('Retorna usuario token autenticado', done => {
                request.post('/token')
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
        describe('status 401', () => {
            it('Retorna erro quando senha incorreta', done => {
                request.post('/token')
                    .send({
                        email: 'samuca.santos@gmail.com',
                        password: 'samuca20'
                    })
                    .expect(401)
                    .end(done);
            });
            it('Retorna erro quando email nao existe', done => {
                request.post('/token')
                    .send({
                        email: 'samuca@gmail.com',
                        password: 'samuca20'
                    })
                    .expect(401)
                    .end(done);
            });
            it('Retorna erro quando campos nao preenchidos', done => {
                request.post('/token')
                    .expect(401)
                    .end(done);
            });
        });
    });
});
