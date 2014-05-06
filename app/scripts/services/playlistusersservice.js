'use strict';

angular.module('musicApp')
	.factory('PlaylistUsersService', function ($http, $q, UrlService) {

		var url = UrlService.apiUrl();

		/**
		 * Post's playlist to server
		 * @param  {object} newPlaylist
		 * @return {undefined}
		 */
		var addPlaylistUser = function(newPlaylist) {

			var deferred = $q.defer();

			$http.post(url+'playlistusers', newPlaylist)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		/**
		 * Grabs playlists from server
		 * @param  {string} hash
		 * @return {object}
		 */
		var getPlaylistUsers = function(userId) {

			var deferred = $q.defer();

			$http.get(url+'playlistusers/'+userId)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		/**
		 * Updates the playlist on the server
		 * @param  {string} hash
		 * @param  {object} updatedPlaylist
		 * @return {???}
		 */
		var removePlaylistUser = function(hash, updatedPlaylist) {

			var deferred = $q.defer();

			$http.post(url+'playlistusers/'+hash, updatedPlaylist)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		// Public API

		return {
			addPlaylistUser: addPlaylistUser,
			getPlaylistUsers: getPlaylistUsers,
			removePlaylistUser: removePlaylistUser
		};

	});

	