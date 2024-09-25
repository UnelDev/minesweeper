#!/bin/sh
rm build/static/js/*.map
rm build/static/js/*.txt
rm build/static/css/*.map
rm build/index.html
rm build/asset-manifest.json

mv build/static/js/$(ls build/static/js/)  build/static/js/main.js
mv build/static/css/$(ls build/static/css) build/static/css/main.css
mv build/static/media/* build/static/css/
rmdir build/static/media

mv build/static/* build/
rmdir build/static

sed -i '' 's#/static/media/##g' "build/css/main.css"