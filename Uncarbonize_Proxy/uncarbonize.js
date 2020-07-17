const { exec } = require("child_process");
const request = require('request');
const express = require('express');
const { JSDOM } = require("jsdom");
const zlib = require('zlib');
const _url = require('url');
const fs = require('fs');
const app = express();
const port = 8080;

var last_request = "";
var last_request_zipped = false;

const sendBody = (res) => (page, zipped) => {
    
    console.log("proxy: HTTP intercept response: MODIFIED RESPONSE BODY");
    if(zipped){
	console.log("Send Zipped");
	zlib.gzip(page, function (err, archive) {
		if (err){return res.send(page);}
		res.header('Content-Encoding', 'gzip');
		res.header('vary', 'Accept-Encoding');
		res.header('access-control-allow-origin', '*');
		res.header('content-type', 'text/html; charset=utf-8');
		res.send(archive);
		return;
	});
    } else {
	res.send(page);
    }
}

const exec_command = (req, origin, send) => (zipped) => {
	let command =         "export ADAPTABLE_HTML_ENERGY="+req.params.energy;
	command = command + "; export ADAPTABLE_HTML_ACCURACY="+req.params.accuracy;
	command = command + "; html ./input.html --conditional-loading --loop-perforation"// --degrade-image --degrade-image.origin=\""+origin+"\" --degrade-image.folder=\"/home/gwandalf/ImageDegradation/\"";

	console.log("VM start");
	//console.log(page);
        exec(command, (error, stdout, stderr) => {
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
        send(stdout, zipped);
        });
}

const process = (req, origin, send) => (body, zipped) => {
	const launch = exec_command(req, origin, send);
	const dom = new JSDOM(body);
	const base = dom.window.document.createElement("BASE");
	base.setAttribute("href",origin)
	dom.window.document.documentElement.children[0].prepend(base)
	body = dom.window.document.documentElement.outerHTML

        fs.writeFileSync('./input.html', body, 'utf-8')
	launch(zipped);
}

app.get('/uncarbonize/:energy/:accuracy/:url', (req, res) => {

    const uri = decodeURIComponent(req.params.url);
    const url = new _url.URL(uri);
    const origin = url.origin;

    const send = sendBody(res);
    const callback = process(req, origin, send);

    if(uri === last_request){
	const launch = exec_command(req, origin, send);
	launch(last_request_zipped);
	return;
    }

    request({url:uri, headers:{"Accept-Encoding":"gzip"}, encoding: null}, (err, response, body) => {
        if (err) { return console.log(err); }

        console.log("PROXY : " + uri);

	const zipped = response.headers["content-encoding"] && response.headers["content-encoding"].includes("gzip");

	last_request = uri;
	last_request_zipped = zipped;

	console.log("Zipped : " + zipped);

	if(!zipped){
		callback(body.toString(), zipped);
	} else {
		zlib.gunzip(body, function(err, dezipped) {
			if(err){
				console.log("Unzip Errpr");
				callback(body.toString(), zipped);
			} else {
				callback(dezipped.toString(), zipped);
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


