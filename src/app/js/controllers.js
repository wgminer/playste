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

    $scope.submit = function (url) {
        Playlist.resolveUrl(url, function (song) {
            ref.push(song);
            $scope.url = '';
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