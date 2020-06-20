const { exec } = require("child_process");
const request = require('request');
const express = require('express');
const _url = require('url');
const fs = require('fs');
const app = express();
const port = 8080;


const sendBody = (res, origin) => (body) => {
    const page = body.replace(/<head>/g, '<head><base href="' + origin + '">');
    console.log("proxy: HTTP intercept response: MODIFIED RESPONSE BODY");
    res.send(page);
}

app.get('/uncarbonize/:energy/:accuracy/:url', (req, res) => {

    const uri = decodeURIComponent(req.params.url);
    const url = new _url.URL(uri);
    const origin = url.origin;

    const send = sendBody(res, origin);


    request(uri, (err, response, body) => {
        if (err) { return console.log(err); }

        console.log("PROXY : " + uri);

        fs.writeFileSync('./input.html', body, 'utf-8')
        exec("html ./input.html --conditional-loading --loop-perforation --degrade-image", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            send(body);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            send(body);
            return
        }
        send(stdout);
        });
    });
});

app.get('/img/:url', (req, res) => {
    const uri = decodeURIComponent(req.params.url);
    console.log("IMAGE : " + uri);
    res.sendFile(uri);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


