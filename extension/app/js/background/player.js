var Player = new (function () {
	soundManager.setup({
		url: '/app/lib/',
		flashVersion: 9,
		onready: function () {
		}
	});
	
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
			isLoop: true,
			isMute: false
		},
		playlist: {
			id: -1,
			name: "",
			count: 0,
			offset: 0,
			index: 0,
			maxCount: 0,
			items:[]
		},
		customProperty: {
			
		}
	}

	this.setPlayList = function(id, name, count, offset, maxCount, sounds) {
		if (offset == 0) {
			Player.state.playlist.items = sounds;
			Player.state.playlist.index = 0;
		} else {
			Player.state.playlist.items.push(sounds);
		}
		Player.state.playlist.id = id;
		Player.state.playlist.name = name;
		Player.state.playlist.count = count;
		Player.state.playlist.maxCount = maxCount;
		Player.state.playlist.offset = offset;
	}
	
	this.playSoundById = function(soundId) {
		Player.state.playlist.index = -1;
		for (var i in Player.state.playlist.items) {
			if (Player.state.playlist.items[i].id == soundId) {
				Player.state.playlist.index = i;
				break;
			}
		}
		doPlay();
	}
	
	this.playSoundByIndex = function(index, offset) {
		Player.state.playlist.index = -1;
		var sound = Player.state.playlist.items[index+offset];
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
		if (typeof playingSound !== "undefined") {
			playingSound.setPosition(position);
		}
	}
	
	this.setVolume = function(volume) {
		Player.state.player.volume = volume;
		if (typeof playingSound !== "undefined") {
			playingSound.setVolume(Player.state.player.volume);
		}
	}

	this.setRandomPlaying = function(isRandom) {
		Player.state.player.isRandom = isRandom;
	}

	this.mute = function() {
		Player.state.player.isMute = !Player.state.player.isMute;
		if (Player.state.player.isMute) {
			playingSound.setVolume(0);
		} else {
			playingSound.setVolume(Player.state.player.volume);
		}
	}
	
	var doPlay = function () {
		doStop();
		var sound = Player.state.playlist.items[Player.state.playlist.index];
		playingSound = soundManager.createSound({
			url: sound.url,
			onPlay: function() {
				Player.state.sound.id = sound.id;
			},
			onload: function () {
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
		if (next >= Player.state.playlist.items.length) {
			if (Player.state.player.isLoop) {
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
			if (Player.state.player.isLoop) {
				Player.state.playlist.index = Player.state.playlist.items.length - 1;
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
})();
Player.state.customProperty = {
	isOpenedPlayList:true,
	openTab: "my"
};