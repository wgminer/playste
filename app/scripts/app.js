'use strict';

angular.module('musicApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ngAnimate'
])
.config(function ($routeProvider) {
	$routeProvider
		.when('/new', {
			templateUrl: 'views/playlist.html',
			controller: 'PlaylistCtrl'
		})
		.when('/:hash', {
			templateUrl: 'views/playlist.html',
			controller: 'PlaylistCtrl'
		})
		.otherwise({
			redirectTo: '/new'
		});
});
