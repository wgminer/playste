'use strict';

angular.module('musicApp')
	.factory('UrlService', function () {

		var apiUrl = function() {

			// if (location.hostname == '127.0.0.1 ' || location.hostname == 'localhost') {

				var url = 'http://localhost/ng-music/api/index.php/';

			// } else {

			// 	// Production URL

			// }

			return url;

		}

		return {
			apiUrl: apiUrl
		}

	});


