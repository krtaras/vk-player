var APIHelper = new (function() {
	
	this.getAlbumTracks = function(userId, access_token, albumId, callbackFunc) {
		var album = "";
		if (albumId > 0) {
			album = "&album_id=" + albumId;
		}
		var url = "https://api.vk.com/method/audio.get?owner_id=" + userId + "&access_token=" + access_token + album + "&v=5.37";
		callMethod(url, callbackFunc);
	}
	
	this.getAudioAlbums = function(userId, access_token, callbackFunc) {
		var url = "https://api.vk.com/method/audio.getAlbums?owner_id=" + userId + "&access_token=" + access_token + "&count=100&v=5.37";
		callMethod(url, callbackFunc);
	}
	
	this.getAudioBySearchText = function(text, access_token, callbackFunc) {
		var url = "https://api.vk.com/method/audio.search?q=" + text + "&auto_complete=1&access_token=" + access_token + "&count=300&v=5.37";
		callMethod(url, callbackFunc);
	}
	
	var callMethod = function(url, callbackFunc) {
		$.get(url, function(data){
			callbackFunc(data);
		}, "json");
	};
})();