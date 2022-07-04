module.exports = app => {
    console.log('process.env.NODE_ENV:--' + process.env.NODE_ENV + '--');

    if (process.env.NODE_ENV !== 'test') {
        console.log('server start')
        app.listen(app.get('port'), () => {
            console.log(`NTask API - porta	${app.get('port')}`);
        });
    }
}