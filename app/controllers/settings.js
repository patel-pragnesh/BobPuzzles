// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var settings = $.settings;
if(OS_ANDROID){
	var superAwesomeAds = require('superAwesomeAds.js');
	superAwesomeAds.showBannerAds($.settings, $.socialShare, "settings", true, Alloy.Globals.purchasedPlan.unlockAds);
}
//Alloy.Globals.bannerAdds($.settings, $.socialShare, "settings", false,1);


settings.addEventListener('focus', function(e) {
	console.log("focused");
	if (Alloy.Globals.soundControl.toggleSound == true) {
		Alloy.Globals.playAllSound();
	} else if (Alloy.Globals.soundControl.toggleSound == false) {
		Alloy.Globals.muteAllSounds();
	}

	if (Alloy.Globals.soundControl.toggleMusic == true) {
		Alloy.Globals.playBackgroundSound();
	} else {
		Alloy.Globals.muteBackgroundSound();
	}

	if (Alloy.Globals.soundControl.toggleSound == true) {
		$.sound_on_off.setBackgroundImage('/images/toggle_button/SoundOn.png');
	} else {
		$.sound_on_off.setBackgroundImage('/images/toggle_button/SoundOff.png');
	}

	if (Alloy.Globals.soundControl.toggleMusic == true) {
		$.music_on_off.setBackgroundImage('/images/toggle_button/MusicOn.png');
	} else {
		$.music_on_off.setBackgroundImage('/images/toggle_button/MusicOff.png');
	}
});

settings.addEventListener('blur', function(e) {
	console.log("blured");
});

$.categoryName.text = "Parental Settings";

var url,
    text;

if (OS_IOS) {
	var ReviewDialog = require('ti.reviewdialog');
	var SKStoreReviewController = require('StoreKit/SKStoreReviewController');
	var UIDevice = require('UIKit/UIDevice');
	var NSNumericSearch = require('Foundation').NSNumericSearch;
	var NSOrderedAscending = require('Foundation').NSOrderedAscending;

	function isRequestReviewSupported() {
		return UIDevice.currentDevice.systemVersion.compareOptions('10.3', NSNumericSearch) != NSOrderedAscending;
	};

	function requestReview() {
		SKStoreReviewController.requestReview();
	};
}

if (OS_ANDROID) {
	//---------------------inapp start------------------------------

	if (Ti.Network.online) {
		$.removeAdsPrice.setText(Alloy.Globals.noAdsPrize);
		Alloy.Globals.InAppBilling.addEventListener('purchasecomplete', function(e) {
			if (e.success && e.purchase) {
				if (e.purchase.productId === 'com.usp.bobpuzzles.removeads') {// Prepare the purchase to be consumed
					Alloy.Globals.purchasedPlan.unlockAds = true;

					var AfterSubscription = Alloy.createController('AlertPage', {
						alertScreenView : $.anotherView,
						title : 'You have successfully removed all Ads.',
						buttonText : "Ok",
						id : "purchaseCompleteNoAds"
					});
				}

			}
			$.removeAds.touchEnabled = true;
		});
	}
	
	
	$.removeAds.addEventListener('click', function(e) {
		Alloy.Globals.audio.start();
		if (Ti.Network.online) {
			if (Alloy.Globals.purchasedPlan.unlockAds) {
				var AfterSubscription = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'You have successfully removed all Ads.',
					buttonText : "Ok",
					id : "noAds"
				});
				return;
			}

			Alloy.Globals.captureEvent("noAds_button_click", {});
			Alloy.Globals.audio.start();
			Alloy.Globals.clickEffect(e.source);
			$.removeAds.touchEnabled = false;

			Alloy.Globals.InAppBilling.purchase({
				productId : 'com.usp.bobpuzzles.removeads',
				type : Alloy.Globals.InAppBilling.ITEM_TYPE_INAPP,
				developerPayload : Alloy.Globals.DEVELOPER_PAYLOAD
			});
		} else {
			var alertPage = Alloy.createController('AlertPage', {
				alertScreenView : $.anotherView,
				title : 'Please check your internet connection!!!',
				buttonText : "Ok",
				id : "internet"
			});
			settings.open(alertPage);
			Alloy.Globals.clickEffect(e.source);
		}

	}); 

	
	/*var moveToNextPage1 = function(e) {
		if (Ti.Network.online) {
				if (Alloy.Globals.purchasedPlan.unlockAds) {
					var AfterSubscription = Alloy.createController('AlertPage', {
						alertScreenView : $.anotherView,
						title : 'You have successfully removed all Ads.',
						buttonText : "Ok",
						id : "noAds"
					});
					return;
				}

				Alloy.Globals.captureEvent("noAds_button_click", {});
				Alloy.Globals.audio.start();
				Alloy.Globals.clickEffect(e.source);
				$.removeAds.touchEnabled = false;

				Alloy.Globals.InAppBilling.purchase({
					productId : 'com.usp.bobpuzzles.removeads',
					type : Alloy.Globals.InAppBilling.ITEM_TYPE_INAPP,
					developerPayload : Alloy.Globals.DEVELOPER_PAYLOAD
				});
			} else {
				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'Please check your internet connection!!!',
					buttonText : "Ok",
					id : "internet"
				});
				settings.open(alertPage);
			}
	};
	$.removeAds.addEventListener('click',function(e){
		Alloy.Globals.clickEffect(e.source, moveToNextPage1);
	});*/
	
	
		

	 
}//OS_ANDROID

if (OS_IOS) {
	if (Alloy.isHandheld) {
		var dimensions = Alloy.Globals.dpFromPercentWidthHeight(13, 100, 1);
		$.sound_on_off.height = dimensions.width;
		$.music_on_off.height = dimensions.width;
		$.facebook.height = dimensions.width;
		$.twitter.height = dimensions.width;
		$.share.height = dimensions.width;
		$.rateUs.height = dimensions.width;
		$.privacyPolicy.height = dimensions.width;
		$.subscribe.height = dimensions.width;
		$.visitUs.height = dimensions.width;
		$.emailUs.height = dimensions.width;
	}
	
	var loading = Ti.UI.createActivityIndicator({
		height : 50,
		width : 50,
		backgroundColor : 'black',
		borderRadius : 10,
		style : Ti.UI.ActivityIndicatorStyle.BIG
	});

	$.settings.add(loading);
	var loadingCount = 0;

	var Storekit = require('ti.storekit');
	Storekit.autoFinishTransactions = false;
	Storekit.bundleVersion = Alloy.Globals.bundleVersion;
	Storekit.bundleIdentifier = "com.usp.bobpuzzles";
	var verifyingReceipts = true;
	
	function requestProduct(identifier, success) {
		loading.show();
		Storekit.requestProducts([identifier], function(evt) {
			loading.hide();
			if (!evt.success) {
				Ti.API.error('ERROR: We failed to talk to Apple!');
			} else if (evt.invalid) {
				Ti.API.error('ERROR: We requested an invalid product (' + identifier + '):' + "--" + JSON.stringify(evt));
			} else {
				Ti.API.info('Valid Product:');
				success(evt.products[0]);
			}
		});
	}
	
	Storekit.addEventListener('transactionState', function(evt) {

		switch (evt.state) {
		case Storekit.TRANSACTION_STATE_FAILED:
			if (evt.cancelled) {
				Ti.API.warn('Purchase cancelled');
			} else {
				Ti.API.error('ERROR: Buying failed! ' + evt.message);
			}
			loading.hide();
			$.removeAds.touchEnabled = true;
			evt.transaction && evt.transaction.finish();
			console.log('state failed');
			break;
		case Storekit.TRANSACTION_STATE_PURCHASED:
			if (verifyingReceipts) {
				var msg = Storekit.validateReceipt() ? 'Receipt is Valid!' : 'Receipt is Invalid.';
				Ti.API.info('Validation: ' + msg);
				Ti.API.info("Purchase is valid");
				console.log("evt.productIdentifier:" + evt.productIdentifier);
				evt.transaction.finish();
				Alloy.Globals.captureEvent("purchaseSuccess", {});
				loading.hide();
				$.removeAds.touchEnabled = true;

				if (evt.productIdentifier == "com.usp.bobpuzzles.removeads")
					Alloy.Globals.purchasedPlan.unlockAds = true;

				var AfterSubscription = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'You have successfully removed all Ads.',
					buttonText : "Ok",
					id : "purchaseCompleteNoAds"
				});
			}
			console.log('state purchased');
			break;
		case Storekit.TRANSACTION_STATE_PURCHASING:
			Ti.API.info('Purchasing ' + evt.productIdentifier);
			loading.show();
			console.log('state purching');
			break;
		case Storekit.TRANSACTION_STATE_DEFERRED:
			loading.hide();
			$.removeAds.touchEnabled = true;
			
			Ti.API.info('Deferring ' + evt.productIdentifier + ': The transaction is in the queue, but its final status is pending external action.');
			break;
		}
	});

	function purchaseProduct(product) {
		if (product.downloadable) {
			Ti.API.info('Purchasing a product that is downloadable');
		}
		loading.show();
		Storekit.purchase({
			product : product
		});
	}

	Storekit.addTransactionObserver();
	

	if (!Storekit.canMakePayments)
		Ti.API.error('This device cannot make purchases!');
	else {
		requestProduct("com.usp.bobpuzzles.removeads", function(product) {
			console.log('product.formattedPrice---' + product.formattedPrice);
			loading.show();
			$.removeAdsPrice.setText(product.formattedPrice);
			$.removeAds.addEventListener('click', function(e) {
				Alloy.Globals.captureEvent("removeAds_button_click", {});
				Alloy.Globals.audio.start();
				Alloy.Globals.clickEffect(e.source);
				$.removeAds.touchEnabled = false;
				purchaseProduct(product);
			});
			loading.hide();
		});
	}
}

function ShareDialog(e) {
	var socialWidget = Alloy.createWidget('com.alcoapps.socialshare');
	socialWidget.share({
		status : url,
		view : $.share
	});
}

function webviews(link) {
	var webview = Titanium.UI.createWebView({
		url : link
	});
	var window = Titanium.UI.createWindow({
		fullscreen : true,
		theme : "Theme.AppCompat.Fullscreen",
	});
	window.add(webview);

	var crossWeb = Ti.UI.createLabel({
		top : "8%",
		right : "3%",
		width : "26",
		height : "26",
		backgroundImage : '/images/PopupCloseBtn.png',
		textAlign : 'center'
	});
	window.add(crossWeb);
	window.open({
		modal : true
	});

	if (OS_ANDROID) {
		window.addEventListener('open', function() {
			// Alloy.Globals.BGMusic.volume = 0;
			Alloy.Globals.BGMusic.pause();
			Alloy.Globals.isWindowOpen = true;
		});
	}

	crossWeb.addEventListener('click', function(e) {
		// Alloy.Globals.audio.start();
		if (Alloy.Globals.soundControl.toggleSound == true) {
			Alloy.Globals.playAllSound();
		} else if (Alloy.Globals.soundControl.toggleSound == false) {
			Alloy.Globals.muteAllSounds();
		}

		if (Alloy.Globals.soundControl.toggleMusic == true) {
			Alloy.Globals.playBackgroundSound();
			if (OS_ANDROID) {
				// Alloy.Globals.BGMusic.volume = 1;
				Alloy.Globals.isWindowOpen = false;
			}
		} else if (Alloy.Globals.soundControl.toggleMusic == false) {
			Alloy.Globals.muteBackgroundSound();
		}
		window.close();
	});

	if (OS_ANDROID) {
		window.addEventListener('android:back', function(e) {
			Alloy.Globals.audio.start();
			if (Alloy.Globals.soundControl.toggleSound == true) {
				Alloy.Globals.playAllSound();
			} else if (Alloy.Globals.soundControl.toggleSound == false) {
				Alloy.Globals.muteAllSounds();
			}

			if (Alloy.Globals.soundControl.toggleMusic == true) {
				Alloy.Globals.playBackgroundSound();
				if (OS_ANDROID) {
					Alloy.Globals.isWindowOpen = false;
				}
			} else if (Alloy.Globals.soundControl.toggleMusic == false) {
				Alloy.Globals.muteBackgroundSound();
			}
			window.close();
		});
	}	//os_android
}

function buttonClickEffect(buttonView) {
	buttonView.addEventListener('touchstart', function(e) {
		e.source.backgroundColor = "red";
	});
	buttonView.addEventListener('touchend', function(e) {
		e.source.backgroundColor = "white";
	});
}

var unlockedCategories = [],
    totalNumberOfUnlockedImages = 0;

settings.addEventListener('click', function(e) {
	if (e.source.id == 'sound_on_off') {
		// Alloy.Globals.clickEffect(e.source, null);
		console.log("Inside click Alloy.Globals.soundControl.toggleSound :" + Alloy.Globals.soundControl.toggleSound);
		var moveToNextPage = function() {
			if (Alloy.Globals.soundControl.toggleSound == true) {
				Alloy.Globals.captureEvent("music_button_click", {
					mode : "off"
				});
				e.source.setBackgroundImage('/images/toggle_button/SoundOff.png');
				Alloy.Globals.muteAllSounds();
				var updateToggleSound = Alloy.Globals.soundControl;
				updateToggleSound.toggleSound = false;
				Ti.App.Properties.setObject(Alloy.Globals.setSoundControl, updateToggleSound);
				console.log(" Sound off Alloy.Globals.soundControl.sound:" + Alloy.Globals.soundControl.toggleSound);
			} else if (Alloy.Globals.soundControl.toggleSound == false) {
				Alloy.Globals.captureEvent("music_button_click", {
					mode : "on"
				});
				e.source.setBackgroundImage('/images/toggle_button/SoundOn.png');
				Alloy.Globals.playAllSound();
				var updateToggleSound = Alloy.Globals.soundControl;
				updateToggleSound.toggleSound = true;
				Ti.App.Properties.setObject(Alloy.Globals.setSoundControl, updateToggleSound);
				console.log("Sound on Alloy.Globals.soundControl.sound:" + Alloy.Globals.soundControl.toggleSound);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == 'music_on_off') {
		console.log("Inside click Alloy.Globals.soundControl.toggleMusic :" + Alloy.Globals.soundControl.toggleMusic);
		var moveToNextPage = function() {
			var updateToggleMusic;
			if (Alloy.Globals.soundControl.toggleMusic == true) {
				Alloy.Globals.captureEvent("backgroundmusic_button_click", {
					mode : "off"
				});
				e.source.setBackgroundImage('/images/toggle_button/MusicOff.png');
				Alloy.Globals.muteBackgroundSound();
				updateToggleMusic = Alloy.Globals.soundControl;
				updateToggleMusic.toggleMusic = false;
				Ti.App.Properties.setObject(Alloy.Globals.setSoundControl, updateToggleMusic);
				console.log(" Music off Alloy.Globals.soundControl.music:" + Alloy.Globals.soundControl.toggleMusic);
			} else if (Alloy.Globals.soundControl.toggleMusic == false) {
				Alloy.Globals.captureEvent("backgroundmusic_button_click", {
					mode : "on"
				});
				e.source.setBackgroundImage('/images/toggle_button/MusicOn.png');
				Alloy.Globals.playBackgroundSound();
				updateToggleMusic = Alloy.Globals.soundControl;
				updateToggleMusic.toggleMusic = true;
				Ti.App.Properties.setObject(Alloy.Globals.setSoundControl, updateToggleMusic);
				console.log("Music ON Alloy.Globals.soundControl.music:" + Alloy.Globals.soundControl.toggleMusic);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == 'facebook') {
		Alloy.Globals.audio.start();
		Alloy.Globals.captureEvent("fb_twitter_button_click", {
			site : "facebook"
		});
		var moveToNextPage = function() {
			if (Ti.Network.online) {
				Alloy.Globals.muteBackgroundSound();
				var fbLink = "https://www.facebook.com/bobthetrain/";
				webviews(fbLink);
			} else {
				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'Please check your internet connection!!!',
					buttonText : "Ok",
					id : "internet"
				});
				$.settings.open(alertPage);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == 'twitter') {
		Alloy.Globals.captureEvent("fb_twitter_button_click", {
			site : "twitter"
		});
		Alloy.Globals.audio.start();

		var moveToNextPage = function() {
			if (Ti.Network.online) {
				Alloy.Globals.muteBackgroundSound();
				var twitterLink = "https://twitter.com/bobthetrain_?lang=en";
				webviews(twitterLink);
			} else {
				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'Please check your internet connection!!!',
					buttonText : "Ok",
					id : "internet"
				});
				$.settings.open(alertPage);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == 'share') {
		Alloy.Globals.captureEvent("share_button_click", {});
		Alloy.Globals.audio.start();
		var moveToNextPage = function() {
			var appUrl = "https://appurl.io/jovec8jn";
			// var appUrl = "https://appurl.io/jrm1z2wk";
			text = "Bob The Train's official Puzzle Game for your kids. Click the link below to install.";
			text.bold();
			url = text + "\n\n " + appUrl;
			ShareDialog();
			$.settings.open();
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == "rateUs") {
		Alloy.Globals.captureEvent("rateus_button_click", {});
		Alloy.Globals.audio.start();
		var moveToNextPage = function() {
			if (Ti.Network.online) {

				if (OS_IOS) {
					if (isRequestReviewSupported() && !Ti.App.Properties.getBool('reviewDialogRequested', false)) {
						Ti.App.Properties.setBool('reviewDialogRequested', true);
						ReviewDialog.requestReview();
					}
					ReviewDialog.requestReview();
				}

				if (OS_ANDROID) {
					Ti.Platform.openURL("https://play.google.com/store/apps/details?id=com.usp.bobpuzzles");
				}
			} else {
				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'Please check your internet connection!!!',
					buttonText : "Ok",
					id : "internet"
				});
				$.settings.open(alertPage);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == 'privacyPolicy') {
		Alloy.Globals.captureEvent("privacy_button_click", {});
		Alloy.Globals.audio.start();
		var moveToNextPage = function() {
			if (Ti.Network.online) {
				Alloy.Globals.muteBackgroundSound();
				var privacyPolicyLink = "https://www.uspstudios.co/privacy-policy/";
				webviews(privacyPolicyLink);
			} else {
				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'Please check your internet connection!!!',
					buttonText : "Ok",
					id : "internet"
				});
				$.settings.open(alertPage);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == "subscribe") {
		Alloy.Globals.captureEvent("subscribe_button_click", {});
		Alloy.Globals.audio.start();
		if (Ti.Network.online) {
			var moveToNextPage = function() {
				if (_.every(Alloy.Globals.categoryData.isDownloaded, function(num) {
					return num == 1;
				})) {
					var alertPage = Alloy.createController('AlertPage', {
						alertScreenView : $.anotherView,
						title : 'You Have Already Unlocked All Images',
						buttonText : "Ok",
						id : "allImagesUnlocked"
					});
					$.settings.open(alertPage);
				} else {
					var subscription = Alloy.createController('subscriptionScreen', {
						lockscreen : null,
						win : $.settings
					});
					$.settings.open(subscription);
				}
			};
			Alloy.Globals.clickEffect(e.source, moveToNextPage);
		} else {
			var moveToNextPage = function() {
				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'Please check your internet connection!!!',
					buttonText : "Ok",
					id : "internet"
				});
				$.settings.open(alertPage);
			};
			Alloy.Globals.clickEffect(e.source, moveToNextPage);
			// $.anotherView.visible = true;
		}
	}

	if (e.source.id == "visitUs") {
		Alloy.Globals.captureEvent("visitus_button_click", {});
		Alloy.Globals.audio.start();
		var moveToNextPage = function() {
			if (Ti.Network.online) {
				Alloy.Globals.muteBackgroundSound();
				var visitUsLink = "https://www.uspstudios.co/";
				webviews(visitUsLink);
			} else {
				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'Please check your internet connection!!!',
					buttonText : "Ok",
					id : "internet"
				});
				$.settings.open(alertPage);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == "emailUs") {
		Alloy.Globals.captureEvent("emailus_button_click", {});
		Alloy.Globals.audio.start();
		var moveToNextPage = function() {
			if (Ti.Network.online) {
				Alloy.Globals.muteBackgroundSound();
				if (OS_IOS) {
					var emailDialog = Ti.UI.createEmailDialog();
					emailDialog.subject = Ti.App.name + " " + Ti.Platform.osname + "(" + Ti.App.version + ")" + " Feedback";
					emailDialog.toRecipients = ['support@uspstudios.tv'];
					emailDialog.messageBody = 'Please share your feedback below :';
					emailDialog.open();

					if (!(emailDialog.open())) {
						var dialog = Ti.UI.createAlertDialog({
							cancel : 0,
							buttonNames : ['OK'],
							message : 'You Need To Login To Email'
						});
						dialog.addEventListener('click', function(e) {
							if (e.index === e.source.cancel) {
								Alloy.Globals.audio.start();
								Alloy.Globals.playBackgroundSound();
								console.log("Email dialog cancelled");
							}
						});
						dialog.show();
					}
				}

				if (OS_ANDROID) {
					var intent = Ti.Android.createIntent({
						action : Ti.Android.ACTION_SEND,
						type : "text/plain",
						packageName : "com.google.android.gm",
						email : Ti.Android.EXTRA_EMAIL
					});
					intent.putExtraUri(Ti.Android.EXTRA_STREAM, "support@uspstudios.tv");
					intent.putExtra(Ti.Android.EXTRA_EMAIL, ['support@uspstudios.tv']);
					//intent.putExtra(Ti.Android.EXTRA_CC, "mbhatt33@yahoo.com");
					intent.putExtra(Ti.Android.EXTRA_SUBJECT, Ti.App.name + " " + Ti.Platform.osname + "(" + Ti.App.Android.appVersionName + ")" + " Feedback");
					intent.putExtra(Ti.Android.EXTRA_TEXT, "Please share your feedback below :");
					intent.putExtra(Ti.Android.EXTRA_STREAM, "");
					intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
					settings.activity.startActivity(intent);
				}
			} else {
				var moveToNextPage = function() {
					var alertPage = Alloy.createController('AlertPage', {
						alertScreenView : $.anotherView,
						title : 'Please check your internet connection!!!',
						buttonText : "Ok",
						id : "internet"
					});
					$.settings.open(alertPage);
				};

				Alloy.Globals.clickEffect(e.source, moveToNextPage);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}
});

$.backButton.addEventListener('click', function(e) {
	Alloy.Globals.audio.start();
	var moveToNextPage = function() {
		$.settings.close();
	};
	Alloy.Globals.clickEffect(e.source, moveToNextPage);
});

Ti.App.addEventListener("closeWindow", function(e) {
	$.settings.close();
});

$.settings.open(); 