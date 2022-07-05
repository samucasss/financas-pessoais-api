const Usuario = require("~/models/Usuario");
const mongoose = require('mongoose');
const MongoDaoAbstract = require("./MongoDaoAbstract")
const { Schema } = mongoose;

class UsuarioMongoDao extends MongoDaoAbstract {

    static SCHEMA = Schema({
        nome: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        hash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        }
    });

    constructor() {
        super()
    }

    getCollectionName() {
        return 'usuarios';
    }

    getSchema() {
        return UsuarioMongoDao.SCHEMA;
    }

    createModel(json) {
        return new Usuario(json);
    }

    async findByEmail(email) {
        const usuario = await this.findOne({ email: email })
        return usuario
    }

}

module.exports = UsuarioMongoDao;
