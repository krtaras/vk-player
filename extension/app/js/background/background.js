var BackgroundService = new (function() {
	this.reconect = function() {
		AuthController.connect();
	}
})();
BackgroundService.reconect();




