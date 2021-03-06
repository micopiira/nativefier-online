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

const [nativefierAsync, zipdirAsync, rmdirAsync] = [nativefier, zipdir, rimraf].map(f => util.promisify(f));

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

app.use((error, req, res, next) => {
    res.status(500).send(ReactDOMServer.renderToString(Index({error})));
});

(port => app.listen(port, () => console.log(`Listening on port ${port}!`)))(process.env.PORT || 3000);

