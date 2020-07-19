const fs = require('fs');
const path = require('path');
const express = require('express');

function findInDir(dir, filter, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileStat = fs.lstatSync(filePath);

        if (fileStat.isDirectory()) {
            findInDir(filePath, filter, fileList);
        } else if (filter.test(filePath)) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Usage
const typeFiles = findInDir('./node_modules/@types/openfin', /\.d.ts$/);

const typeFileSetup = typeFiles
    .map(
        file => `(async function() {
    const typings = await fetch('/${file}').then(r => r.text());

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        typings,
        '/${file}'
    );
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
        typings,
        '/${file}'
    );
    })();`
    )
    .join('');

const typings = express.Router();
typings.get('/openfin', (req, res) => {
    res.contentType('application/javascript').send(typeFileSetup);
});

const routes = app => {
    app.use('/typings', typings);
};

module.exports = routes;
