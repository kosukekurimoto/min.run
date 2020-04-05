const config = {
    BASE_URL: 'https://min.run/',
    GCP_PROJECT: 'kdev-common',
    GCP_SERVICE_ACCOUNT_FILE: 'service-account.json',
    FIRESTORE_COLLECTION_URL: 'url',
    URLCODE_MIN_LENGTH: 5,
    URLCODE_VALUES: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    RESERVED_PATHS: [
        'shorten',
        'api'
    ]
};

module.exports = config;