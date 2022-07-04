const currentEnv = process.env.NODE_ENV || 'development';

const mongoDBURLs = {
    development: 'mongodb://localhost:27017/financas-pessoais',
    test: 'mongodb://localhost:27017/financas-pessoais-test'
};

const jwtSecret = 'F1nanca$-Pe$$0a1$-AP1';

module.exports = {
    jwt: {
        secret: jwtSecret,
        options: { session: false }
    },
    mongoDBURL:	mongoDBURLs[currentEnv]
};
