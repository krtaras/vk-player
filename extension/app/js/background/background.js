var BackgroundService = new (function() {
	var currentUser;
	
	this.state = {
		openPage: ""
	}
	
	this.reconect = function() {
		AuthController.connect(setCurrentUser);
	}
	
	this.getMyImgUrl = function() {
		if(typeof currentUser !== "undefined") {
			return currentUser.photo_50;
		}
	}

	var setCurrentUser = function(data) {
		currentUser = data.response[0];
	}
})();
BackgroundService.reconect();




