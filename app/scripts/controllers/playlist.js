'use strict';

angular.module('musicApp')
  	.controller('PlaylistCtrl', function ($scope, $route, $routeParams, $location, PlayerService, PlaylistService, YoutubeAPI, SoundCloudAPI) {

  		// Masthead functions
  		
  		$scope.isSaved = function() {

  			var text = 'Save';
  			var isSaved = false;

  			if ($scope.origPlaylist) {

	  			if ($scope.origPlaylist.songs.compare(removeHashkey($scope.playlist.songs))) {
	  				text = 'Saved';
	  				isSaved = true;
	  			}

	  			console.log($scope.origPlaylist.songs.compare(removeHashkey($scope.playlist.songs)));

	  		}

	  		$scope.saveButtonText = text;
  			return isSaved;

  		}


  		$scope.savePlaylist = function() {

  			console.log($scope.playlist);

  			// If playlist is NOT saved
  			if (!$scope.isSaved()) {

	  			// If playlist exists just update it
	  			if ($routeParams.hash) {

	  				var updatedPlaylist = $scope.playlist.songs;

		  			if (updatedPlaylist.length > 1) {

			  			PlaylistService.updatePlaylist($routeParams.hash, updatedPlaylist)
			  				.then(function(callback){
			  					console.log('updated: ' + callback);
			  					$route.reload();
			  				}, function(error) {
			  					console.log(error);
			  				});

			  		}

	  			// Else create a new playlist	
	  			} else {

		  			var newPlaylist = $scope.playlist.songs;

		  			if (newPlaylist.length > 1) {

			  			PlaylistService.createPlaylist(newPlaylist)
			  				.then(function(callback){
			  					console.log('new: ' + callback);
			  					$location.path(callback);
			  				}, function(error) {
			  					console.log(error);
			  				});

			  		} else {
			  			alert('You can\'t have a playlist with only one song!');
			  		}
		  		}

		  	}

  		}

		$scope.addSong = function(url) {

			if (!$scope.addingSong) {

				$scope.origPlaylist = angular.copy($scope.origPlaylist);

	  			$scope.addingSong = true;

	  			if (url.indexOf('youtu') > -1) {

		  			YoutubeAPI.getYTSongData(url)
		  				.then(function(data){

		  					if (data.items[0].snippet.thumbnails.maxres) {
		  						var imageUrl = data.items[0].snippet.thumbnails.maxres.url;
		  					} else {
		  						var imageUrl = data.items[0].snippet.thumbnails.high.url;
		  					}

		  					var newSong = {
		  						title: data.items[0].snippet.title,
		  						image: imageUrl,
		  						url: 'https://www.youtube.com/watch?v='+data.items[0].id,
		  						source: 'youtube',
		  						sourceId: data.items[0].id,
		  					}

		  					$scope.playlist.songs.unshift(newSong);
		  					
		  					$scope.addingSong = false;
		  					$scope.newSongUrl = '';
		  				}, function(error){
		  					console.log(error);
		  					alert('Something went wrong');
		  				});

		  		} else if (url.indexOf('soundcloud') > -1) {

		  			SoundCloudAPI.getSCSongData(url)
		  				.then(function(data){

		  					if (data.artwork_url) {
		  						var image = data.artwork_url;
		  					} else {
		  						var image = data.user.avatar_url;
		  					}

		  					var newSong = {
		  						title: data.title,
		  						image: image.replace('large', 't500x500'),
		  						url: data.permalink_url,
		  						source: 'soundcloud',
		  						sourceId: data.id,
		  					}

		  					$scope.playlist.songs.unshift(newSong);

		  					$scope.addingSong = false;
		  					$scope.newSongUrl = '';
		  				}, function(error){
		  					console.log(error);
		  					alert('Something went wrong');
		  				});

		  		} else {

		  			alert('Not a valid source');
		  			$scope.addingSong = false;

		  		}

		  	}

  		}

  		$scope.togglePlay = function() {

  			if (PlayerService.getPlayerStatus() == 2) {

				if (PlayerService.getPlayerData().source == 'youtube'){
					PlayerService.getPlayer().playVideo();
				} else if(PlayerService.getPlayerData().source == 'soundcloud'){ 
					PlayerService.getPlayer().play();
				}

			} else if (PlayerService.getPlayerStatus() == 1) {

				if (PlayerService.getPlayerData().source == 'youtube'){
					PlayerService.getPlayer().pauseVideo();
				} else if(PlayerService.getPlayerData().source == 'soundcloud'){ 
					PlayerService.getPlayer().pause();
				}
			
			} else {

				$scope.playFirst();

			}
		}

		$scope.previous = function() {
			alert('This does nothing at the moment...');
		}

		$scope.next = function() {
			PlayerService.setPlayerStatus(0);
		}


  		// Playlist functions

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
			        videoId: song.sourceId,
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

    	$scope.playFirst = function() {
    		console.log($('.song').first().children('.media'));
    		$scope.createPlayer($scope.playlist[0], 0, $('.song').first().children('.media'));
    	};


    	$scope.shift = function(current_index, destination_index) {

    		$scope.playlist.songs.splice(destination_index, 0, $scope.playlist.songs.splice(current_index, 1)[0]);

    	}

    	$scope.remove = function(index) {

    		$scope.playlist.songs.splice(index, 1);

    	}


    	// Private Methods
    	
    	var removeHashkey = function(array) {
		    var output;

		    output = angular.toJson(array);
		    output = angular.fromJson(output);

		    return output;
		}

		Array.prototype.compare = function (array) {
		    // if the other array is a falsy value, return
		    if (!array)
		        return false;

		    // compare lengths - can save a lot of time
		    if (this.length != array.length)
		        return false;

		    for (var i = 0, l=this.length; i < l; i++) {
		        // Check if we have nested arrays
		        if (this[i] instanceof Array && array[i] instanceof Array) {
		            // recurse into the nested arrays
		            if (!this[i].compare(array[i]))
		                return false;
		        }
		        else if (this[i] != array[i]) {
		            // Warning - two different object instances will never be equal: {x:20} != {x:20}
		            return false;
		        }
		    }
		    return true;
		}
		
		var onPlayerReady = function (event) {
		    event.target.playVideo();
		}

    	var playerEvents = function (event) {
			PlayerService.setPlayerStatus(event.data);
			$scope.$apply();
		}

		var init = function() {

			if ($routeParams.hash) {

				// Get playlist from server
				PlaylistService.getPlaylist($routeParams.hash)
					.then(function(playlist) {

						// Add playlist to global
						$scope.playlist = playlist;

						// Create copy to compare changes to
						$scope.origPlaylist = angular.copy($scope.playlist);
					});

			} else {

				// Create an empty playlist object
				$scope.playlist = {'songs': [], 'playlist': {}};

			}

			$scope.$watch(PlayerService.getPlayerStatus, function(status) {
				$scope.playingStatus = status
				if (status === 0) {
					var index = PlayerService.getPlayerData().index + 1;
					var $next = PlayerService.getPlayerElement()
						.parent()
						.next();
					$scope.createPlayer($scope.playlist.songs[index], index, $next.children('.media'));
				}
			}, true);

			$scope.$watch(PlayerService.getPlayerData, function(data) {
				$scope.playing = data;
			}, true);


			$scope.$watch(PlayerService.getPlayerData, function(data) {

				$scope.playing = data;

			}, true);

			$scope.$watch(PlayerService.getPlayerStatus, function(status) {

				$scope.playerStatus = status;

			}, true);

		}

  		init();

  	});
