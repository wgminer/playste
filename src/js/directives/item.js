app.directive('plItem', function ($http, $rootScope, YouTube, SoundCloud, Playlist) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            const $element = $(element);

            $element.dblclick(() => {

                console.log(scope.item);

                // console.log(SC);

                SC.stream('/tracks/' + scope.item.source_id)
                    .then(function(player){
                        console.log(player);
                        player.play();
                    });
            });
    
        }
    }

});