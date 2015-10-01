var Player = new (function () {
	soundManager.setup({
		url: '/app/lib/',
		flashVersion: 9,
		onready: function () {
		}
	});
	this.settings = {
		compactView: false,
		activeTab: "my"
	}
	
	var playList = new Array();
	var currentTrackIndex = -1;
	var playerChangeListener;
	
	var isLoop = true;
	var playingTrack;
	
	var state = {
		selectedTrackId: -2,
		selectedAlbumId: -2,
		isOnPause: false,
		displayName: "",
		position: 0,
		duration: 10000,
		volume: 50
	}
	
	this.init = function (playerUIChangeListener) {
		playerChangeListener = playerUIChangeListener;
	}

	this.getState = function() {
		return state;
	} 
	
	this.setPlayList = function(albumItems, albumId) {
		playList = albumItems;
		state.selectedAlbumId = albumId;
		currentTrackIndex = 0;
	}

	this.playTrack = function (TrackId) {
		for (var i in playList) {
			if (playList[i].id == TrackId) {
				currentTrackIndex = parseInt(i);
				break;
			}
		}
		doPlay();
	}

	this.play = function () {
		doPlay();
	}

	this.next = function () {
		doNext();
	}

	this.prev = function () {
		doPrev();
	}

	this.stop = function () {
		doStop();
	}

	this.toggle = function () {
		doToggle();
	}
	
	this.updatePosition = function(range) {
		var max = playingTrack.duration;
		var newPosition = (range * max) / 10000;
		playingTrack.setPosition(newPosition);
	}
	
	this.updateVolume = function(newVolume) {
		state.volume = newVolume;
		playingTrack.setVolume(state.volume);
	}
	
	var doPlay = function () {
		doStop();
		var audio = playList[currentTrackIndex];
		state.selectedTrackId = audio.id;
		state.displayName = audio.title;
		playingTrack = soundManager.createSound({
			url: audio.url,
			onplay: function () {
				var popups = chrome.extension.getViews({type: "popup"});
				if (popups.length > 0 && popups[0].name == "AudioPlayer") {
					playerChangeListener(state);
				}
			},
			onfinish: function () {
				doNext();
			},
			whileplaying: function () {
				state.duration = playingTrack.duration;
				state.position = playingTrack.position;
				var popups = chrome.extension.getViews({type: "popup"});
				if (popups.length > 0 && popups[0].name == "AudioPlayer") {
					playerChangeListener(state);
				}
			}
		});
		playingTrack.setVolume(state.volume);
		playingTrack.play();
		Player.Track = playingTrack;
	}

	var doStop = function () {
		if (typeof playingTrack !== "undefined") {
			playingTrack.destruct();
		}
	}

	var doToggle = function () {
		if (typeof playingTrack !== "undefined") {
			playingTrack.togglePause();
			if (playingTrack.paused) {
				state.isOnPause = true;
			}
		}
	}

	var doNext = function () {
		var next = currentTrackIndex + 1;
		if (next >= playList.length) {
			if (isLoop) {
				currentTrackIndex = 0;
			}
		} else {
			currentTrackIndex = next;
		}
		doPlay();
	}

	var doPrev = function () {
		var prev = currentTrackIndex - 1;
		if (prev < 0) {
			if (isLoop) {
				currentTrackIndex = playList.length - 1;
			}
		} else {
			currentTrackIndex = prev;
		}
		doPlay();
	}
})();