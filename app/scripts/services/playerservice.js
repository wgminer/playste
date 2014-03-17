'use strict';

angular.module('musicApp')
	.factory('PlayerService', function () {

		var player = false;
		var playerStatus = false;
		var playerData = false;
		var playerElement = false;

		var setPlayer = function(newPlayer) {
			player = newPlayer;
		}

		var getPlayer  = function() {
			return player;
		}

		var setPlayerStatus = function(newPlayerStatus) {
			playerStatus = newPlayerStatus;
		}

		var getPlayerStatus  = function() {
			return playerStatus;
		}

		var setPlayerData = function(newPlayerData) {
			playerData = newPlayerData;
		}

		var getPlayerData  = function() {
			return playerData;
		}

		var setPlayerElement = function(newPlayerElement) {
			playerElement = newPlayerElement;
		}

		var getPlayerElement  = function() {
			return playerElement;
		}


		// Public API

		return {
			setPlayer: setPlayer,
			getPlayer: getPlayer,
			setPlayerStatus: setPlayerStatus,
			getPlayerStatus: getPlayerStatus,
			setPlayerData: setPlayerData,
			getPlayerData: getPlayerData,
			setPlayerElement: setPlayerElement,
			getPlayerElement: getPlayerElement
		};

	});

	