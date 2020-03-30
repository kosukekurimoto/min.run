exports.index = function(req, res) {
    res.send(req.params.code);
};