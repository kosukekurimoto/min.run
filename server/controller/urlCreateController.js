// ライブラリのインポート
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

const validator = require('validator');

const QRCode = require('qrcode')

// JSON Schemaのロード
const shortenSchema = require('../schema/shorten.json');

// Service
const url = require('../service/url');

// Configのロード
const config = require('../config');

exports.index = function (req, res, next) {
    (async () => {
        // リクエストされたJSONのバリデーション
        if (!ajv.validate(shortenSchema, req.body)) {
            res.status(400).json({ error: 'Invalid JSON format' });
            return;
        }
        // URLフォーマットのバリデーション
        if (!validator.isURL(req.body.url)) {
            res.status(400).json({ error: 'Invalid URL format' });
            return;
        }
        
        // 元URL
        const originalUrl = encodeURI(req.body.url); 

        // 短縮URLを作成
        const urlDoc = await url.create(originalUrl);

        // QRコードイメージを生成
        const qrcodeb64 = await QRCode.toDataURL(config.BASE_URL + urlDoc.urlCode);

        res.json({
            urlCode: urlDoc.urlCode,
            originalUrl: originalUrl,
            shortUrl: config.BASE_URL + urlDoc.urlCode,
            qrCodeImage: qrcodeb64
        });
    })().catch(next);
};

