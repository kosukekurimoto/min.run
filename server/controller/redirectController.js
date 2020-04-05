// ライブラリのインポート
const validator = require('validator');
const { Firestore, FieldValue } = require('@google-cloud/firestore');

// Config値のロード
const config = require('../config');

// 初期化
const firestore = new Firestore({
    projectId: config.GCP_PROJECT,
    keyFilename: config.GCP_SERVICE_ACCOUNT_FILE,
});

exports.index = function (req, res, next) {
    (async () => {
        // URL Codeのバリデーション
        if (!validator.isWhitelisted(req.params.code, config.URLCODE_VALUES)) {
            res.status(400).json({ error: 'Invalid URL Code' });
            return;
        }

        // URL Codeを検索
        const urlDocRef = firestore.collection(config.FIRESTORE_COLLECTION_URL).doc(req.params.code);
        const doc = await urlDocRef.get().catch(function (err) {
            throw new Error('Confirm Existence Of UrlCode Failed');
        });

        // URL Codeが存在しない
        if (!doc.exists) {
            res.status(400).json({ error: '404 Not Found' });
            return;
        }

        // オリジナルURLにリダイレクト
        res.redirect(doc.data().originalUrl);
    })().catch(next);
};
