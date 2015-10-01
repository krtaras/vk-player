(function () {
    'use strict';
    var app = angular.module('google-chrome-vk-palyer');
    var controllerName = 'playerController';
    var Player = chrome.extension.getBackgroundPage().Player;
    app.controller(controllerName, ["$scope", "$interval",
        function PlayerController($scope, $interval) {
            
            $scope.state = Player.state;
            
            $scope.playlist = $scope.state.playlist.items;
            $scope.sound = $scope.state.sound;
            $scope.player = $scope.state.player;
            
            $scope.updateVolume = function(volume) {
                Player.setVolume(volume);
            }
            
            $scope.playNext = function() {
                Player.next();
            }
            
            $scope.playBack = function() {
                Player.prev();
            }
            
            $scope.stopPlay = function() {
                Player.stop();
            }
            
            $scope.togglePlay = function() {
                Player.toggle();
            }
            
            $interval(function() {
                $scope.state = Player.state;
            }, 1000);
		}
	]);
})();