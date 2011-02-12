dojo.ready(function() {
    var uri = window.location.href;
    var query = uri.substring(uri.indexOf('?') + 1, uri.length);
    var parms = dojo.queryToObject(query);

    var book_url = 'http://tarheelreader.org/' + parms.book;
    var tune_url = 'http://' + parms.tune;
    var times = [];
    if (parms.times) {
        times = dojo.map(parms.times.split(','), function(t) {
            var m = /((\d+):)?(\d+)(\.\d+)?/.exec(t);
            var minutes = m[2] && parseFloat(m[2]) || 0;
            var seconds = parseFloat(m[3]+m[4]);
            return minutes * 60 + seconds;
        });
    }
    console.log(times);

    var iframe = dojo.create('iframe', { src: book_url },
                              dojo.byId('frame'));
    
    soundManager.onready(function() {
        var tune = soundManager.createSound({
            id: 'tune',
            url: tune_url
        });
        dojo.forEach(times, function(t, i) {
            var ms = t * 1000;
            var url = book_url + (i+2) + '/';
            tune.onposition(ms, function() {
                console.log('op', ms, url);
                iframe.src = url;
            });
        });
        dojo.connect(dijit.byId('pause'), 'onClick', function() {
            if (tune.paused) {
                tune.resume();
            } else {
                tune.pause();
            }
        });
        soundManager.play('tune');
    });
});
