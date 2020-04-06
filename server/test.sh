#!/bin/sh
curl -X POST -H 'Content-Type:application/json' -d '{"url":"https://example.com/?hoge=piyo"}' localhost:8080/api/url

