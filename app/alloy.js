// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
(function() {
	var ACS = require('ti.cloud'),
	    env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
	    username = Ti.App.Properties.getString('acs-username-' + env),
	    password = Ti.App.Properties.getString('acs-password-' + env);

	// if not configured, just return
	if (!env || !username || !password) {
		return;
	}
	/**
	 * Appcelerator Cloud (ACS) Admin User Login Logic
	 *
	 * fires login.success with the user as argument on success
	 * fires login.failed with the result as argument on error
	 */
	ACS.Users.login({
		login : username,
		password : password,
	}, function(result) {
		if (env === 'development') {
			Ti.API.info('ACS Login Results for environment `' + env + '`:');
			Ti.API.info(result);
		}
		if (result && result.success && result.users && result.users.length) {
			Ti.App.fireEvent('login.success', result.users[0], env);
		} else {
			Ti.App.fireEvent('login.failed', result, env);
		}
	});

})();


Alloy.Globals.bundleVersion = "3.8";
Alloy.Globals.isSuperAwesomeVideo = true;

if(OS_ANDROID){
	Alloy.Globals.static_SA_ids = 40144;
	Alloy.Globals.video_SA_ids = 40143;
	Alloy.Globals.banner_SA_ids = 39975;
	
	// Alloy.Globals.static_SA_ids = 30473;
	// Alloy.Globals.video_SA_ids = 30479;
	// Alloy.Globals.banner_SA_ids = 30471;
}

if(OS_IOS)
{
	// Alloy.Globals.static_SA_ids1 = "40144:0:0:load"; // VideoId, isTesting = 1, parental gate
	// Alloy.Globals.video_SA_ids1 = "40143:0:0:load";
	// Alloy.Globals.banner_SA_ids1 = "39975:0:0:load";
	
	// Alloy.Globals.static_SA_ids = "40144:0:0:play"; // VideoId, isTesting = 1, parental gate
	// Alloy.Globals.video_SA_ids = "40143:0:0:play";
	// Alloy.Globals.banner_SA_ids = "39975:0:0:play";
	
	Alloy.Globals.static_SA_ids1 = "30473:1:0:load";	//30473
	Alloy.Globals.video_SA_ids1 = "30479:1:0:load";		//30479
	Alloy.Globals.banner_SA_ids1 = "30471:1:0:load";
	
	Alloy.Globals.static_SA_ids = "30473:1:0:play";	//30473
	Alloy.Globals.video_SA_ids = "30479:1:0:play";		//30479
	Alloy.Globals.banner_SA_ids = "30471:1:0:play";
}

Alloy.Globals.adStatus = [{"type":"static","status":0, isShown : false },{ "type":"video","status":0, isShown : false }];

Alloy.Globals.setCategoryData = 'categoryData';
Alloy.Globals.setSolvedPuzzle = 'solvedPuzzle';

if (Ti.App.Properties.getObject('categoryData') == "" || Ti.App.Properties.getObject('categoryData') == null) {
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'category.json');

	if (!file.exists()) {
		file.write(Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/data/category.json').read());

	}
	Ti.App.Properties.setObject('categoryData', JSON.parse(Ti.Filesystem.getFile(file.resolve()).read()));
}

Alloy.Globals.categoryData = Ti.App.Properties.getObject('categoryData');

if (Ti.App.Properties.getObject('solvedPuzzle') == "" || Ti.App.Properties.getObject('solvedPuzzle') == null) {

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'solvedPuzzle.json');

	if (!file.exists()) {
		file.write(Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/data/solvedPuzzle.json').read());
	}
	Ti.App.Properties.setObject('solvedPuzzle', JSON.parse(Ti.Filesystem.getFile(file.resolve()).read()));
}
Alloy.Globals.solvedPuzzle = Ti.App.Properties.getObject('solvedPuzzle');

Alloy.Globals.billingSetup = false;
Alloy.Globals.animation = true;
Alloy.Globals.isOnce = true;

Alloy.Globals.pixelToDp = function(pixel) {
	return (pixel / (Titanium.Platform.displayCaps.dpi / 160));
};

Alloy.Globals.dpToPixel = function(dp) {
	return (dp * (Titanium.Platform.displayCaps.dpi / 160));
};

if (Ti.App.Properties.getObject('purchasedPlan') == "" || Ti.App.Properties.getObject('purchasedPlan') == null) {
	Ti.App.Properties.setObject('purchasedPlan', {
		"purchasedPlan" : [],
		"unlockAds" : false
	});
}

Alloy.Globals.setPurchasedPlan = 'purchasedPlan';
Alloy.Globals.purchasedPlan = Ti.App.Properties.getObject('purchasedPlan');

Alloy.Globals.puzzleType, Alloy.Globals.lock = 5;

// Alloy.Globals.rewardedVideoId = (Ti.Platform.osname == 'android') ? "ca-app-pub-3940256099942544/5224354917" : "ca-app-pub-3940256099942544/1712485313";   // testing ids

//Alloy.Globals.rewardedVideoId = (Ti.Platform.osname == 'android') ? "ca-app-pub-7751605079886115/9326621726" : "ca-app-pub-7751605079886115/8148313566";	//BOB'S production id.
var isInternetConnected = false;
if(OS_IOS){
	
	Alloy.Globals.superAwModule = require('com.usp.superawesome');
	Alloy.Globals.superAwModule.addEventListener('internetConnected', function(e) {
		isInternetConnected = true;
	});
	
	Alloy.Globals.superAwModule.addEventListener('internetNotConnected', function(e) {
		isInternetConnected = false;
	});
}

Alloy.Globals.checkDateDifference = function() {
	if(OS_IOS){
		Alloy.Globals.superAwModule.checkInternetConnection();
	}
	if(OS_ANDROID){
		isInternetConnected = true;
	}
	var maxUnlockedTime = 48;
	var unlockedCatogory = Alloy.Globals.categoryData;

	if (Ti.Network.online && isInternetConnected) {
		var url = 'http://worldclockapi.com/api/json/utc/now';
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var response = JSON.parse(this.responseText);
				currentDate = new Date(response["currentDateTime"]);
				console.log("this.responseText:----"+this.responseText);
				_.each(Alloy.Globals.categoryData, function(data, i) {
					if (data.videoWatchedDate != "") {
						var jsonDate = new Date(data.videoWatchedDate);
						var diff = (currentDate - jsonDate) / 3600000;
						if (diff > maxUnlockedTime) {
							data.videoWatchedDate = "";
							unlockedCatogory[i].videoWatchedDate = "";
							unlockedCatogory[i].isSubscribed = 0;
							Ti.App.Properties.setObject(Alloy.Globals.setCategoryData, unlockedCatogory);
						}
					}
				});
			},
			onerror : function(e) {
				console.log("Inside checkDateDifference error");
			},
		});
		xhr.open('GET', url);
		xhr.send();
	} else {
	console.log("Inside else checkDateDifference network");
		var currentDate = new Date();
		_.each(Alloy.Globals.categoryData, function(data, i) {
			if (data.videoWatchedDate != "") {
				// var jsonDate = new Date("2018-11-13T15:28Z");
				var jsonDate = new Date(data.videoWatchedDate);
				var diff = (currentDate.getTime() - jsonDate.getTime()) / (3600000);
				if (diff > maxUnlockedTime) {
					data.videoWatchedDate = "";
					unlockedCatogory[i].videoWatchedDate = "";
					unlockedCatogory[i].isSubscribed = 0;
					Ti.App.Properties.setObject(Alloy.Globals.setCategoryData, unlockedCatogory);
				}
			}
		});
	}
};

function isIphoneX(){
	return (Ti.Platform.displayCaps.platformWidth === 375 && Ti.Platform.displayCaps.platformHeight === 812 && Ti.Platform.displayCaps.logicalDensityFactor === 3);
}


Alloy.Globals.rewardedVideoLoaded;
/*Alloy.Globals.bannerAdds = function(window, view, screenName, childDirected,appPropertiesJson) {

	var Admob = require('ti.admob');
	var ad1 = Admob.createView({
		height : 50,
		bottom : (screenName != "puzzleScreen") ? '0' : null,
		top : (screenName != "puzzleScreen") ? null : (isIphoneX() == true ) ? "40" : 0 ,
		adType : Admob.AD_TYPE_BANNER,
		adUnitId : OS_IOS ? 'ca-app-pub-7751605079886115/9824700196' : "ca-app-pub-7751605079886115/5611284139", // You can get your own at http: //www.admob.com/
		requestAgent : 'Titanium Mobile App', // String that identifies the ad request's origin.
		tagForChildDirectedTreatment : childDirected, // http:///business.ftc.gov/privacy-and-security/childrens-privacy for more infos
	});
	if(appPropertiesJson && !appPropertiesJson.hasOwnProperty('showBannerAds')){
		window.add(ad1);
	}
	if(appPropertiesJson!=undefined && appPropertiesJson.showBannerAds){
		window.add(ad1);	
	}

	ad1.addEventListener(( OS_IOS ? 'didReceiveAd' : "ad_received"), function(e) {
		Ti.API.info('Did receive ad: ' + e.source.adUnitId + '!');

		Alloy.Globals.rewardedVideoLoaded = true;

		if ((screenName == "settings") && Alloy.isHandheld) {//for settings screen
			view.height = Alloy.Globals.dpFromPercentHeight((100 - view.top.replace(/[^\w\s]/gi, '').substr(0)), 1) - 50;
		}

		if (screenName == 'categoryScreen') {
			view.height = Alloy.Globals.dpFromPercentHeight((100 - view.top.replace(/[^\w\s]/gi, '').substr(0)), 1) - 50;
		}

		if (screenName == "startPage") {//for settings screen
			view.bottom = ( OS_IOS ? (Alloy.isHandheld) ? 35 : 55 : 30);
		}
		
		// if(screenName == "subscriptionScreen"){
		    // view.height = Alloy.Globals.dpFromPercentHeight((100 - view.top.replace(/[^\w\s]/gi, '').substr(0)), 1) - 20;
		// }
	});
	ad1.addEventListener('didFailToReceiveAd', function(e) {
		Ti.API.error('Failed to receive ad: ' + e.error + "---" + JSON.stringify(e));
	});
	ad1.addEventListener('willPresentScreen', function() {
		Ti.API.info('Presenting screen!');
	});
	ad1.addEventListener('willDismissScreen', function() {
		Ti.API.info('Dismissing screen!');
	});
	ad1.addEventListener('didDismissScreen', function() {
		Ti.API.info('Dismissed screen!');
	});
	ad1.addEventListener('willLeaveApplication', function() {
		Ti.API.info('Leaving the app!');
	});
	ad1.addEventListener('didReceiveInAppPurchase', function(e) {
		Ti.API.info('Did receive an In-App purchase: ' + e.productId + '!');
		Ti.API.info(e);
	});

};*/

Alloy.Globals.pixelToDp = function(pixel) {
	return (pixel / (Titanium.Platform.displayCaps.dpi / 160));
};

Alloy.Globals.dpToPixel = function(dp) {
	return (dp * (Titanium.Platform.displayCaps.dpi / 160));
};

Alloy.Globals.dpFromPercent = function(percent, orientation) {
	var platformWidth;
	if (orientation == 1) {
		platformWidth = OS_IOS ? Ti.Platform.displayCaps.platformWidth : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformWidth);
	}
	if (orientation == 3) {
		platformWidth = OS_IOS ? Ti.Platform.displayCaps.platformWidth : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformWidth);
		console.log("platformWidth:------" + platformWidth);
	}

	return ((percent * platformWidth) / 100);
};

Alloy.Globals.dpFromPercentHeight = function(percent, orientation) {
	var platformWidth;
	if (orientation == 1) {
		platformHeight = OS_IOS ? Ti.Platform.displayCaps.platformHeight : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformHeight);
	}
	if (orientation == 3) {
		platformHeight = OS_IOS ? Ti.Platform.displayCaps.platformHeight : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformHeight);
		console.log("platformWidth:------" + platformHeight);
	}

	return ((percent * platformHeight) / 100);
};

Alloy.Globals.dpFromPercentWidthHeight = function(widthPercent, heightPercent, orientation) {
	var platformWidth;
	if (orientation == 1) {
		platformWidth = OS_IOS ? Ti.Platform.displayCaps.platformWidth : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformWidth);
		platformHeight = OS_IOS ? Ti.Platform.displayCaps.platformHeight : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformHeight);
	}
	if (orientation == 3) {
		platformWidth = OS_IOS ? Ti.Platform.displayCaps.platformHeight : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformHeight);
		platformHeight = OS_IOS ? Ti.Platform.displayCaps.platformWidth : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformWidth);
		console.log("platformWidth:------" + platformHeight);
	}

	var dimensions = {
		width : (widthPercent * platformWidth) / 100,
		height : (heightPercent * platformHeight) / 100
	};

	return dimensions;
};

if (OS_IOS) {
	Alloy.Globals.FirebaseCore = require('firebase.core');
	Alloy.Globals.FirebaseAnalytics = require('firebase.analytics');
	Alloy.Globals.FirebaseCore.configure();
}

Alloy.Globals.captureEvent = function(event,params) {
	if (OS_IOS) {
		Alloy.Globals.FirebaseAnalytics.log(event,params);
	}
};

// sound control

if (Ti.App.Properties.getObject('soundControl') == "" || Ti.App.Properties.getObject('soundControl') == null) {
	Ti.App.Properties.setObject('soundControl', {
		"toggleSound" : true,
		"toggleMusic" : true
	});
}

Alloy.Globals.setSoundControl = 'soundControl';
Alloy.Globals.soundControl = Ti.App.Properties.getObject('soundControl');

Alloy.Globals.audio = Ti.Media.createAudioPlayer({
	url : "/audio/ButtonClick.mp3"
});

Alloy.Globals.audio.addEventListener('complete', function(e) {
	Alloy.Globals.audio.stop();
});

Alloy.Globals.letsGo = Ti.Media.createAudioPlayer({
	url : "/audio/Let's go.wav"
});

Alloy.Globals.letsGo.addEventListener('complete', function(e) {
	Alloy.Globals.letsGo.stop();
});

Alloy.Globals.MarimbaAccent = Ti.Media.createAudioPlayer({
		url : '/audio/MarimbaAccent.mp3',
		volume : 1
});


Alloy.Globals.congratulationMusic = Ti.Media.createAudioPlayer({
		url : "/audio/Celebration.mp3",
});

Alloy.Globals.congratulationMusic.addEventListener('complete', function(e) {
	Alloy.Globals.congratulationMusic.stop();
});	

Alloy.Globals.BGMusic = Ti.Media.createAudioPlayer({
	url : "/audio/GameMusicLoop.mp3",
	allowBackground : false
});
Alloy.Globals.BGMusic.start();

Alloy.Globals.lowVolume = false;

Alloy.Globals.BGMusic.addEventListener('complete', function(e) {
	
	if(Alloy.Globals.soundControl.toggleMusic == true){
		Alloy.Globals.BGMusic.release();
		Alloy.Globals.BGMusic.restart();
		if(Alloy.Globals.lowVolume == true)
		{
			Alloy.Globals.BGMusic.volume = 0.4;
		}
	}
});


var celebrationSound = ['Awesome.wav','Correct again .wav','Excellent.wav','Perfect.wav'];
 
 var count = 0;

randomCelebration = function() {
	var randomSounds = Math.floor((Math.random() * celebrationSound.length) + 1);
	if( count == 0 && randomSounds == 1)
	{
		randomSounds = 0;
		Alloy.Globals.congratulationMusic.url = "/audio/"+celebrationSound[randomSounds];
		count = 1;
	}else{
		Alloy.Globals.congratulationMusic.url = "/audio/"+celebrationSound[randomSounds-1];
	}
};
randomCelebration();


Alloy.Globals.muteBackgroundSound = function() {
	Alloy.Globals.BGMusic.pause();
};

Alloy.Globals.muteAllSounds = function() {
	Alloy.Globals.audio.volume = 0;
	Alloy.Globals.MarimbaAccent.volume = 0;
	Alloy.Globals.congratulationMusic.volume = 0;
	Alloy.Globals.letsGo.volume = 0;

};

Alloy.Globals.playBackgroundSound = function() {
	//Alloy.Globals.BGMusic.volume = 1;
	Alloy.Globals.BGMusic.start();
};

Alloy.Globals.playAllSound = function() {
	Alloy.Globals.audio.volume = 1;
	Alloy.Globals.MarimbaAccent.volume = 1;
	Alloy.Globals.congratulationMusic.volume = 1;
	Alloy.Globals.letsGo.volume = 1;

};

Alloy.Globals.clickEffect = function(source, destination) {
	var matrix = Ti.UI.create2DMatrix();
	matrix = matrix.scale(0.92, 0.92);
	if (destination != null) {
		source.animate({
			duration : 100,
			transform : matrix,
			autoreverse : true
		}, destination);
	} else {
		source.animate({
			duration : 100,
			transform : matrix,
			autoreverse : true
		});
	}
};




(
	function() {

		Alloy.Globals.cropedJigsawPiecesDirectory = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "/cropedJigsawPieces");
		if (!Alloy.Globals.cropedJigsawPiecesDirectory.exists()) {
			Alloy.Globals.cropedJigsawPiecesDirectory.createDirectory();
		}

	})();
	
	

	
/*if(OS_ANDROID){
	Alloy.Globals.inappSetup = false;
	Alloy.Globals.InAppBilling = require('ti.inappbilling');

	var PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlzmpjGCS5af5eiLWWAlC/kz+vU9CHNEGyS3GxOIiZ9GX0ZzpN0GO5DF8jsJWmdUzGOfjONNc9O3Tow25/x09FtBj7SyP50pe3zlInh8c4Vm08B12GXh6kvjYisNnZjaJCksVRMGa7f8Qjn91LS0JvhmbidNPCnyzO7P3iUmTHRL5aZ7zGcNrEhJ5CkYWlSxSkH7d1Q1myAZ4fqtVMR298N+i3N0DzcE64iPTxbJz6cqKdW6s71wdcCHc67PVrudyQzjZy1bfJXRhr1cF8Ai2uOOd7wG6JtcJQ6XGEI2k2JD4Qtw/5gpYchpyNP4IWr4gJoP0BIaXT5gzudkU2wP4rQIDAQAB';
	Alloy.Globals.DEVELOPER_PAYLOAD = '<< Developer Payload >>';
	var toConsume = null; // A place to hold a purchase that can be consumed
	
	Alloy.Globals.responseString = function(responseCode) {
	    switch (responseCode) {
	        case Alloy.Globals.InAppBilling.RESULT_OK:
	            return 'OK';
	        case Alloy.Globals.InAppBilling.RESULT_USER_CANCELED:
	            return 'USER CANCELED';
	        case Alloy.Globals.InAppBilling.RESULT_BILLING_UNAVAILABLE:
	            return 'BILLING UNAVAILABLE';
	        case Alloy.Globals.InAppBilling.RESULT_ITEM_UNAVAILABLE:
	            return 'ITEM UNAVAILABLE';
	        case Alloy.Globals.InAppBilling.RESULT_DEVELOPER_ERROR:
	            return 'DEVELOPER ERROR';
	        case Alloy.Globals.InAppBilling.RESULT_ERROR:
	            return 'RESULT ERROR';
	        case Alloy.Globals.InAppBilling.RESULT_ITEM_ALREADY_OWNED:
	            return 'RESULT ITEM ALREADY OWNED';
	        case Alloy.Globals.InAppBilling.RESULT_ITEM_NOT_OWNED:
	            return 'RESULT ITEM NOT OWNED';
	
	        case Alloy.Globals.InAppBilling.IAB_RESULT_REMOTE_EXCEPTION:
	            return 'IAB RESULT REMOTE EXCEPTION';
	        case Alloy.Globals.InAppBilling.IAB_RESULT_BAD_RESPONSE:
	            return 'IAB RESULT BAD RESPONSE';
	        case Alloy.Globals.InAppBilling.IAB_RESULT_VERIFICATION_FAILED:
	            return 'IAB RESULT VERIFICATION FAILED';
	        case Alloy.Globals.InAppBilling.IAB_RESULT_SEND_INTENT_FAILED:
	            return 'IAB RESULT SEND INTENT FAILED';
	        case Alloy.Globals.InAppBilling.IAB_RESULT_UNKNOWN_PURCHASE_RESPONSE:
	            return 'IAB RESULT UNKNOWN PURCHASE RESPONSE';
	        case Alloy.Globals.InAppBilling.IAB_RESULT_MISSING_TOKEN:
	            return 'IAB RESULT MISSING TOKEN';
	        case Alloy.Globals.InAppBilling.IAB_RESULT_UNKNOWN_ERROR:
	            return 'IAB RESULT UNKNOWN ERROR';
	        case Alloy.Globals.InAppBilling.IAB_RESULT_SUBSCRIPTIONS_NOT_AVAILABLE:
	            return 'IAB RESULT SUBSCRIPTIONS NOT AVAILABLE';
	        case Alloy.Globals.InAppBilling.IAB_RESULT_INVALID_CONSUMPTION:
	            return 'IAB RESULT INVALID CONSUMPTION';
	    }
	    return '';
	};

	Alloy.Globals.InAppBilling.addEventListener('setupcomplete', function(e) {
	    console.log('Setup response: ' + Alloy.Globals.responseString(e.responseCode));
	    if (e.success) {
	    	Alloy.Globals.inappSetup = true;
	        console.log('Setup completed successfully!');
	    } else {
	        console.log('Setup FAILED.');
	    }
	});

	function runSetup() {
	    console.log('Running startSetup...');
	    Alloy.Globals.InAppBilling.startSetup({
	        publicKey: PUBLIC_KEY
	    });
	    console.log('Wait for setup to complete successfully');
	}

	if(!Alloy.Globals.inappSetup){
		runSetup();
	}
	
	Alloy.Globals.purchaseTypeString = function(state) {
	    switch (state) {
	        case Alloy.Globals.InAppBilling.ITEM_TYPE_INAPP:
	            return 'ITEM TYPE INAPP';
	        case Alloy.Globals.InAppBilling.ITEM_TYPE_SUBSCRIPTION:
	            return 'ITEM TYPE SUBSCRIPTION';
	    }
	    return '';
	};

	Alloy.Globals.purchaseProperties = function(p) {
	    var str = 'type: ' + Alloy.Globals.purchaseTypeString(p.type) + 
	        '\norderId: ' + p.orderId +
	        '\npackageName: ' + p.packageName + 
	        '\nproductId: ' + p.productId +
	        '\npurchaseTime: ' + new Date(p.purchaseTime) +
	        '\npurchaseState: ' + Alloy.Globals.purchaseStateString(p.purchaseState) +
	        '\ndeveloperPayload: ' + p.developerPayload +
	        '\ntoken: ' + p.token;
	
	    return str;
	};
	
	Alloy.Globals.purchaseStateString = function(state) {
	    switch (state) {
	        case Alloy.Globals.InAppBilling.PURCHASE_STATE_PURCHASED:
	            return 'PURCHASE STATE PURCHASED';
	        case Alloy.Globals.InAppBilling.PURCHASE_STATE_CANCELED:
	            return 'PURCHASE STATE CANCELED';
	        case Alloy.Globals.InAppBilling.PURCHASE_STATE_REFUNDED:
	            return 'PURCHASE STATE REFUNDED';
	    }
	    return '';
	};
}
*/

if (OS_IOS) {
    Alloy.Globals.unityAdsModule = require('com.example.test');
	//Alloy.Globals.superAwModule = require('com.usp.superawesome');

	Ti.App.addEventListener('resume', function() {

		if (Alloy.Globals.soundControl.toggleMusic == true) {
			Alloy.Globals.BGMusic.start();
		} else if (Alloy.Globals.soundControl.toggleMusic == false) {
			Alloy.Globals.muteBackgroundSound();
		}
	});

	Ti.App.addEventListener('pause', function() {
		Alloy.Globals.BGMusic.pause();
	});

	Ti.App.addEventListener('close', function() {
		Alloy.Globals.BGMusic.stop();
	});
	
	Ti.App.addEventListener('resumed', function() {
		if (Alloy.Globals.soundControl.toggleMusic == true) {
			Alloy.Globals.BGMusic.start();
		} else if (Alloy.Globals.soundControl.toggleMusic == false) {
			Alloy.Globals.muteBackgroundSound();
		}
	});	
}





if (OS_ANDROID) {
	
	console.log('---------------------------ISTABLET :' +Alloy.isTablet);
	
	Alloy.Globals.isWindowOpen = false;
	Alloy.Globals.inappSetup = false;
	
	function checkAppBackForeStatus(){
		Alloy.Globals.isInForeground = platformTools.isInForeground();

		if (wasInForeGround == Alloy.Globals.isInForeground && Alloy.Globals.isWindowOpen == false) {
			if (Alloy.Globals.soundControl.toggleMusic == true) {
				Alloy.Globals.BGMusic.start();
				console.log('done');
			} else if (Alloy.Globals.soundControl.toggleMusic == false) {
				Alloy.Globals.muteBackgroundSound();
				console.log('Not done');
			}
		}
		if (wasInForeGround != Alloy.Globals.isInForeground) {
			Alloy.Globals.muteBackgroundSound();
		}
		
		
	}
	
	var platformTools = require('bencoding.android.tools').createPlatform(),
	    wasInForeGround = true;

	checkAppBackForeStatus();
	setInterval(checkAppBackForeStatus, 1000);
}

