'use strict';

angular.module('musicApp')
	.factory('PlaylistService', function ($http, $q, UrlService) {

		var url = UrlService.apiUrl();

		/**
		 * Post's playlist to server
		 * @param  {object} newPlaylist
		 * @return {undefined}
		 */
		var createPlaylist = function(newPlaylist) {

			var deferred = $q.defer();

			$http.post(url+'playlists', newPlaylist)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		/**
		 * Grabs playlist fronm server
		 * @param  {string} hash
		 * @return {object}
		 */
		var getPlaylist = function(hash) {

			var deferred = $q.defer();

			$http.get(url+'playlists/'+hash)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		/**
		 * Grabs playlist fronm server
		 * @param  {string} hash
		 * @return {object}
		 */
		var getUserPlaylists = function(userId) {

			var deferred = $q.defer();

			$http.get(url+'userplaylists/'+userId)
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
		var updatePlaylist = function(hash, updatedPlaylist) {

			var deferred = $q.defer();

			$http.post(url+'playlists/'+hash, updatedPlaylist)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		var deletePlaylist = function(id) {

			var deferred = $q.defer();

			$http.post(url+'playlists/delete/'+id)
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
			createPlaylist: createPlaylist,
			getPlaylist: getPlaylist,
			getUserPlaylists: getUserPlaylists,
			updatePlaylist: updatePlaylist,
			deletePlaylist: deletePlaylist
		};

	});

	