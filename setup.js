dojo.ready(function() {
    var bookCtrl = dijit.byId('book');
    var tuneCtrl = dijit.byId('tune');
    var urlCtrl = dojo.byId('url');

    var times = [];
    var bookURL, tuneURL, testURL;

    var page;
    var tune;

    var getTimings = function() {
        page = 1;
        times = [];
        updateURL();
        console.log('tune', tuneURL);
        tune = soundManager.createSound({
            id: 'tune',
            url: tuneURL
        });

        dojo.query('#info').addClass('hidden');
        dojo.query('#controls').removeClass('hidden');
        dojo.query('#frame').removeClass('hidden');

        console.log(bookURL);

        setPage(1);
        tune.play();
    };
    dojo.connect(dijit.byId('play'), 'onClick', getTimings);

    var updateURL = function() {
        bookURL = bookCtrl.attr('value');
        tuneURL = tuneCtrl.attr('value');
        dijit.byId('play').attr('value', tuneURL.length>0);
        bookParm = 'book=' + encodeURIComponent(bookURL.replace('http://tarheelreader.org/', ''));
        tuneParm = 'tune=' + encodeURIComponent(tuneURL.replace('http://', ''));
        var url = window.location.href.replace('setup.html', '');
        url = url + '?' + bookParm + '&' + tuneParm;
        if (times.length > 0) {
            url = url + '&' + 't=' + times.join(',');
        }
        testURL = url;
        urlCtrl.innerHTML = url.replace('&','&amp;');
    };
    dojo.connect(bookCtrl, 'onChange', updateURL);
    dojo.connect(tuneCtrl, 'onChange', updateURL);
    updateURL();

    var setPage = function(page) {
        var suffix = '';
        if (page > 1) {
            suffix = page + '/';
        }
        dojo.query('iframe').attr('src', bookURL + suffix);
    };

    dojo.connect(dijit.byId('pause'), 'onClick', function() {
        if (tune) {     
            if (tune.paused) {
                tune.resume();
            } else {
                tune.pause();
            }
        }
    });
    dojo.connect(dijit.byId('turn'), 'onClick', function() {
        page += 1;
        setPage(page);
        if (tune) {
            var t = tune.position;
            t = Math.floor(t/100)/10.0;
            times.push(t);
            console.log(times);
        }
    });
    dojo.connect(dijit.byId('done'), 'onClick', function() {
        tune.destruct();
        var pt = dojo.byId('pagetimes');
        dojo.empty(pt);
        var fixTimes = function() {
            console.log('time change');
            var spinners = dojo.query('.dijitSpinner', pt);
            times = spinners.map(function(spinner) {
                return dijit.byNode(spinner).attr('value');
            });
            console.log('update times', times);
            updateURL();
        };
        dojo.create('li', { innerHTML: '0.0' }, pt);
        dojo.forEach(times, function(t) {
            var li = dojo.create('li', {}, pt);
            var tb = new dijit.form.NumberSpinner({
                value: t,
                smallDelta: 0.1,
                intermediateChanges: true,
                constraints: {
                    min: 0.0,
                    places: 1
                },
                onChange: fixTimes,
                style: 'width: 60px'
            });
            dojo.place(tb.domNode, li);
        });
        dojo.query('#info').removeClass('hidden');
        dojo.query('#controls').addClass('hidden');
        dojo.query('#frame').addClass('hidden');
        updateURL();
    });
    dojo.connect(dijit.byId('test'), 'onClick', function() {
        window.open(testURL, 'test');
    });


});
