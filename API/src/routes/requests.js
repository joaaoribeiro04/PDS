module.exports = (app) => {
    const findAll = (req, res) => {
        app.db('requests').select()
        .then((result) => res.status(200).json(result));
    };

    const create = async (req, res) => {
        let result = await app.services.request.save(req.body);
        if (result.error) return res.status(400).json(result);
        res.status(201).json(result[0]);
    };

    const update = async  (req, res) => {
        let result = await app.services.request.update(req.params.id, req.body);
        if (result.error) return res.status(400).json(result);
        res.status(200).json({ data: result[0], message: "request updated" });
    };

    const remove = async (req, res) => {
        let result = await app.services.request.remove(req.params.id);
        if (result.error) return res.status(400).json(result);
        res.status(204).send();
    };

    return { findAll, create, update, remove};
};