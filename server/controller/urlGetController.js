// ライブラリのインポート
const validator = require('validator');

// Config値のロード
const config = require('../config');

// Service
const url = require('../service/url');

exports.index = function (req, res, next) {
    (async () => {
        // URL Codeのバリデーション
        if (!validator.isWhitelisted(req.params.code, config.URLCODE_VALUES)) {
            res.status(400).json({ error: 'Invalid URL Code' });
            return;
        }

        const urlCode = req.params.code;

        // 短縮URLの情報を取得
        const urlData = await url.get(urlCode);

        // URL Codeが存在しない
        if (!urlData) {
            res.status(404).json({ error: '404 Not Found' });
            return;
        }

        res.json(urlData);
    })().catch(next);
};
