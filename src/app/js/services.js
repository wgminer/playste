app.factory('Api', function ($q, $firebaseObject) {

    return {
        newUser: function (user) {
            var ref = new Firebase('https://playste.firebaseio.com/users');
            var newUserRef = ref.push(user);
            return newUserRef.key();
        },
        newApp: function (app) {
            var ref = new Firebase('https://playste.firebaseio.com/applications');
            var newAppRef = ref.push(app);
            return newAppRef.key();
        },
        syncApp: function (uid) {
            var ref = new Firebase('https://playste.firebaseio.com/applications/' + uid);
            return $firebaseObject(ref);
        }
    }

});

app.factory('Playlist', function ($state, $firebaseObject, YouTube, SoundCloud) {

    var module = {};
    var ref = new Firebase('https://playste.firebaseio.com/playlists');
    var playlist = false;

    var generateUID = function (snapshot, length) {

        generate = function () {
            var chars = 'abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890'
            var rand = _.sample(chars, length || 12)
            return rand.join('');
        }

        var uid = generate();

        while (snapshot.child(uid).exists()) {
            uid = generate();
        }

        return uid;
    }

    module.create = function (song) {
        ref.once('value', function(snapshot) {
            uid = generateUID(snapshot, 5);
            song.timestamp = Date.now();
            ref.child(uid).push(song);
            $state.go('playlist', {id: uid});
        });
    }

    module.resolveUrl = function (url, callback) {
        if (url != '') {
            if (url.indexOf('youtu') > -1) {
                YouTube.newYTSong(url)
                    .then(function (song) {
                        song.timestamp = Date.now();
                        callback(song);
                    }, function (error) {
                        console.log(error);
                    });
            } else if (url.indexOf('soundcloud') > -1) {
                SoundCloud.newSCSong(url)
                    .then(function (song) {
                        song.timestamp = Date.now();
                        callback(song);
                    }, function (error) {
                        console.log(error);
                    });
            }
        }
    }

    return module;

});

app.factory('YouTube', function ($http, $q) {

    var ytAPIKey = 'AIzaSyBbHFX8Vfs6JA3U0QVO55QqAkg7QMAm8_0';

    var newYTSong = function(url) {

        if (url.lastIndexOf('?v=') > -1) {
            var start = url.lastIndexOf('?v=') + 3;
        } else if (url.lastIndexOf('.be/') > -1) {
            var start = url.lastIndexOf('.be/') + 4;
        } else {
            return 'error!';
        }

        var ytID = url.substring(start, start+11);
        var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+ytID+'&key='+ytAPIKey;
        var deferred = $q.defer();

        $http.get(url)
            .success(function(data){

                if (data.items[0].snippet.thumbnails.maxres) {
                    var imageUrl = data.items[0].snippet.thumbnails.maxres.url;
                } else if (data.items[0].snippet.thumbnails.high) {
                    var imageUrl = data.items[0].snippet.thumbnails.high.url;
                } else {
                    var imageUrl = data.items[0].snippet.thumbnails.default.url;
                }

                var newSong = {
                    title: data.items[0].snippet.title,
                    image_url: imageUrl,
                    source: 'youtube',
                    source_id: data.items[0].id,
                    source_url: 'https://www.youtube.com/watch?v='+data.items[0].id
                }
                deferred.resolve(newSong);
            })
            .error(function(){
                deferred.reject();
            });

        return deferred.promise;

    }

    return {
        newYTSong: newYTSong
    }

});

app.factory('SoundCloud', function ($http, $q) {

    var newSCSong = function(url) {

        SC.initialize({
            client_id: 'e732213f2ca2d1ca96c10924da125f83'
        });

        var deferred = $q.defer();

        SC.get('/resolve', { url: url }, function(data) {

            console.log(data);

            if (data.embeddable_by != 'me') {

                if (data.artwork_url) {
                    var image = data.artwork_url;
                } else {
                    var image = data.user.avatar_url;
                }
                    
                var newSong = {
                    title: data.title,
                    image_url: image.replace('large', 't500x500'),
                    source: 'soundcloud',
                    source_id: data.id,
                    source_url: data.permalink_url,
                }
                deferred.resolve(newSong);

            } else {
                deferred.resolve(false);
            }

        });

        return deferred.promise;

    }

    return {
        newSCSong: newSCSong
    }

});