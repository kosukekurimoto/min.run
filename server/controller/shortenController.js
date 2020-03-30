exports.index = function(req, res, next) {
    (async () => {
        try {
            await successFunction();
        } catch (e) {
            throw new Error('heavyFunctionのエラー');
        }

        try {
            await errorFunction();
        } catch (e) {
            throw new Error('heavyErrorFunctionのエラー');
        }

        res.send("end");
    })().catch(next);
};

async function successFunction() {
    return true;
}

async function errorFunction() {
    throw new Error('エラー発生');
    return true;
}