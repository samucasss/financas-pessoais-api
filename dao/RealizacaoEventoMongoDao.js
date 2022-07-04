const RealizacaoEvento = require("~/models/realizacaoEvento");
const mongoose = require('mongoose');
const MongoDaoAbstract = require("./MongoDaoAbstract");
const { Schema } = mongoose;
const { Types: { ObjectId } } = require('mongoose');

class RealizacaoEventoMongoDao extends MongoDaoAbstract {

    static SCHEMA = Schema({
        eventoId: {
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
        nome: {
            type: String,
            required: true
        },
        data: {
            type: Date,
            required: true
        },
        valor: {
            type: Number,
            required: true
        },
        realizado: {
            type: Boolean,
            required: true
        }
    });
  
    constructor() {
        super()
    }

    getCollectionName() {
        return 'realizacaoEventos';
    }

    getSchema() {
        return RealizacaoEventoMongoDao.SCHEMA;
    }

    createModel(json) {
        return new RealizacaoEvento(json);
    }

    async findAll(usuarioId, inicio, fim) {
        const query = { usuarioId: usuarioId, data: { $gte: inicio, $lt: fim } };
        const modelList = await this.find(query);
        return modelList
    }

    async save(json) {
        //remove o registro com o eventoId
        await this.model.deleteOne({ eventoId: ObjectId(json.eventoId) });

        let objMongo = await this.model.create(json)

        //adiciona a property id para o objeto
        let result = this.convert(objMongo)

        return this.createModel(result);
    }

}

module.exports = RealizacaoEventoMongoDao;