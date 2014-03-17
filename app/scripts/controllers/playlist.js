'use strict';

angular.module('musicApp')
  	.controller('PlaylistCtrl', function ($scope, $rootScope, PlayerService, PlaylistService) {

 		$scope.createPlayer = function(song, index, element) {

			if (element.jquery) { // if jquery element
				var $node = element.closest('.media');
			} else {
				var $node = $(element).closest('.media');
			}

    		song.index = index;

    		$('.media iframe').remove();
    		$('.playing').removeClass('playing');

    		$node.parent('.song').addClass('playing');
    		
    		PlayerService.setPlayerElement($node);
    		PlayerService.setPlayerData(song);

    		if (song.source == 'youtube') {

    			var $sacrifice = $('<div id="player"></div>');
    			$node.prepend($sacrifice);
    		
	    		var newPlayer = new YT.Player('player', {
			        videoId: song.sourceID,
			        playerVars: {
			            wmode: 'opaque',
			            showinfo: 0,
			            modestbranding: 1
			        },
			        events: {
			        	'onReady': onPlayerReady,
			            'onStateChange': playerEvents
			        }
			    });

			    PlayerService.setPlayer(newPlayer);

			} else if (song.source == 'soundcloud') {

    			SC.oEmbed(song.url, {auto_play: true}, function(oembed){

    				PlayerService.setPlayerStatus(1);

				    $node.prepend(oembed.html);

				    var newPlayer = SC.Widget($node.children()[0]);

				    PlayerService.setPlayer(newPlayer);
				    $scope.$apply();
			
		          	newPlayer.bind(SC.Widget.Events.FINISH, function(eventData) {
		            	PlayerService.setPlayerStatus(0);
		            	$scope.$apply();
		          	});

		          	newPlayer.bind(SC.Widget.Events.PLAY, function(eventData) {
		            	PlayerService.setPlayerStatus(1);
		            	$scope.$apply();
		          	});

		          	newPlayer.bind(SC.Widget.Events.PAUSE, function(eventData) {
		            	PlayerService.setPlayerStatus(2);
		            	$scope.$apply();
		          	});

				});

			}			    

    	}

    	$scope.scrollView = function(element) {

    		if (element.jquery) { // if jquery element
				var $song = element.closest('.song');
			} else {
				var $song = $(element).closest('.song');
			}

			var offset = $song.offset().top;
			$('html, body').scrollTop(offset-100);
			console.log(offset);

    	}

    	$rootScope.playFirst = function() {
    		console.log($('.song').first().children('.media'));
    		$scope.createPlayer($scope.playlist[0], 0, $('.song').first().children('.media'));
    	};


    	// Private Methods

		var onPlayerReady = function (event) {
		    event.target.playVideo();
		}

    	var playerEvents = function (event) {
			PlayerService.setPlayerStatus(event.data);
			$scope.$apply();
		}

		var init = function() {

			$scope.$watch(PlayerService.getPlayerStatus, function(status) {
				$scope.playingStatus = status
				if (status === 0) {
					var index = PlayerService.getPlayerData().index + 1;
					var $next = PlayerService.getPlayerElement()
						.parent()
						.next();
					$scope.createPlayer($scope.playlist[index], index, $next.children('.media'));
				}
			}, true);

			$scope.$watch(PlayerService.getPlayerData, function(data) {
				$scope.playing = data;
			}, true);

			$scope.$watch(PlaylistService.getPlaylist, function(data) {
				$scope.playlist = data;
			}, true);

		}

  		init();

  	});
