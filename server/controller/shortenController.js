// ライブラリのインポート
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

const validator = require('validator');

// JSON Schemaのロード
const shortenSchema = require('../schema/shorten.json');

exports.index = function (req, res, next) {
    (async () => {
        if(!ajv.validate(shortenSchema, req.body)){
            res.status(400).json({error:'Invalid JSON format'});
            return;
        }
        if(!validator.isURL(req.body.url)){
            res.status(400).json({error:'Invalid URL format'});
            return;
        }
        const url = encodeURI(req.body.url);

        res.json({a:url})
    })().catch(next);
};
