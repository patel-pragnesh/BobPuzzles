Alloy.Globals.checkDateDifference();
var args = $.args;

if(OS_ANDROID){
	var superAwesomeAds = require('superAwesomeAds.js');
}

getReadCount();
function getReadCount() {
	Alloy.Globals.MaximumAttemptJson = Ti.App.Properties.getObject('MaximumAttemptJson');
	var defaultValue = 10;
	var showBannerAdsValue = 0;

	if (Ti.Network.online) {

		//var url = "https://s3.ap-south-1.amazonaws.com/bobthetrainapp/bobJigsawInterstitial.json";
		var url = "https://api.npoint.io/c90489da9760f94891f7";
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resp = JSON.parse(this.responseText);
				Ti.App.Properties.setObject('MaximumAttemptJson', resp['attempts']);
				Alloy.Globals.MaximumAttemptJson = Ti.App.Properties.getObject('MaximumAttemptJson');

				Ti.App.Properties.setObject('appPropertiesJson', {
					"showBannerAds" : resp['showBannerAds']
				});
				Alloy.Globals.appPropertiesJson = Ti.App.Properties.getObject('appPropertiesJson');
			},
			onerror : function(e) {
				console.log("inside onerror");
				if (Alloy.Globals.MaximumAttemptJson == null) {
					Ti.App.Properties.setObject('MaximumAttemptJson', defaultValue);
					Alloy.Globals.MaximumAttemptJson = Ti.App.Properties.getObject('MaximumAttemptJson');
				}

				if (Alloy.Globals.appPropertiesJson == null) {
					Ti.App.Properties.setObject('appPropertiesJson', {
						"showBannerAds" : showBannerAdsValue
					});
					Alloy.Globals.appPropertiesJson = Ti.App.Properties.getObject('appPropertiesJson');
				}
			},
			timeout : 2000 // in milliseconds
		});
		client.open("GET", url);
		client.send();
	} else {
		console.log('inside no internet');
		if (Alloy.Globals.MaximumAttemptJson == null) {
			Ti.App.Properties.setObject('MaximumAttemptJson', defaultValue);
			Alloy.Globals.MaximumAttemptJson = Ti.App.Properties.getObject('MaximumAttemptJson');
		}

		if (Alloy.Globals.appPropertiesJson == null) {
			Ti.App.Properties.setObject('appPropertiesJson', {
				"showBannerAds" : showBannerAdsValue
			});
			Alloy.Globals.appPropertiesJson = Ti.App.Properties.getObject('appPropertiesJson');
		}
	}
}

function displayBannerAds() {
	//Alloy.Globals.bannerAdds($.startPage, $.footer, "startPage", true,Alloy.Globals.appPropertiesJson);
	if(OS_ANDROID){
		superAwesomeAds.showBannerAds($.startPage, $.footer, "startPage", true, Alloy.Globals.purchasedPlan.unlockAds);	
	}
	
}

function JSONPropertyAssigner() {
	Alloy.Globals.categoryJSONFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "category.json");
	Alloy.Globals.solvedPuzzleJSONFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'solvedPuzzle.json');
}

JSONPropertyAssigner();

var osname = Ti.Platform.osname;
var matrix,
    animation,
    animation1,
    matrix2d,
    moustacheAnimation,
    animate;

$.startPage.addEventListener('focus', function() {

	if (Alloy.Globals.soundControl.toggleSound == true) {
		Alloy.Globals.playAllSound();
	} else {
		Alloy.Globals.muteAllSounds();
	}

	if (Alloy.Globals.soundControl.toggleMusic == true) {
		Alloy.Globals.playBackgroundSound();
	} else {
		Alloy.Globals.muteBackgroundSound();
	}

	animate = setInterval(function() {
		matrix = Ti.UI.create2DMatrix({
			rotate : 5
		});

		animation = Ti.UI.createAnimation({
			autoreverse : true,
			transform : matrix,
			anchorPoint : {
				x : 1,
				y : 1
			},
			duration : 80,
			repeat : 3
		});

		animation1 = Ti.UI.createAnimation({
			autoreverse : true,
			transform : matrix,
			anchorPoint : {
				x : 1,
				y : 1
			},
			duration : 80,
			repeat : 3,
			delay : 1000
		});

		matrix2d = Ti.UI.create2DMatrix();
		matrix2d = matrix2d.scale(0.8, 1);

		moustacheAnimation = Ti.UI.createAnimation({
			transform : matrix2d,
			duration : 200,
			autoreverse : true,
			top : "37%",
			delay : 500
		});

		$.squarePieceView.animate(animation);

		animation.addEventListener('complete', function(e) {
			animation.removeEventListener('complete', function(e) {
			});
			$.jigsawPieceView.animate(animation1);
			animation1.addEventListener('complete', function(e) {
				animation1.removeEventListener('complete', function(e) {
				});
				$.mustache.animate(moustacheAnimation);
			});
		});

	}, 4290);
});

if (Alloy.Globals.animation == true) {
	matrix = Ti.UI.create2DMatrix({
		rotate : 5
	});

	animation = Ti.UI.createAnimation({
		autoreverse : true,
		transform : matrix,
		anchorPoint : {
			x : 1,
			y : 1
		},
		duration : 80,
		repeat : 3
	});

	animation1 = Ti.UI.createAnimation({
		autoreverse : true,
		transform : matrix,
		anchorPoint : {
			x : 1,
			y : 1
		},
		duration : 80,
		repeat : 3,
		delay : 1000
	});

	matrix2d = Ti.UI.create2DMatrix();
	matrix2d = matrix2d.scale(0.8, 1);

	moustacheAnimation = Ti.UI.createAnimation({
		transform : matrix2d,
		duration : 200,
		autoreverse : true,
		top : "37%",
		delay : 500
	});

	$.squarePieceView.animate(animation);

	animation.addEventListener('complete', function(e) {
		animation.removeEventListener('complete', function(e) {
		});
		$.jigsawPieceView.animate(animation1);
		animation1.addEventListener('complete', function(e) {
			animation1.removeEventListener('complete', function(e) {
			});
			$.mustache.animate(moustacheAnimation);
		});
	});
}

$.startPage.addEventListener('blur', function(e) {
	clearInterval(animate);
});

$.startPage.addEventListener('click', function(e) {

	if (e.source.id == "squarePiece" || e.source.id == "jigsawPiece") {
		Alloy.Globals.audio.start();

		if (e.source.id == "squarePiece") {
			Alloy.Globals.captureEvent("squarejigsaw_button_click", {});
		}

		if (e.source.id == "jigsawPiece") {
			Alloy.Globals.captureEvent("jigsaw_button_click", {});
		}

		var moveToNextPage = function() {
			Alloy.Globals.puzzleType = e.source.id;

			var categoryName = Alloy.createController('categoryName', {
				categoryId : e.source.id,
				lastPage : 'startPage'
			});
			$.startPage.open(categoryName);
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == 'setting') {
		Alloy.Globals.captureEvent("parentcontrol_button_click", {});
		Alloy.Globals.audio.start();

		var moveToNextPage = function() {
			var lockScreen = Alloy.createController('lockScreen', {
				lockScreenView : $.anotherView,
				id : e.source.id
			});
			$.startPage.open(lockScreen);
		};

		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == 'subscription' && _.every(Alloy.Globals.categoryData.isDownloaded, function(num) {
		return num == 1;
	})) {
			Alloy.Globals.audio.start();
			var moveToNextPage = function() {
				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					id : 'subscription',
					title : 'You Have Already Unlocked All Images',
					buttonText : "Ok"
				});

				$.startPage.open(alertPage);
			};
			Alloy.Globals.clickEffect(e.source, moveToNextPage);
	} else if (e.source.id == 'subscription') {
		Alloy.Globals.captureEvent("subscribe_button_click", {});
		Alloy.Globals.audio.start();

		var moveToNextPage = function() {
			if (Ti.Network.online) {
				var lockScreen = Alloy.createController('lockScreen', {
					lockScreenView : $.anotherView,
					id : e.source.id
				});
				$.startPage.open(lockScreen);
			} else {
				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'Please check your internet connection!!!',
					buttonText : "Ok",
					id : "internet"
				});
				$.startPage.open(alertPage);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}
});

$.startPage.addEventListener('open', function(e) {

	if (Alloy.Globals.soundControl.toggleSound == true) {

		Alloy.Globals.playAllSound();

	} else if (Alloy.Globals.soundControl.toggleSound == false) {
		Alloy.Globals.muteAllSounds();

	}

	if (Alloy.Globals.soundControl.toggleMusic == false) {
		Alloy.Globals.muteBackgroundSound();
	}

	if (Alloy.Globals.soundControl.toggleMusic == true) {
		Alloy.Globals.playBackgroundSound();
	}

	if (OS_ANDROID) {
		Alloy.Globals.InAppBilling = require('ti.inappbilling');

		var PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlzmpjGCS5af5eiLWWAlC/kz+vU9CHNEGyS3GxOIiZ9GX0ZzpN0GO5DF8jsJWmdUzGOfjONNc9O3Tow25/x09FtBj7SyP50pe3zlInh8c4Vm08B12GXh6kvjYisNnZjaJCksVRMGa7f8Qjn91LS0JvhmbidNPCnyzO7P3iUmTHRL5aZ7zGcNrEhJ5CkYWlSxSkH7d1Q1myAZ4fqtVMR298N+i3N0DzcE64iPTxbJz6cqKdW6s71wdcCHc67PVrudyQzjZy1bfJXRhr1cF8Ai2uOOd7wG6JtcJQ6XGEI2k2JD4Qtw/5gpYchpyNP4IWr4gJoP0BIaXT5gzudkU2wP4rQIDAQAB';
		Alloy.Globals.DEVELOPER_PAYLOAD = '<< Developer Payload >>';
		var toConsume = null;
		// A place to hold a purchase that can be consumed

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
				console.log('Setup completed successfully! : ' + Alloy.Globals.inappSetup);
			} else {
				console.log('Setup FAILED.');
			}
		});

		function runSetup() {
			console.log('Running startSetup...');
			Alloy.Globals.InAppBilling.startSetup({
				publicKey : PUBLIC_KEY
			});
			console.log('Wait for setup to complete successfully');
		}

		if (!Alloy.Globals.inappSetup) {
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
			var str = 'type: ' + Alloy.Globals.purchaseTypeString(p.type) + '\norderId: ' + p.orderId + '\npackageName: ' + p.packageName + '\nproductId: ' + p.productId + '\npurchaseTime: ' + new Date(p.purchaseTime) + '\npurchaseState: ' + Alloy.Globals.purchaseStateString(p.purchaseState) + '\ndeveloperPayload: ' + p.developerPayload + '\ntoken: ' + p.token;

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

		//---------query inventory----------------
		if (Ti.Network.online) {
			Alloy.Globals.purchasedPlan = Ti.App.Properties.getObject('purchasedPlan');
			Alloy.Globals.purchasedPlan.unlockAds = false;

			setTimeout(function() {
				Alloy.Globals.InAppBilling.queryInventory({
					moreItems : ['com.usp.bobpuzzles.unlockninty', 'com.usp.bobpuzzles.removeads'],
				});
			}, 800);

			Alloy.Globals.InAppBilling.addEventListener('queryinventorycomplete', function(e) {
				console.log('Query Inventory response: ' + Alloy.Globals.responseString(e.responseCode));
				var inventory = e.inventory;
				var purchaseIds = ['com.usp.bobpuzzles.unlockninty', 'com.usp.bobpuzzles.removeads'];
				var purchase,
				    details;
				var isPurchased = false;
				if (e.success) {
					for (var i = 0,
					    j = purchaseIds.length; i < j; i++) {

						if (inventory.hasDetails(purchaseIds[i])) {// Check for details
							Ti.API.info('Details: ' + JSON.stringify(inventory.getDetails(purchaseIds[i])));
							if (i == 0) {
								Alloy.Globals.puzzlePlanPrize = inventory.getDetails(purchaseIds[i]).price;
							}
							if (i == 1) {
								Alloy.Globals.noAdsPrize = inventory.getDetails(purchaseIds[i]).price;
							}
						}
						console.log("Checking for purchases:" + inventory.hasPurchase(purchaseIds[i]));
						
						if (inventory.hasPurchase(purchaseIds[i])) {	// Check for purchase
							purchase = inventory.getPurchase(purchaseIds[i]);
							// Print details for each purchase

							if (Alloy.Globals.purchaseStateString(purchase.purchaseState) == "PURCHASE STATE PURCHASED" && inventory.getDetails(purchaseIds[i])['productId'] == "com.usp.bobpuzzles.unlockninty") {
								isPurchased = true;
							}

							if (Alloy.Globals.purchaseStateString(purchase.purchaseState) == "PURCHASE STATE PURCHASED" && inventory.getDetails(purchaseIds[i])['productId'] == "com.usp.bobpuzzles.removeads") {
								Alloy.Globals.purchasedPlan.unlockAds = true;
								Ti.App.Properties.setObject(Alloy.Globals.setPurchasedPlan, Alloy.Globals.purchasedPlan);
							}
							console.log('Check log for Purchase ' + i + ' properties');
							Ti.API.info(Alloy.Globals.purchaseProperties(purchase));
						}
					}

					if (isPurchased) {
						var counter = 0;
						var jsonUpdate = Alloy.Globals.categoryData;
						for (var i = 0; i < Alloy.Globals.categoryData.isDownloaded.length; i++) {

							if (Alloy.Globals.categoryData.isDownloaded[i] == 0 && counter < Alloy.Globals.categoryData.images.length) {
								jsonUpdate.isDownloaded[i] = 1;
								console.log('JSON Update  ispurchased ------' + JSON.stringify(Alloy.Globals.categoryData.isDownloaded) + "     counter:" + counter);
								counter++;
							}
						}
						Ti.App.Properties.setObject(Alloy.Globals.setCategoryData, jsonUpdate);
						if (Alloy.Globals.categoryJSONFile.exists()) {
							Alloy.Globals.categoryJSONFile.write(JSON.stringify(Alloy.Globals.categoryData));
						}
					}
				}
				displayBannerAds();
			});
		}	//network online
		//---------query inventory ends ----------
	}	//os_android

	var imgHeight = ( OS_IOS ? Ti.Platform.displayCaps.platformHeight : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformHeight)) * 0.35;
	var imgWidth = 1.4 * imgHeight;
	$.bgBobimage.height = imgHeight;
	$.bgBobimage.width = imgWidth;

	if (osname == 'ipad' || (osname == 'android' && Alloy.isTablet)) {
		console.log('--------------------- --------------------- inside 1nd condition' + osname + "  " + Alloy.isTablet);

		var dimension = Alloy.Globals.dpFromPercentWidthHeight(35, 0, 1);
		var width = dimension.width;
		var height = width;

		$.squarePieceView.width = width;
		$.squarePieceView.height = height;

		$.jigsawPieceView.width = width;
		$.jigsawPieceView.height = height;
	}

	if (osname == 'iphone' || (osname == 'android' && Alloy.isHandheld)) {
		console.log('--------------------- --------------------- inside 2nd condition' + osname + "  " + Alloy.isTablet);

		var dimension = Alloy.Globals.dpFromPercentWidthHeight(48, 0, 1);
		var width = dimension.width;
		var height = width;

		$.squarePieceView.width = width;
		$.squarePieceView.height = height;

		$.jigsawPieceView.width = width;
		$.jigsawPieceView.height = height;
	}

});

$.startPage.addEventListener('android:back', function(e) {
	Alloy.Globals.BGMusic.volume = 0;
	$.startPage.close();
});

$.startPage.open();
