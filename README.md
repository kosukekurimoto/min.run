# min.run
Cloud Runで動作する短縮URLサービス(https://min.run)  

## 使い方
- 短縮URLの発行  
```
$ curl -X POST -H 'Content-Type:application/json' -d '{"url":"<短縮したいURL>"}' https://min.run/shorten
# 例: curl -X POST -H 'Content-Type:application/json' -d '{"url":"https://example.com/?hoge=piyo"}' https://min.run/shorten
```
- 結果(結果に含まれるshortUrlの値が短縮URLになります)
```
{"urlCode":"mZQJF","originalUrl":"https://example.com/?hoge=piyo","shortUrl":"https://min.run/mZQJF"}
```

# 自分専用のmin.runサーバーを構築したい方は以下を参考

## Setup
- Google Cloudプロジェクトの新規作成
- Cloud Datastoreの有効化(ネイティブモード)
- Container Registry APIの有効化
- Cloud Run APIの有効化
- Google Cloud SDK のインストール  
[公式ドキュメント](https://cloud.google.com/sdk/install)を参考にインストール
- gcloudコマンドの認証
```
$ gcloud auth login
$ gcloud config set <Google Cloud Project ID>
```
- Service Accountキーファイルの作成  
[公式ドキュメント](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)を参考に作成し、/serverディレクトリ直下に保存  
※権限は 「Cloud Datastore オーナー」を付与する
- 設定ファイルの編集(/server/config/index.js)
```
const config = {
    BASE_URL: '<短縮URLサービスのベースURL>', // 例: https://min.run/
    GCP_PROJECT: '<Google Cloud Project ID>', // 例: minrun
    GCP_SERVICE_ACCOUNT_FILE: '<作成したサービスアカウントキーファイルのファイル名>', // 例: service-account.json
    FIRESTORE_COLLECTION_URL: '<生成した短縮URL情報を保存するFirestoreのコレクション名>', // 例: url
    URLCODE_MIN_LENGTH: <短縮URL用ハッシュ文字列の最小値>, // 例: 5
    URLCODE_VALUES: '<短縮URL用ハッシュ文字列に使用する文字種類>', ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
    RESERVED_PATHS: [
        'shorten',
        'api'
    ]
};
```
- Dockerの認証ヘルパーにgcloudを使用する  
[公式ドキュメント](https://cloud.google.com/container-registry/docs/advanced-authentication?hl=ja)
```
gcloud auth configure-docker
```

## DEBUG
### 非Docker環境でのデバッグ
```
$ cd server
$ ./dev.sh
$ ./test.sh
```

### Docker環境でのデバッグ
```
$ cd server
$ gcloud builds submit --tag gcr.io/<Google Cloud Project ID>/server
# 例: gcloud builds submit --tag gcr.io/minrun/server
$ docker pull gcr.io/<Google Cloud Project ID>/server
# 例: docker pull gcr.io/minrun/server
$ docker run -p 8080:8080 gcr.io/<Google Cloud Project ID>/server
# 例: docker run -p 8080:8080 gcr.io/minrun/server
$ ./test.sh
```

## Deploy
```
$ gcloud builds submit --tag gcr.io/<Google Cloud Project ID>/minrun/server
$ gcloud run deploy server \
  --image gcr.io/<Google Cloud Project ID>/server \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
# 例: gcloud run deploy server \
# --image gcr.io/min/server \
# --platform managed \
# --region asia-northeast1 \
# --allow-unauthenticated
```

## TIPS
- カスタムドメインのマッピング  
[公式ドキュメント](https://cloud.google.com/run/docs/mapping-custom-domains?hl=ja)

## License
MIT