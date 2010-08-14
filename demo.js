var http = require('http'),
    route = require('./route').route;

var x = function(request, response, reroute, match, text) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(JSON.stringify(match));
}

var y = function(request, response, reroute, match, text) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('404 ' + request.url + ' ' + reroute('complex', 4, 'nime') );
}

var f = route([
    {url:'^/hi/{}$', name:'base', all:x},
    {url:'^/bye/{}/{}$', name: 'complex', all: x},
    {url:'^', name:'all', all:y}
]);

http.createServer(f).listen(8882);

