
//Add 
Alloy.Globals.superAwModule = require('com.usp.superawesome');  //in alloy.js
//and com.usp.superawesome in tiApp.xml

//List of video events :
//videoLoaded , videoEmpty,videoFailedToLoad, videoShown, videoFailedToShow, videoClicked, videoEnded, videoClosed


//List of interstitial events :
//interstitialLoaded, interstitialEmpty, interstitialFailedToLoad, interstitialShown, interstitialFailedToShow, interstitialClicked, interstitialEnded, interstitialClosed

Alloy.Globals.superAwModule.addEventListener('interstitialLoaded',function(e){
  	console.log("User rewarded is : interstitialLoaded");
});

Alloy.Globals.superAwModule.addEventListener('interstitialShown',function(e){
  	console.log("User interstitialFinished is : interstitialShown");
});

Alloy.Globals.superAwModule.addEventListener('interstitialClosed',function(e){
  	console.log("User interstitialFinished  : is interstitialClosed");
});



//Alloy.Globals.superAwModule.loadAndShowVideo("30479:1:1");		// VideoId, isTesting = 1, parental gate
Alloy.Globals.superAwModule.loadAndShowInterstitial("30473:1:0");	// Interstitial, isTesting = 1, parental gate
//Alloy.Globals.superAwModule.loadAndShowBanner("30471:1:1");		// VideoId, isTesting = 1, parental gate

function doClickVideo(e) {
		//console.log("ClickVideo isvideoLoaded: "+Alloy.Globals.superAwModule.loadAndShowVideo("30479:1:1"));	//videoId, isTesting = 1, parental gate
		console.log("ClickVideo isvideoLoaded: "+Alloy.Globals.superAwModule.loadAndShowInterstitial("30473:1:0"));	//videoId, isTesting = 1, parental gate
		//console.log("ClickVideo isvideoLoaded: "+Alloy.Globals.superAwModule.loadAndShowBanner("30471:1:1"));	//videoId, isTesting = 1, parental gate
}
