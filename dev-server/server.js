const express = require("express");
const fs = require('fs');
const path = require('path');

const dirString = path.dirname(fs.realpathSync(__filename));
const app = express();

process.chdir(dirString);

app.get('/path', (req, res) => {
    res.send('hi there');
});
app.get('/data', (req, res) => {
    res.json({key: 'value'});
})

app.use(express.static('../dist'));

const port = 9000;

app.listen(port, () => {
    console.log(`Starting server on port: ${port}`);
});
