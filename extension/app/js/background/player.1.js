var Player = new (function () {
	soundManager.setup({
		url: '/app/lib/',
		flashVersion: 9,
		onready: function () {
		}
	});
	
	var playList = new Array();
	var playingSound;
	
	this.state = {
		sound: {
			id: -1,
			title: "",
			duration: 1000,
			position: 0
		},
		player: {
			onPause: false,
			volume: 50,
			isRandom: false,
			isLoop: true
		},
		playlist: {
			id: -1,
			name: "",
			count: 0,
			offset: 0,
			index: 0,
			maxCount: 0
		},
		customProperty: {
			
		}
	}

	this.setPlayList = function(id, name, count, offset, maxCount, sounds) {
		if (offset == 0) {
			playList = sounds;
			Player.state.playlist.index = 0;
		} else {
			playList.push(sounds);
		}
		Player.state.playlist.id = id;
		Player.state.playlist.name = name;
		Player.state.playlist.count = count;
		Player.state.playlist.maxCount = maxCount;
		Player.state.playlist.offset = offset;
	}
	
	this.playSoundById = function(soundId) {
		Player.state.playlist.index = -1;
		for (var i in playList) {
			if (playList[i].id == soundId) {
				Player.state.playlist.index = i;
				break;
			}
		}
		doPlay();
	}
	
	this.playSoundByIndex = function(index, offset) {
		Player.state.playlist.index = -1;
		var sound = playList[index+offset];
		if (typeof sound !== "undefined") {
			Player.state.playlist.index = index+offset;
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

	this.setPosition = function(position) {
		var max = playingSound.duration;
		var newPosition = (position * max) / 1000;
		playingSound.setPosition(newPosition);
	}
	
	this.setVolume = function(volume) {
		Player.state.player.volume = volume;
		playingSound.setVolume(Player.state.player.volume);
	}

	this.setRandomPlaying = function(isRandom) {
		Player.state.player.isRandom = isRandom;
	}
	
	var doPlay = function () {
		doStop();
		var sound = playList[Player.state.playlist.index];
		playingSound = soundManager.createSound({
			url: sound.url,
			onplay: function () {
				Player.state.sound.id = sound.id;
				Player.state.sound.title = sound.title;
				Player.state.sound.duration = playingSound.duration;
				Player.state.player.onPause = false;
			},
			onfinish: function () {
				doNext();
			},
			whileplaying: function () {
				Player.state.sound.position = playingSound.position;
			}
		});
		playingSound.setVolume(Player.state.player.volume);
		playingSound.play();
	}

	var doStop = function () {
		if (typeof playingSound !== "undefined") {
			playingSound.destruct();
		}
	}
	
	var doNext = function () {
		var next = Player.state.playlist.index + 1;
		if (next >= playList.length) {
			if (isLoop) {
				Player.state.playlist.index = 0;
			}
		} else {
			Player.state.playlist.index = next;
		}
		doPlay();
	}

	var doPrev = function () {
		var prev = Player.state.playlist.index - 1;
		if (prev < 0) {
			if (isLoop) {
				Player.state.playlist.index = playList.length - 1;
			}
		} else {
			Player.state.playlist.index = prev;
		}
		doPlay();
	}
	
	var doToggle = function () {
		if (typeof playingSound !== "undefined") {
			playingSound.togglePause();
			Player.state.player.onPause = playingSound.paused;
		}
	}
	
	
	
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