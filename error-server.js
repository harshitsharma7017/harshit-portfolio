const http = require('http');
http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    console.log("CLIENT ERROR:", body);
    res.end('ok');
  });
}).listen(9999);
console.log("Listening on 9999");
