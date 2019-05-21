//Add this line to alloy.js
Alloy.Globals.unityAdsModule = require('com.example.test');

var isvideoLoaded =null;
var isRewarded = null;
var interstitialFinished = null;
var errorOccured = null;

Alloy.Globals.unityAdsModule.addEventListener('bannerVideoCompletion',function(e){
	isRewarded = true;
  	console.log("User rewarded is :"+isRewarded);
});

Alloy.Globals.unityAdsModule.addEventListener('interstitialVideoCompletion',function(e){
	interstitialFinished = true;
  	console.log("User interstitialFinished :"+interstitialFinished);
});

Alloy.Globals.unityAdsModule.addEventListener('errorUnityVideo',function(e){
	errorOccured = true;
  	console.log("error occured ");
});

function doClickVideo(e) {
	setTimeout(function(e){
		isvideoLoaded = Alloy.Globals.unityAdsModule.showVideo();
		if(!isvideoLoaded){
			alert("No ads to show at this moment. Please try again");
		}
		console.log("ClickVideo isvideoLoaded: "+isvideoLoaded);
	},3000);
}

function doClickRewarded(e) {
	setTimeout(function(e){
		isvideoLoaded = Alloy.Globals.unityAdsModule.showRewardedVideo();
		if(!isvideoLoaded){
			alert("No ads to show at this moment. Please try again");
		}
		console.log("Rewarded isvideoLoaded : "+isvideoLoaded);
	},3000);
}

$.index.open();
