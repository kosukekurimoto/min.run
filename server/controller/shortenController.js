// ライブラリのインポート
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

const validator = require('validator');

const { customAlphabet } = require('nanoid');

const { Firestore, FieldValue } = require('@google-cloud/firestore');

// JSON Schemaのロード
const shortenSchema = require('../schema/shorten.json');

// Config値のロード
const config = require('../config');

// 初期化
const firestore = new Firestore({
    projectId: config.GCP_PROJECT,
    keyFilename: config.GCP_SERVICE_ACCOUNT_FILE,
});

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
        const originalUrl = encodeURI(req.body.url); // 元URL
        const urlCode = await generateUrlCode();

        // Firestoreに保存するドキュメント
        let urlDoc = {
            urlCode: urlCode,
            originalUrl: originalUrl,
            shortUrl: config.BASE_URL + urlCode,
            updatedAt: FieldValue.serverTimestamp()
        };

        // Firestoreに保存
        const urlDocRef = firestore.collection(config.FIRESTORE_COLLECTION_URL).doc(urlCode);
        try {
            await urlDocRef.set(urlDoc, { merge: true });
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to save data`);
            return;
        }

        res.json({
            urlCode: urlDoc.urlCode,
            originalUrl: originalUrl,
            shortUrl: config.BASE_URL + urlCode
        });
    })().catch(next);
};

/*
 * 短縮URL用のユニークコードの生成
 */
async function generateUrlCode() {
    let urlCode;
    let codeLength = config.URLCODE_MIN_LENGTH - 1;
    // 重複しないコードが出来るまでループ、重複した場合はコードの長さを+1してリトライ
    do {
        codeLength = codeLength + 1;
        const nanoid = customAlphabet(config.URLCODE_VALUES, codeLength);
        urlCode = await nanoid();
    } while (!await confirmExistenceOfUrlCode(urlCode));
    return urlCode;
}

/*
 * 利用可能なURLコードかどうか確認(予約されたURLでないか、既に使われていないか)
 * return true = 利用可能
 * return false = 利用不可
 */
async function confirmExistenceOfUrlCode(urlCode) {
    let confirm = false;

    // URL用に予約されていないか
    if (config.RESERVED_PATHS.indexOf(urlCode) >= 0) {
        confirm = false;
        return confirm;
    }

    // 既に使われていないか
    const urlDocRef = firestore.collection(config.FIRESTORE_COLLECTION_URL).doc(urlCode);
    const doc = await urlDocRef.get().catch(function (err) {
        throw new Error('Confirm Existence Of UrlCode Failed');
    });
    if (doc.exists === false) {
        // レコードが存在しない場合はOK(true)
        confirm = true;
    }

    return confirm;
}