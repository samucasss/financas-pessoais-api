const jwt = require('jwt-simple');
const config = require('../config.js');
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");

module.exports = (app) => {
    const usuarioDao = new UsuarioMongoDao()
    const { secret } = config.jwt;

    app.post('/api/auth/login', async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (email && senha) {
                const usuario = await usuarioDao.findByEmail(email);

                if (usuario.validate(senha)) {
                    const payload = { id: usuario.id };
                    const token = jwt.encode(payload, secret);

                    await usuarioDao.saveToken(usuario.id, token);

                    return res.json({ token });
                }
            }

            res.status(412).json({ msg: 'Campos Email e senha nao informados' });

        } catch (err) {
            res.status(412).json({ msg: err.message });
        }
    });

    app.route('/api/auth/logout')
        .all(app.auth.authenticate())
        .post(async (req, res) => {
            try {
                await usuarioDao.saveToken(req.user.id, '');
                const result = await usuarioDao.get(req.user.id)

                res.json({status: 'OK', token: result.token});

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

        app.route('/api/auth/user')
        .all(app.auth.authenticate())
        .get(async (req, res) => {
            try {
                const usuario = await usuarioDao.get(req.user.id)
                res.json(usuario.toJson());

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        })

};