app.controller('SplashCtrl', function ($scope, $rootScope, $firebaseObject, Playlist, YouTube, SoundCloud) {

    $scope.submit = function (url) {
        Playlist.resolveUrl(url, function (song) {
            Playlist.create(song);
            $scope.url = '';
        });
    }

});

app.controller('PlaylistCtrl', function ($scope, $rootScope, $stateParams, $firebaseArray, Playlist, YouTube, SoundCloud) {

    var ref = new Firebase('https://playste.firebaseio.com/playlists/' + $stateParams.id);

    ref.on('value', function(snapshot) { 
        $scope.playlist = [];
        var obj = snapshot.val();
        for (var key in obj) {
            obj[key].$uid = key;
            $scope.playlist.unshift(obj[key]);
        }
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    });

    $scope.duration = function (ms) {
        var sec = Math.round(ms / 1000);
        var hours   = Math.floor(sec / 3600);
        var minutes = Math.floor((sec - (hours * 3600)) / 60);
        var seconds = sec - (hours * 3600) - (minutes * 60);

        // if (hours   < 10) {
        //     hours = '0' + hours;
        // }

        if (minutes < 10 && hours != 0) {
            minutes = '0' + minutes;
        }

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        if (hours == 0) {
            hours = ''
        } else {
            hours += ':'
        }

        if (hours == 0 && minutes == '00') {
            minutes = ''
        } else {
            minutes += ':'
        }

        if (hours == 0 && minutes == '00' && seconds == '00') {
            return;
        }

        return hours + minutes + seconds;
    }

    $scope.submit = function (url) {
        Playlist.resolveUrl(url, function (song) {
            ref.push(song);
            $scope.url = '';
            $scope.urlValid = false;
        });
    }

    $scope.urlValid = false;
    $scope.isValid = function (url) {
        if (url != '' && (url.indexOf('youtu') > -1 || url.indexOf('soundcloud') > -1)) {
            $scope.urlValid = true;
        } else {
            $scope.urlValid = false;
        }
    }

});