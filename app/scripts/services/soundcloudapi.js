'use strict';

angular.module('musicApp')
	.factory('SoundCloudAPI', function ($http, $q) {

		var scAPIKey = 'e0ac220c7f34ae5602f816d9b51e12e3';

		var getSCSongData = function(url) {

			SC.initialize({
				client_id: scAPIKey
			});

			var deferred = $q.defer();

			SC.get('/resolve', { url: url }, function(data) {
				
				deferred.resolve(data);

			});

			return deferred.promise;

		}

		return {
			getSCSongData: getSCSongData
		}

	});