const { exec } = require("child_process");
const request = require('request');
const express = require('express');
const zlib = require('zlib');
const _url = require('url');
const fs = require('fs');
const app = express();
const port = 8080;


const sendBody = (res) => (page) => {
    
    console.log("proxy: HTTP intercept response: MODIFIED RESPONSE BODY");
    res.send(page);
}

const process = (req, origin, send) => (body) => {
	const page = body.replace(/<head>/g, '<head><base href="' + origin + '">');

        fs.writeFileSync('./input.html', page, 'utf-8')
	let command =         "export ADAPTABLE_HTML_ENERGY="+req.params.energy;
	command = command + "; export ADAPTABLE_HTML_ACCURACY="+req.params.accuracy;
	command = command + "; html ./input.html --conditional-loading --loop-perforation";

        exec(command, (error, stdout, stderr) => { // --conditional-loading --loop-perforation --degrade-image --degrade-image.folder=\"/home/ImageDegradation/\"
        if (error) {
            console.log(`error: ${error.message}`);
            //send(page);
            //return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            //send(page);
            //return
        }
        send(stdout);
        });
}

app.get('/uncarbonize/:energy/:accuracy/:url', (req, res) => {

    const uri = decodeURIComponent(req.params.url);
    const url = new _url.URL(uri);
    const origin = url.origin;

    const send = sendBody(res);
    const callback = process(req, origin, send);

    request({url:uri, encoding: null}, (err, response, body) => {
        if (err) { return console.log(err); }

        console.log("PROXY : " + uri);

	if(body.indexOf("<html") > -1){
		callback(body.toString());
	} else {
		zlib.gunzip(body, function(err, dezipped) {
			if(err){
				callback(body.toString());
			} else {
				callback(dezipped.toString());
			}
		});
	}
    });
});

app.get('/img/:url', (req, res) => {
    const uri = decodeURIComponent(req.params.url);
    console.log("IMAGE : " + uri);
    res.sendFile(uri);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


