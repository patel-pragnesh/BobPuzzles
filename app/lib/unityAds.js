var IUnityServicesListener,
    UnityMonetization,
    IUnityMonetizationListener,
    ShowAdPlacementContent,
    IShowAdListener,
    PlacementContent,
    placementId,
    interstitialPlacementId,
    rewardedPlacementId,
    UnityMonetizationListener,
    listener,
    myActivity = Ti.Android.currentActivity;

IUnityServicesListener = require('com.unity3d.services.IUnityServicesListener');
UnityMonetization = require('com.unity3d.services.monetization.UnityMonetization');
IUnityMonetizationListener = require('com.unity3d.services.monetization.IUnityMonetizationListener');
ShowAdPlacementContent = require("com.unity3d.services.monetization.placementcontent.ads.ShowAdPlacementContent");
IShowAdListener = require('com.unity3d.services.monetization.placementcontent.ads.IShowAdListener');
PlacementContent = require('com.unity3d.services.monetization.placementcontent.core.PlacementContent');
placementId = "video";
interstitialPlacementId = "video";
rewardedPlacementId = "rewardedVideo";

exports.initialize = function(testMode) {

    UnityMonetizationListener = new IUnityMonetizationListener({

        onPlacementContentReady : function(placementId, placementContent) {
        	console.log("initialization succesful");
        	
        },
        onPlacementContentStateChange : function(placementId, placementContent, previousState, newState) {

        },
        onUnityServicesError : function(error, message) {
            console.log('initailization error:' + error + "    message:" + message);

        }
    });

    UnityMonetization.initialize(myActivity, "2994014", UnityMonetizationListener, testMode);
    // console.log("initialization succesful");
};

exports.showAds = function(nextImageLoad) {
	console.log('showAds : ');
    listener = new IShowAdListener({
        onAdFinished : function(var1, finishState) {
        	console.log('finished : ');
        	Alloy.Globals.BGMusic.volume = 0.5;
            console.log("onAdFinished:" + finishState + "     s:" + var1);
            if (finishState == 'COMPLETED') {
                if (var1 == 'rewardedVideo') {
                    console.log("10 points rewarded");
                   
                }
               
            } else if (finishState == 'SKIPPED') {

                console.log("video skipped bye user");
            } else if (finishState == 'ERROR') {
                console.log('errored occured');
            }
           
			console.log('toggle : '+Alloy.Globals.soundControl.toggleMusic);
            nextImageLoad();
        },

        onAdStarted : function(var1) {

            console.log('Ad started');           
             Alloy.Globals.BGMusic.volume = 0;
        }
    });

    // Check if the Placement is ready:
    setTimeout(function() {
    	console.log("is ready:"+UnityMonetization.isReady(placementId));
        if (UnityMonetization.isReady(placementId)) {
            Alloy.Globals.muteBackgroundSound();
            // Retrieve the PlacementContent that is ready:
            var pc = UnityMonetization.getPlacementContent(placementId);
            // Check that the PlacementContent is the desired type:
            if (pc.getType() == "SHOW_AD") {

                // Cast the PlacementContent as the desired type:
                var p = ShowAdPlacementContent.cast(pc);
                // Show the PlacementContent:
                p.show(myActivity, listener);
                
            }
        } else {
            console.log("This Placement is not ready!");
            nextImageLoad();
        }
    }, 100);
    console.log('showAds ends  : ');
};


exports.rewardedAds = function(unlockCategory) {
    listener = new IShowAdListener({
        onAdFinished : function(var1, finishState) {
            console.log("onAdFinished:" + finishState + "     s:" + var1);
            if (finishState == 'COMPLETED') {

                if (var1 == 'rewardedVideo') {
                    console.log("10 points rewarded");
                     Alloy.Globals.BGMusic.volume = 1;
                    unlockCategory();
                }
            } else if (finishState == 'SKIPPED') {

                console.log("video skipped bye user");
            } else if (finishState == 'ERROR') {
                console.log('errored occured');
            }
            
        },
        onAdStarted : function(var1) {

            console.log('Ad started rewarded');
            
             Alloy.Globals.BGMusic.volume = 0;
        }
    });

    // Check if the Placement is ready:
    setTimeout(function() {
        if (UnityMonetization.isReady(rewardedPlacementId)) {
            Alloy.Globals.muteBackgroundSound();
            // Retrieve the PlacementContent that is ready:
            var pc = UnityMonetization.getPlacementContent(rewardedPlacementId);
            // Check that the PlacementContent is the desired type:
            if (pc.getType() == "SHOW_AD") {
                // Cast the PlacementContent as the desired type:
                var p = ShowAdPlacementContent.cast(pc);
                // Show the PlacementContent:
                p.show(myActivity, listener);
            }
        } else {
            console.log("This Placement is not ready!");
            var alertPage = Alloy.createController('AlertPage', {
					title : 'Ad video is not available at the moment!! Please try again later.',
					buttonText : "Ok",
					id : "RewardedNoloaded"
				});
        }
    }, 100);
};