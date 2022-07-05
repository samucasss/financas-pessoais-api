const crypto = require('crypto');
const ObjectUtil = require('./ObjectUtil');

class Usuario {

    constructor(json) {
        this.id = ''
        this.nome = ''
        this.email = ''
        this.hash = ''
        this.salt = ''
        this.token = ''

        if (json) {
            ObjectUtil.copy(this, json)

            if (json.senha) {
                this.salt = crypto.randomBytes(16).toString('hex'); 
                this.hash = crypto.pbkdf2Sync(json.senha, this.salt,  1000, 64, 'sha512').toString('hex'); 
            }
        }
    }

    validate(senha) {
        const hashSenha = crypto.pbkdf2Sync(senha, this.salt, 1000, 64, 'sha512').toString('hex'); 
        return hashSenha === this.hash;         
    }

    toJson() {
        return {id: this.id, nome: this.nome, email: this.email}
    }

}

module.exports = Usuario;