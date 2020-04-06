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
        
        // 短縮URLの情報を取得
        const doc = await url.get(req.params.code);

        // URL Codeが存在しない
        if (!doc.exists) {
            res.status(400).json({ error: '404 Not Found' });
            return;
        }

        // オリジナルURLにリダイレクト
        res.redirect(doc.data().originalUrl);
    })().catch(next);
};
