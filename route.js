exports.route = function(paths) {
    var n = paths.length;
    for(var i=0; i<n; i++) {
        var url = paths[i].url;
        paths[i].url = new RegExp(url.replace(/{}/g, '[a-zA-Z0-9._]');
        paths[i].generate = url;
    }
    
    var reroute = function(fn) {
        for(var i=0; i<n; i++) {
            var p = paths[i];
            if(p.all === fn || p.get === fn || p.post === fn || p.put === fn || p['delete'] === fn)
                break;
        }
        var url = paths[i].generate;
        for(var i=0; i<arguments.length; i++) 
            url.replace(/{}/, arguments[i]);
        return url;
    };
    
    return function(request, response) {
        for(var i=0; i<n; i++) {
            var p = paths[i], 
                match = p.url.exec(decodeURIComponent(request.url)),
                f = p.all || p[request.method.toLowerCase()];
            if(match && f) {
                if(request.method === 'POST' || request.method === 'PUT') 
                    getpost(request, response, reroute, f, match);
                else 
                    f(request, response, reroute, '', match);
            }
        }
    }
}

function getpost(request, response, reroute, f, match) {
    var text = '';
    request.addListener('data', function(chunk) { text += chunk; });
    request.addListener('end', function() {
        f(request, response, reroute, text, match);
    });
}
