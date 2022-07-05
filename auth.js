const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const UsuarioMongoDao = require("./dao/UsuarioMongoDao");

module.exports = () => {
    const usuarioDao = new UsuarioMongoDao()
    const { jwt } = config;

    const params = {
        secretOrKey: jwt.secret,
        //jwtFromRequest: ExtractJwt.fromHeader('Authorization')
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

    passport.use(
        new Strategy(params, async (payload, done) => {
            try {
                const { id } = payload;
                const usuario = await usuarioDao.get(id);
                done(null, usuario);
            } catch (err) {
                done(err, null);
            }
        })
    );

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', jwt.options)
    };
};

