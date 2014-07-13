'use strict';

angular.module('musicApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'angularMoment'
])
.run(function($rootScope, $http, $location, UserService){

	// WHEN THE APP FIRST RUNS
	UserService.getAuthedUser()
		.then(function(callback){
			$rootScope.User = callback;
			$rootScope.isAuthed = true;
			console.log('logged in as: ' + $rootScope.User.name);
		},function(error){
			$rootScope.isAuthed = false;
		});

	// WHEN EVER YOU GO TO A PAGE THAT IS RESTRICTED...
	$rootScope.$on('$routeChangeStart', function(current, next) {
		if (next.requireLogin) {
			UserService.getAuthedUser()
				.then(function(callback){
					console.log(callback);
					$rootScope.isAuthed = true;
				},function(error){
					console.log(error);
					$rootScope.isAuthed = false;
					$location.path('/sign-in');
				});
		}
	});

})
.config(function ($routeProvider) {
	$routeProvider
		.when('/new', {
			templateUrl: 'views/playlist.html',
			controller: 'PlaylistCtrl'
		})
		.when('/user/:name', {
		  templateUrl: 'views/user.html',
		  controller: 'UserCtrl'
		})
		.when('/sorry', {
		  templateUrl: 'views/sorry.html',
		  controller: 'SorryCtrl'
		})
		.when('/:hash', {
			templateUrl: 'views/playlist.html',
			controller: 'PlaylistCtrl'
		})
		.otherwise({
			redirectTo: '/new'
		});
});
