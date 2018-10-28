import express from 'express';
import path from 'path';
import serveIndex from 'serve-index';

const app = express();
const outDir = path.resolve(__dirname, '../dist');

app.use(express.static(outDir), serveIndex(outDir));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
