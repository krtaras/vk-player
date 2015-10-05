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
            
            $scope.position = {
                value:0,
                onUpdate:false
            }
            
            $scope.compactViewState = {
                isCompactView: false,
                tabs:"",
                selectedTab: ""
            }
            
            $scope.togglePlayList = function() {
                Player.state.customProperty.isOpenedPlayList = !Player.state.customProperty.isOpenedPlayList;
                $scope.compactViewState = Player.state.customProperty.isOpenedPlayList;
                $scope.loadPlaylist();
            }
            
            $scope.updateVolume = function() {
                Player.setVolume($scope.player.volume);
                $scope.refresh();
            }
           
            $scope.playNext = function() {
                $scope.sound.title = "Loading...";
                $scope.sound.position = 0;
                Player.next();
                $scope.refresh();
            }
            
            $scope.playBack = function() {
                $scope.sound.title = "Loading...";
                $scope.sound.position = 0;
                Player.prev();
                $scope.refresh();
            }
            
            $scope.stopPlay = function() {
                Player.stop();
                $scope.refresh();
            }
            
            $scope.togglePlay = function() {
                Player.toggle();
                $scope.refresh();
            }
            
            $scope.mute = function() {
                Player.mute();
                $scope.refresh();
            }
            
            $scope.updatePosition = function() {
                Player.setPosition($scope.position.value);
                $scope.sound.position = $scope.position.value;
                $scope.position.onUpdate = false;
            }
            
            $scope.setPlayList = function() {
                APIHelper.getAlbumTracks(AuthController.getCurrentUserId(), AuthController.getAccessToken(), -1, function(data) {
                   var response = data.response;
                   Player.setPlayList(-1, "TestPlayList", response.count, 0, response.count, response.items);
                });
            }
            
            $scope.refresh = function() {
                $scope.state = Player.state;
                if (!$scope.position.onUpdate) {
                    $scope.position.value = $scope.sound.position;
                }
            }
            
            $scope.loadPlaylist = function() {
                if (Player.state.customProperty.isOpenedPlayList) {
                    $scope.compactViewState.tabs = "/app/view/tabs.html";
                    $scope.compactViewState.selectedTab = "/app/view/" + Player.state.customProperty.openTab + ".html";
                } else {
                    $scope.compactViewState.tabs = "";
                    $scope.compactViewState.selectedTab = "";
                }
            }
            
            $scope.loadPlaylist();
            
            $interval(function() {
                $scope.refresh();
            }, 500);
		}
	]);
})();