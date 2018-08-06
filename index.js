require('babel-register')({
    presets: ['react', 'env']
});

const nativefier = require('nativefier').default;
const express = require('express')
const fs = require('fs');
const zipdir = require('zip-dir');
const util = require('util');
const rimraf = require('rimraf');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Index = React.createFactory(require('./public/Index').default);

const app = express();

const nativefierAsync = util.promisify(nativefier);
const zipdirAsync = util.promisify(zipdir);
const rmdirAsync = util.promisify(rimraf);

app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send(ReactDOMServer.renderToString(Index()));
});

app.post('/', async (req, res, next) => {
    try {
        const appPath = await nativefierAsync({targetUrl: req.body.url, out: './test/'});
        const buffer = await zipdirAsync(appPath);
        await rmdirAsync(appPath);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(appPath)}.zip`);
        res.setHeader('Content-Length', buffer.byteLength);
        res.send(buffer);
    } catch(error) {
        next(error);
    }
});

app.use(function (error, req, res, next) {
    console.error(error);
    res.status(500).send(ReactDOMServer.renderToString(Index({error})));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
