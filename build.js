console.log('Running Build.js');

require('dotenv').config();
const Bundler = require('parcel-bundler');
const path = require('path');
const entryFiles = path.join(__dirname, './src/*.html');

var bundleOptions = {
    scopeHoist: false,
    sourceMap: true,
    sourceMaps: true
};
if (process.env.NODE_ENV === 'production') {
    bundleOptions = {
        scopeHoist: false,
        sourceMap: false,
        sourceMaps: false
    };
}

const bundler = new Bundler(entryFiles, bundleOptions);
bundler.addAssetType(
    'html',
    require.resolve('./scripts/ignoreHTMLTemplate.js')
);

module.exports = (async () => {
    const bundle = await bundler.bundle();
    process.env.NODE_ENV === 'production' && process.exit();
    process.on('SIGINT', () => {
        process.exit();
    });

    process.on('SIGTERM', () => {
        process.exit();
    });
    return bundle;
})();
