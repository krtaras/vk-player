var AuthController = new (function () {
	
	var access_token = "";
	var current_user_id = "";
	
	this.connect = function (callBackSetCurrentUserProfile) {
		var clientId = "client_id=5064446";
		var scope = "scope=audio,wall";
		var redirectUrl = "redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html";
		var authUrl = 'https://oauth.vk.com/authorize?' + clientId + '&' + scope + '&' + redirectUrl + '&display=page&response_type=token';	
		chrome.tabs.create({ url: authUrl, selected: true }, function (tab) {
			var authTabId = tab.id;
			chrome.tabs.onUpdated.addListener(function tabUpdateListener(tabId, changeInfo) {
				if (tabId == authTabId && changeInfo.url != undefined && changeInfo.status == "loading") {
					if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
						access_token = getTokenFromURL(changeInfo.url);
						current_user_id = getUserId(changeInfo.url);
						chrome.tabs.remove(tabId, function () { });
						var filds = "photo_50";
						APIHelper.getUserProfile(current_user_id, filds, access_token, callBackSetCurrentUserProfile)
					}
				}
			});
		});
	};
	
	this.getAccessToken = function() {
		return access_token;
	}
	
	this.getCurrentUserId = function() {
		return current_user_id;
	}
	
	var getTokenFromURL = function(url) {
		var tmpUrl = url;
		var startIndex = tmpUrl.indexOf("access_token=");
		var endIndex = tmpUrl.indexOf("&expires_in");
		tmpUrl = tmpUrl.substring(startIndex, endIndex);
		tmpUrl = tmpUrl.replace("access_token=","");
		return tmpUrl;
	};
	
	var getUserId = function(url) {
		var tmpUrl = url;
		var startIndex = tmpUrl.indexOf("user_id=");
		var endIndex = tmpUrl.length;
		tmpUrl = tmpUrl.substring(startIndex, endIndex);
		tmpUrl = tmpUrl.replace("user_id=","");
		return tmpUrl;
	};
})();