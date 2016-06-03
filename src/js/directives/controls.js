app.directive('plControls', function ($http, $rootScope, YouTube, SoundCloud, Playlist) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            scope.playing = false;
    
        }
    }

});