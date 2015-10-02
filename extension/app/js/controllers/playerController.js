(function () {
    'use strict';
    var app = angular.module('google-chrome-vk-palyer');
    var controllerName = 'playerController';
    var Player = chrome.extension.getBackgroundPage().Player;
    var APIHelper = chrome.extension.getBackgroundPage().APIHelper;
    var AuthController = chrome.extension.getBackgroundPage().AuthController;
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
            
            $scope.mute = function() {
                Player.mute();
            }
            
            $scope.setPlayList = function() {
                APIHelper.getAlbumTracks(AuthController.getCurrentUserId(), AuthController.getAccessToken(), -1, function(data) {
                   var response = data.response;
                   Player.setPlayList(-1, "TestPlayList", response.count, 0, response.count, response.items);
                });
            }
            
            $interval(function() {
                $scope.state = Player.state;
            }, 1000);
		}
	]);
})();