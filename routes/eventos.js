const EventoMongoDao = require("~/dao/EventoMongoDao");

module.exports = app => {
    const eventoDao = new EventoMongoDao()

    app.route('/eventos')
        .all(app.auth.authenticate())
        .get(async (req, res) => {
            try {
                let eventoList = await eventoDao.findAll(req.user.id);
                eventoList = eventoList.sort((a,b) => {
                    return a.data < b.data
                });

                res.json(eventoList);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        })
        .post(async (req, res) => {
            try {
                const json = req.body

                if (json.recorrente && !json.tipoRecorrencia) {
                    res.status(412).json({ msg: 'Campo tipoRecorrencia vazio' });
                    return;
                }

                const evento = ({...json, usuarioId: req.user.id})
                const result = await eventoDao.save(evento)

                res.json(result);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

    app.route('/eventos/:id')
        .all(app.auth.authenticate())
        .delete(async (req, res) => {
            try {
                await eventoDao.delete(req.params.id);
                res.json('OK');
            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

};
