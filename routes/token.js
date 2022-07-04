const jwt = require('jwt-simple');
const config = require('../config.js');
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");

module.exports = (app) => {
    const usuarioDao = new UsuarioMongoDao()
    const { secret } = config.jwt;

    app.post('/token', async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (email && senha) {
                const usuario = await usuarioDao.findByEmail(email);

                if (usuario.validate(senha)) {
                    const payload = { id: usuario.id };
                    const token = jwt.encode(payload, secret);
                    return res.json({ token });
                }
            }

            return res.sendStatus(401);

        } catch (err) {
            return res.sendStatus(401);
        }
    });
};