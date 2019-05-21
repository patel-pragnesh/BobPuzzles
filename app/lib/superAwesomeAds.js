var AwesomeAds = require('tv.superawesome.sdk.publisher.AwesomeAds');
var SAInterstitialAd = require('tv.superawesome.sdk.publisher.SAInterstitialAd');
var SAVideoAd = require('tv.superawesome.sdk.publisher.SAVideoAd');
var SABannerAd = require('tv.superawesome.sdk.publisher.SABannerAd');
var SAInterface = require('tv.superawesome.sdk.publisher.SAInterface');
const Inflater = require('android.view.LayoutInflater');
const Context = require("android.content.Context");
const Activity = require('android.app.Activity');
var activity = new Activity(Ti.Android.currentActivity);
const LayoutParams = require('android.widget.RelativeLayout.LayoutParams');
var superAwesomeAds = require('superAwesomeAds.js');

/*Alloy.Globals.LoaderView = Ti.UI.createView({
	height : Ti.UI.FILL,
	width : Ti.UI.FILL,
	backgroundColor : 'transparent',
	visible : false,
	bubbleParent:false
});

Alloy.Globals.loading = Ti.UI.createActivityIndicator({
	// bottom : 10,
	height : 50,
	width : 50,
	backgroundColor : 'black',
	borderRadius : 10,
	style : Ti.UI.ActivityIndicatorStyle.BIG
});*/

exports.showBannerAds = function(window, view, screenName, appPropertiesJson, isAdsPurchased) {

	AwesomeAds.init(activity, true);
	var TiView = Ti.UI.createView({
		height : 50,
		width : Ti.UI.FILL,
		id : 'TiView',
		bottom : 0,
	});

	var bannerView = new SABannerAd(activity);
	TiView.add(bannerView);
	if (!isAdsPurchased) {
		window.add(TiView);
	}

	if (appPropertiesJson && !appPropertiesJson.hasOwnProperty('showBannerAds')) {
		if (!isAdsPurchased) {
			window.add(TiView);
		}
	}

	if (appPropertiesJson != undefined && appPropertiesJson.showBannerAds) {
		if (!isAdsPurchased) {
			window.add(TiView);
		}
	}

	if (!isAdsPurchased) {
		if ((screenName == "settings") && Alloy.isHandheld) {//for settings screen
			view.children[view.children.length - 1].bottom = 90;
		}
	}

	if (isAdsPurchased) {
		if (screenName == "settings")//for settings screen
			view.children[view.children.length - 1].bottom = 60;

	}

	bannerView.setConfigurationProduction();
	bannerView.setColorTransparent();
	bannerView.load(Alloy.Globals.banner_SA_ids);

	bannerView.setListener(new SAInterface({

		onEvent : function(i, event) {
			if (event == "adLoaded") {

				if (!isAdsPurchased) {

					if (bannerView.hasAdAvailable()) {
						if (screenName == 'categoryScreen') {
							view.height = Alloy.Globals.dpFromPercentHeight((100 - view.top.replace(/[^\w\s]/gi, '').substr(0)), 1) - 50;
						}

						if (screenName == "startPage") {//for settings screen
							view.bottom = ( OS_IOS ? (Alloy.isHandheld) ? 35 : 55 : 30);
						}
						bannerView.play(activity);
					}
				}

			} else if (event == "adShown") {
				console.log("adShown");
			} else if (event == "adClosed") {
				console.log("adClosed");
			} else if (event == "adEmpty") {
				console.log("banner adEmpty");
			} else if (event == "adFailedToShow") {
				console.log("adFailedToShow");
			} else if (event == "adFailedToLoad") {
				console.log("adFailedToLoad");
			} else if ( event = 'adClicked') {
				console.log("adClicked");
			}
		}
	}));
};

/*
var adCounter = 0;

exports.initializeSAAds = function(){
	AwesomeAds.init(activity, true);
};

exports.showInterstialsAds = function(SAVariable, interstialsIDS, isAdsPurchased) {
	// AwesomeAds.init(activity, true);

	SAVariable.setConfigurationProduction();
	//SAVariable.enableTestMode();
	SAVariable.setOrientationPortrait();
	SAVariable.enableBackButton();
	SAVariable.load(interstialsIDS, activity);
	
	console.log('SAVariable.hasAdAvailable:'+SAVariable.hasAdAvailable(interstialsIDS));
	SAVariable.setListener(new SAInterface({

		onEvent : function(i, event) {
			if (event == "adLoaded") {
				if (isAdsPurchased) {
					console.log("isAdsPurchased is True-------------------");
				} else if (!isAdsPurchased) {
					SAVariable.play(interstialsIDS, activity);
					
				}

			} else if (event == "adShown") {
				Alloy.Globals.BGMusic.volume = 0;
				console.log("adShown");
				adCounter = 0;
				Alloy.Globals.LoaderView.visible = false;
				Alloy.Globals.loading.hide();
			} else if (event == "adClosed") { 
				if (!isAdsPurchased) {
					Alloy.Globals.LoaderView.visible = false;
					Alloy.Globals.loading.hide();
					Alloy.Globals.BGMusic.volume = 0.3;
				}
				console.log("adClosed");
			} else if (event == "adEmpty") {
				console.log("interstial adEmpty");
				if (!isAdsPurchased) {
					Alloy.Globals.BGMusic.volume = 0.3;
					Alloy.Globals.LoaderView.visible = false;
					if (Alloy.Globals.isSuperAwesomeVideo) {
						Alloy.Globals.LoaderView.visible = true;
						Alloy.Globals.loading.show();
						adCounter = adCounter+1;
						
						if(adCounter > 2){
							Alloy.Globals.LoaderView.visible = false;
							Alloy.Globals.loading.hide();
							return;
						}else{
							superAwesomeAds.showInterstialsAds(SAInterstitialAd, Alloy.Globals.static_SA_ids);
							Alloy.Globals.isSuperAwesomeVideo = false;
						}
					} else {
						Alloy.Globals.LoaderView.visible = true;
						Alloy.Globals.loading.show();
						adCounter = adCounter+1;
						if(adCounter > 2){
							Alloy.Globals.LoaderView.visible = false;
							Alloy.Globals.loading.hide();
							return;
						}else{
							superAwesomeAds.showInterstialsAds(SAVideoAd, Alloy.Globals.video_SA_ids);
							Alloy.Globals.isSuperAwesomeVideo = true;
						}
					}
					
				}
				
			} else if (event == "adFailedToShow") {
				console.log("adFailedToShow");
				if (!isAdsPurchased) {
					Alloy.Globals.LoaderView.visible = false;
					Alloy.Globals.loading.hide();
				}

			} else if (event == "adFailedToLoad") {
				console.log("adFailedToLoad");
				if (!isAdsPurchased) {
					Alloy.Globals.LoaderView.visible = false;
					Alloy.Globals.loading.hide();
				}
			}
		}
	}));
};*/

exports.showInterstialsAds = function(SAVariable, interstialsIDS, isAdsPurchased) {
	
	AwesomeAds.init(activity, true);

	SAVariable.setConfigurationProduction();
	//SAVariable.enableTestMode();
	SAVariable.setOrientationPortrait();
	SAVariable.enableBackButton();
	SAVariable.load(interstialsIDS, activity);
	
	SAVariable.setListener(new SAInterface({

		onEvent : function(i, event) {
			console.log("Event listener:-----"+event);
			if (event == "adLoaded")
			{
				if (!isAdsPurchased) {
					console.log("inside adLoaded interstitial:-----");
					Alloy.Globals.adStatus[0].status = 1;
				}
			} else if (event == "adShown") 
			{
				console.log("adShown");
				Alloy.Globals.adStatus[0].status = 0;
				
				Alloy.Globals.BGMusic.volume = 0;
				
				
			} else if (event == "adClosed")
			{
				console.log("adClosed");
				if(!isAdsPurchased){
					Alloy.Globals.BGMusic.volume = 0.3;
				}
			} else if (event == "adEmpty")
			{
				console.log("interstial adEmpty");
				Alloy.Globals.adStatus[0].status = 0;
				if (!isAdsPurchased) {
					Alloy.Globals.BGMusic.volume = 0.3;
				}
				
			} else if (event == "adFailedToShow")
			{
				console.log("adFailedToShow");
				if(!isAdsPurchased){
				}
				
			} else if (event == "adFailedToLoad")
			{
				console.log("adFailedToLoad");
				if(!isAdsPurchased){
				}
			}
		}
	}));
};


exports.showVideoAds = function(SAVariable, interstialsIDS, isAdsPurchased) {
	
	AwesomeAds.init(activity, true);

	SAVariable.setConfigurationProduction();
	//SAVariable.enableTestMode();
	SAVariable.setOrientationPortrait();
	SAVariable.enableBackButton();
	SAVariable.load(interstialsIDS, activity);
	
	SAVariable.setListener(new SAInterface({

		onEvent : function(i, event) {
			if (event == "adLoaded")
			{
				if (!isAdsPurchased) {
					console.log("inside adLoaded video:-----");
					Alloy.Globals.adStatus[1].status = 1;
				}
			} else if (event == "adShown") 
			{	
				console.log("adShown");
				Alloy.Globals.adStatus[1].status = 0;
				
				Alloy.Globals.BGMusic.volume = 0;
				
			} else if (event == "adClosed")
			{
				console.log("adClosed");
				if(!isAdsPurchased){
					Alloy.Globals.BGMusic.volume = 0.3;
				}
			} else if (event == "adEmpty")
			{
				console.log("Video adEmpty");
				Alloy.Globals.adStatus[1].status = 0;
				
				if (!isAdsPurchased) {
					Alloy.Globals.BGMusic.volume = 0.3;
				}
				
			} else if (event == "adFailedToShow")
			{
				console.log("adFailedToShow");
				if(!isAdsPurchased){
				}
				
			} else if (event == "adFailedToLoad")
			{
				console.log("adFailedToLoad");
				if(!isAdsPurchased){
				}
			}
		}
	}));
};