'use strict';

angular.module('musicApp')
  	.controller('PlaylistCtrl', function ($scope, $rootScope, $route, $routeParams, $timeout, $location, _, PlayerService, UserService, PlaylistService, YoutubeAPI, SoundCloudAPI) {

  		// Masthead functions
  		
  		/**
  		 * Check if playlist is saved
  		 * @return {Boolean}
  		 */
  		$scope.isSaved = function() {

  			var text = 'Save';
  			var isSaved = false;

  			if ($scope.origPlaylist) {
  				
	  			if (angular.toJson($scope.origPlaylist.songs) == angular.toJson($scope.playlist.songs)) {
	  				text = 'Saved';
	  				isSaved = true;
	  			}

	  		}

	  		$scope.saveButtonText = text;

  			return isSaved;

  		}

  		/**
  		 * Save the playlist or create a new one if it's new
  		 * @return {undefined}
  		 */
  		$scope.savePlaylist = function() {

  			function createPlaylist(newPlaylist) {
  				if (newPlaylist.length > 1) {

		  			PlaylistService.createPlaylist(newPlaylist)
		  				.then(function(callback){
		  					$location.path(callback);
		  				}, function(error) {
		  					console.log(error);
		  				});

		  		} else {
		  			alert('You can\'t have a playlist with only one song!');
		  		}
  			}

  			// If playlist is NOT saved
  			if (!$scope.isSaved()) {

	  			// If playlist exists
	  			if ($routeParams.hash) {

	  				// console.log($rootScope.User, $scope.playlist.info.users, checkUsers($rootScope.User.id, $scope.playlist.info.users));

	  				// is this an owner?
	  				if ($rootScope.User && $scope.playlist.info.users && checkUsers($rootScope.User.id, $scope.playlist.info.users)) {

			  			PlaylistService.updatePlaylist($routeParams.hash, $scope.playlist.songs)
			  				.then(function(callback){
			  					console.log('updated: ' + callback);
			  					$scope.origPlaylist = angular.copy($scope.playlist);
			  				}, function(error) {
			  					console.log(error);
			  				});

			  		} else {

						createPlaylist($scope.playlist.songs);

			  		}

	  			// Else create a new playlist	
	  			} else {

		  			createPlaylist($scope.playlist.songs);

		  		}

		  	}

  		}

  		/**
  		 * Add a song to the playlist
  		 * TODO: Refactor into directive...
  		 * @param {string} url
  		 */
		$scope.addSong = function(url) {

			function userName() {

  				if ($rootScope.User.name) {
  					return $rootScope.User.name;
  				} else {
  					return 'Anonymous';
  				}
  			}

			if (!$scope.addingSong) {

				$scope.origPlaylist = angular.copy($scope.origPlaylist);

	  			$scope.addingSong = 'started';

	  			if (url == undefined){

	  				alert('Don\'t leave it blank!');
		  			$scope.addingSong = false;

	  			} else if (url.indexOf('youtu') > -1) {

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
		  						name: userName()
		  					}

		  					$scope.addingSong = 'finish';

		  					$timeout(function(){
		  						$scope.playlist.songs.unshift(newSong);
			  					$scope.addingSong = false;
			  					$scope.newSongUrl = '';
		  					}, 500);

	
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
		  						name: userName()
		  					}

		  					$scope.addingSong = 'finish';

		  					$timeout(function(){
		  						$scope.playlist.songs.unshift(newSong);
			  					$scope.addingSong = false;
			  					$scope.newSongUrl = '';
		  					}, 500);
		  					
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

  		/**
  		 * Toggle the play/pause of a song
  		 * TODO: Directive-ize
  		 * @return {undefined}
  		 */
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

		/**
		 * Go back a song
		 * @return {undefined}
		 */
		$scope.previous = function() {
			alert('This does nothing at the moment...');
		}

		/**
		 * Progress to next song
		 * @return {undefined}
		 */
		$scope.next = function() {
			PlayerService.setPlayerStatus(0);
		}


  		// Playlist functions

  		/**
  		 * Create a new player when user clicks on song thumbnail
  		 * TODO: this REALLY needs to be a directive...
  		 * @param  {object} song
  		 * @param  {integer} index
  		 * @param  {object} element
  		 * @return {undefined}
  		 */
 		$scope.createPlayer = function(song, element) {

			if (element.jquery) { // if jquery element
				var $node = element.closest('.media');
			} else {
				var $node = $(element).closest('.media');
			}

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

				    // Bind all the SC events to the player...
			
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


    	/**
    	 * Keep the playing song in the user's view
    	 * @param  {object} element
    	 * @return {undefined}
    	 */
    	$scope.scrollView = function(element) {

   //  		if (element.jquery) { // if jquery element
			// 	var $song = element.closest('.song');
			// } else {
			// 	var $song = $(element).closest('.song');
			// }

			// var offset = $song.offset().top;
			// $('html, body').scrollTop(offset-100);
			// console.log(offset);

    	}

    	/**
    	 * Play the first song in the list
    	 * @return {undefined}
    	 */
    	$scope.playFirst = function() {
    		console.log($('.song').first().children('.media'));
    		$scope.createPlayer($scope.playlist[0], 0, $('.song').first().children('.media'));
    	};


    	/**
    	 * Move the song up or down in the playlist
    	 * @param  {integer} current_index
    	 * @param  {integer} destination_index
    	 * @return {undefined}
    	 */
    	$scope.shift = function(current_index, destination_index) {

    		$scope.playlist.songs.splice(destination_index, 0, $scope.playlist.songs.splice(current_index, 1)[0]);

    	}

    	/**
    	 * Remove the song from the playlist
    	 * @param  {integer} index
    	 * @return {undefined}
    	 */
    	$scope.remove = function(index) {

    		$scope.playlist.songs.splice(index, 1);

    	}

    	$scope.toggleLoginModal = function() {
		    $scope.modalShown = !$scope.modalShown;
		};

		$scope.toggleDropdown = function() {
		    $scope.isDropdownVisible = !$scope.isDropdownVisible;
		};

		$scope.signOut = function() {
			UserService.unauthUser()
				.then(function(){
					$location.url('/new');
					$scope.isDropdownVisible = false;
					$rootScope.isAuthed = false;
				});
		}


    	// Private Methods
    	
    	var checkUsers = function(userId, users) {

    		if (Array.isArray(users)) {

				for (var i = 0; i < users.length; i++) {

	    			console.log(userId, users[i].userId);

	    			if (userId == users[i].userId) {
	    				return true;
	    			}
	    		}

	    		return false;

			} else {

				if (userId == users.userId) {
    				return true;
    			} else {
    				return false;
    			}

			}

    	}
    	
		/**
		 * When YT player is ready
		 * @param  {???} event
		 * @return {undefined}
		 */
		var onPlayerReady = function (event) {
		    event.target.playVideo();
		}

		/**
		 * When YT player status changes...$apply it...
		 * @param  {???} event
		 * @return {[type]}
		 */
    	var playerEvents = function (event) {
			PlayerService.setPlayerStatus(event.data);
			$scope.$apply();
		}

		/**
		 * Run everything...
		 * @return {[type]}
		 */
		var init = function() {

			$scope.isDropdownVisible = false;

			if ($routeParams.hash) {

				// Get playlist from server
				PlaylistService.getPlaylist($routeParams.hash)
					.then(function(playlist) {

						console.log(playlist.info.users);

						// Add playlist to scope
						$scope.playlist = playlist;

						// Create copy to compare changes against later
						$scope.origPlaylist = angular.copy($scope.playlist);
					});

			} else {

				// Create an empty playlist object
				$scope.playlist = {'songs': [], 'playlist': {}};

			}

			/**
			 * Watch the player status for changes
			 * @param  {object} status
			 * @return {undefined}
			 */
			$scope.$watch(PlayerService.getPlayerStatus, function(status) {

				$scope.playerStatus = status;

				if (status === 0) {
					
					var sortOrder = parseInt(PlayerService.getPlayerData().sortOrder) + 1;
					var $next = PlayerService.getPlayerElement()
						.parent()
						.next();

					console.log($scope.playlist.songs[sortOrder], sortOrder);
					
					$scope.createPlayer($scope.playlist.songs[sortOrder], $next.children('.media'));
				}

			}, true);

			/**
			 * Watch for changes to the currently playing song
			 * @param  {[type]} data
			 * @return {[type]}
			 */
			$scope.$watch(PlayerService.getPlayerData, function(data) {
				$scope.playing = data;
			}, true);

		}

  		init();

  	});
