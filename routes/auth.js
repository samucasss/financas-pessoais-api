const jwt = require('jwt-simple');
const config = require('../config.js');
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");

module.exports = (app) => {
    const usuarioDao = new UsuarioMongoDao()
    const { secret } = config.jwt;

    app.post('/auth/login', async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (email && senha) {
                const usuario = await usuarioDao.findByEmail(email);

                if (usuario.validate(senha)) {
                    const payload = { id: usuario.id };
                    const token = jwt.encode(payload, secret);

                    return res.json({ token: token });
                } else {
                    res.status(412).json({ msg: 'E-mail e/ou senha incorretos' });    
                }

            } else {
                res.status(412).json({ msg: 'Campos E-mail e senha nao informados' });
            }


        } catch (err) {
            res.status(412).json({ msg: err.message });
        }
    });

    app.route('/auth/user')
        .all(app.auth.authenticate())
        .get(async (req, res) => {
            try {
                const usuario = await usuarioDao.get(req.user.id)
                res.json({user: usuario.toJson()});

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        })

};