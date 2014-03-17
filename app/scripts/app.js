'use strict';

angular.module('musicApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/playlist.html',
        controller: 'PlaylistCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
