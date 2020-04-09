exports.index = function (req, res, next) {
    (async () => {
        res.render('index', { title: 'Express' });
    })().catch(next);
};
