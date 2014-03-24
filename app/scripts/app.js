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
		.when('/', {
			templateUrl: 'views/splash.html',
			controller: 'SplashCtrl'
		})
		.when('/new', {
			templateUrl: 'views/playlist.html',
			controller: 'PlaylistCtrl'
		})
		.when('/:hash', {
			templateUrl: 'views/playlist.html',
			controller: 'PlaylistCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
});
