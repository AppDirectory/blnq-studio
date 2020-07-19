parcel=$PWD/node_modules/.bin/parcel
ROOT=$PWD/node_modules/monaco-editor/esm/vs
MIN_ROOT=$PWD/node_modules/monaco-editor/dev/vs
OPTS=" --no-source-maps --log-level 3 --public-url /"        # Parcel options - See: https://parceljs.org/cli.html

echo '\n\nBuilding: /dist/html.worker.js';
$parcel build $ROOT/language/html/html.worker.js $OPTS
echo '\n\nBuilding: /dist/css.worker.js';
$parcel build $ROOT/language/css/css.worker.js $OPTS
echo '\n\nBuilding: /dist/ts.worker.js';
$parcel build $ROOT/language/typescript/ts.worker.js $OPTS
echo '\n\nBuilding: /dist/json.worker.js';
$parcel build $ROOT/language/json/json.worker.js $OPTS
echo '\n\nBuilding: /dist/editor.worker.js';
$parcel build $ROOT/editor/editor.worker.js $OPTS

cp $PWD/src/robots.txt $PWD/dist
cp $PWD/src/humans.txt $PWD/dist

