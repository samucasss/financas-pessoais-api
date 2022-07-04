const Evento = require("~/models/Evento");
const mongoose = require('mongoose');
const MongoDaoAbstract = require("./MongoDaoAbstract")
const { Schema } = mongoose;

class EventoMongoDao extends MongoDaoAbstract {

    static SCHEMA = Schema({
        data: {
            type: Date,
            required: true
        },
        nome: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
        recorrente: {
            type: Boolean,
            required: true
        },
        tipoRecorrencia: {
            type: String,
            required: false
        },
        valor: {
            type: Number,
            required: true
        },
        realizado: {
            type: Boolean,
            required: true
        },
        usuarioId: {
            type: String,
            required: true
        }
    });    

    constructor() {
        super()
    }

    getCollectionName() {
        return 'eventos';
    }

    getSchema() {
        return EventoMongoDao.SCHEMA;
    }

    createModel(json) {
        return new Evento(json);
    }

    findAll(usuarioId) {
        const query = {usuarioId: usuarioId}
        return this.find(query)
    }
}

module.exports = EventoMongoDao;