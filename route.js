exports.route = function(paths) {
    var n = paths.length, lookup = {};
    for(var i=0; i<n; i++) {
        var p = paths[i],
            url = p.url.replace(/^\^/, '').replace(/\$$/, '');
        p.generate = url;
        p.url = new RegExp('^' + url.replace(/{}/g, '([a-zA-Z0-9._]*)') + '$');
        lookup[p.name] = i;
    }
    
    var reroute = function(name) {
        var url = paths[lookup[name]].generate;
        for(var i=1; i<arguments.length; i++) 
            url = url.replace(/{}/, arguments[i]);
        return url;
    };
    
    return function(request, response) {
        for(var i=0; i<n; i++) {
            var p = paths[i], 
                match = p.url.exec(decodeURIComponent(request.url)),
                f = p.all || p[request.method.toLowerCase()];
            if(match && f) {
                if(request.method === 'POST' || request.method === 'PUT') 
                    getpost(request, response, match, f, reroute);
                else 
                    f(request, response, match, '', reroute);
                return 200;
            }
        }
        return 404;
    }
}

function getpost(request, response, match, f, reroute) {
    var text = '';
    request.addListener('data', function(chunk) { text += chunk; });
    request.addListener('end', function() {
        f(request, response, match, text, reroute);
    });
}
