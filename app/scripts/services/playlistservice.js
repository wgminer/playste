'use strict';

angular.module('musicApp')
	.factory('PlaylistService', function () {

		var playlist = [];

		var addToPlaylist = function(newSong) {
			playlist.unshift(newSong);
		}

		var getPlaylist  = function() {
			return playlist;
		}


		// Public API

		return {
			addToPlaylist: addToPlaylist,
			getPlaylist: getPlaylist
		};

	});

	