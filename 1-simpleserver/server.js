const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css",
};

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((request, response) => {
    let uri = url.parse(request.url).pathname;
    let fileName = path.join(process.cwd(), unescape(uri));
    console.log("Loading... " + uri);
    let stats;

    try {
        stats = fs.lstatSync(fileName);
    } catch(e) {
        response.writeHead(404, {"Content-type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
    }

    if(stats.isFile()) {
        let mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        response.writeHead(200, {"Content-type": mimeType});
        let fileStream = fs.createReadStream(fileName);
        fileStream.pipe(response);
    } else if(stats.isDirectory()) {
        response.writeHead(302, {"Location": "index.html"});
        response.end();
    } else {
        response.writeHead(500, {"Content-type": "text/plain"});
        response.write("500 Internal Error\n");
    }
});

server.listen(port);
