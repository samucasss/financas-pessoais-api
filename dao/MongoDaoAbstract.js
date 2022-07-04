const { Types: { ObjectId } } = require('mongoose');
const mongoose = require('mongoose');

class MongoDaoAbstract {

    constructor() {
        this.model = mongoose.model(this.getCollectionName(), this.getSchema());
    }

    async findAll() {
        let modelList = await this.model.find();

        //adiciona a property id para cada objeto
        modelList = modelList.map(obj => this.convert(obj))

        const result = modelList.map(json => this.createModel(json))
        return result
    }

    async find(query) {
        let modelList = await this.model.find(query);

        //adiciona a property id para cada objeto
        modelList = modelList.map(obj => this.convert(obj))

        const result = modelList.map(json => this.createModel(json))
        return result
    }

    async findOne(query) {
        let obj = await this.model.findOne(query);

        //adiciona a property id para cada objeto
        obj = this.convert(obj)

        const result = this.createModel(obj)
        return result
    }

    async get(id) {
        let obj = await this.model.findById(ObjectId(id))

        //adiciona a property id para o objeto
        let result = this.convert(obj)

        return this.createModel(result);
    }

    async save(json) {
        let objMongo = null;

        if (json.id) {
            let obj = await this.model.findById(ObjectId(json.id))
            Object.assign(obj, json)
            objMongo = await obj.save()

        } else {
            objMongo = await this.model.create(json)
        }

        //adiciona a property id para o objeto
        let result = this.convert(objMongo)

        return this.createModel(result);
    }

    async delete(id) {
        await this.model.deleteOne({ _id: ObjectId(id) });
    }

    async deleteAll() {
        await this.model.deleteMany({})
    }

    convert(objMongo) {
        return ({ ...objMongo._doc, id: objMongo._id.toHexString() })
    }

}

module.exports = MongoDaoAbstract;