// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

if(OS_ANDROID){
	var superAwesomeAds = require('superAwesomeAds.js');
	superAwesomeAds.showBannerAds($.subscriptionScreen, $.scrollview, "subscriptionScreen",true,Alloy.Globals.purchasedPlan.unlockAds);

	var androidUnityAds = require('unityAds.js');
	androidUnityAds.initialize(false);
}
var setUpVariable = false;

var loading = Ti.UI.createActivityIndicator({
		// bottom : 10,
		height : 50,
		width : 50,
		backgroundColor : 'black',
		borderRadius : 10,
		style : Ti.UI.ActivityIndicatorStyle.BIG
	});
	
	$.subscriptionScreen.add(loading);
	var loadingCount = 0;

	function showLoading() {
		loadingCount += 1;
		if (loadingCount == 1) {
			loading.show();
		}
	}

	function hideLoading() {
		if (loadingCount > 0) {
			loadingCount -= 1;
			if (loadingCount == 0) {
				loading.hide();
			}
		}
	}

//Alloy.Globals.bannerAdds($.subscriptionScreen, $.scrollview, "subscriptionScreen", false,1);


var activityIndicator = Ti.UI.createActivityIndicator({
	indicatorColor : 'green',
	style : Titanium.UI.ActivityIndicatorStyle.BIG,
	top : -50,
	right : 20,
	height : '50',
	width : '50',
});

if (OS_IOS) {

	var Storekit = require('ti.storekit');

	var DownloadablePop = 'com.usp.bobpuzzles.unlockninety';

	Storekit.autoFinishTransactions = false;
	Storekit.bundleVersion = Alloy.Globals.bundleVersion;
	Storekit.bundleIdentifier = "com.usp.bobpuzzles";

	var purchasedPlan;

	var verifyingReceipts = true;

	

	function requestProduct(identifier, success) {
		showLoading();
		Storekit.requestProducts([identifier], function(evt) {
			hideLoading();
			if (!evt.success) {
				Ti.API.error('ERROR: We failed to talk to Apple!');
			} else if (evt.invalid) {
				Ti.API.error('ERROR: We requested an invalid product (' + identifier + '):' + "--" + JSON.stringify(evt));
				Ti.API.error(evt);
			} else {
				Ti.API.info('Valid Product:');
				Ti.API.info("evt:---" + JSON.stringify(evt) + "---" + evt.products[0].formattedPrice);
				success(evt.products[0]);
			}
		});
	}


	Storekit.addEventListener('transactionState', function(evt) {

		switch (evt.state) {
		case Storekit.TRANSACTION_STATE_FAILED:
			if (evt.cancelled) {
				Ti.API.warn('Purchase cancelled');
				hideLoading();
			} else {
				Ti.API.error('ERROR: Buying failed! ' + evt.message);
			}
			hideLoading();
			$.allCategories.touchEnabled = true;
			evt.transaction && evt.transaction.finish();
			break;
		case Storekit.TRANSACTION_STATE_PURCHASED:
			if (verifyingReceipts) {
				var msg = Storekit.validateReceipt() ? 'Receipt is Valid!' : 'Receipt is Invalid.';
				Ti.API.info('Validation: ' + msg);
				Ti.API.info("Purchase is valid");
				console.log("evt.productIdentifier:" + evt.productIdentifier);
				evt.transaction.finish();
				Alloy.Globals.captureEvent("purchaseSuccess", {});
				hideLoading();
				$.allCategories.touchEnabled = true;

				if (evt.productIdentifier == "com.usp.bobpuzzles.unlockninety")
					purchasedPlan = Alloy.Globals.categoryData.images.length;

				var updatePurchasedPlan = Alloy.Globals.purchasedPlan;
				updatePurchasedPlan.purchasedPlan.push(purchasedPlan);

				Ti.App.Properties.setObject(Alloy.Globals.setPurchasedPlan, updatePurchasedPlan);
				console.log('allPurchaseedd:' + updatePurchasedPlan);
				console.log('-------------------------inside transactionState--------------------');
				var alertPage = Alloy.createController('AlertPage', {
					limit : purchasedPlan,
					alertScreenView : $.anotherView,
					title : 'You have successfully unlocked 90 Puzzles.',
					buttonText : "Ok",
					rewarded : false

				});
				$.subscriptionScreen.open(alertPage);
				$.subscriptionScreen.close();
			}
			break;
		case Storekit.TRANSACTION_STATE_PURCHASING:
			Ti.API.info('Purchasing ' + evt.productIdentifier);
			showLoading();
			break;
		case Storekit.TRANSACTION_STATE_DEFERRED:
			hideLoading();
			$.allCategories.touchEnabled = true;
			Ti.API.info('Deferring ' + evt.productIdentifier + ': The transaction is in the queue, but its final status is pending external action.');
			break;
		}
	});

	function purchaseProduct(product) {
		if (product.downloadable) {
			Ti.API.info('Purchasing a product that is downloadable');
		}
		showLoading();
		Storekit.purchase({
			product : product
		});
	}


	Storekit.addTransactionObserver();

	if (!Storekit.canMakePayments)
		Ti.API.error('This device cannot make purchases!');
	else {
		requestProduct("com.usp.bobpuzzles.unlockninety", function(product) {
			console.log('product.formattedPrice---' + product.formattedPrice);
			loading.show();
			$.allPrice.setText(product.formattedPrice);
			$.allCategories.addEventListener('click', function(e) {
				Alloy.Globals.captureEvent("plan_button_click", {});
				Alloy.Globals.audio.start();
				Alloy.Globals.clickEffect(e.source);
				$.allCategories.touchEnabled = false;
				purchaseProduct(product);
			});
			loading.hide();
		});
	}
	
	
	function restorePurchases() {
    showLoading();
    Storekit.restoreCompletedTransactions();
}

Storekit.addEventListener('restoredCompletedTransactions', function(evt) {
    hideLoading();
    if (evt.error) {
        Ti.API.error(evt.error);
    } else if (evt.transactions == null || evt.transactions.length == 0) {
        Ti.API.warn('There were no purchases to restore!');
    } else {
        if (verifyingReceipts) {
            if (Storekit.validateReceipt()) {
                Ti.API.info('Restored Receipt is Valid!');
                for (var i = 0; i < evt.transactions.length; i++) {
	                if(evt.transactions[i].productIdentifier == "com.usp.bobpuzzles.unlockninety")
			        {
						purchasedPlan = Alloy.Globals.categoryData.images.length;
						var updatePurchasedPlan = Alloy.Globals.purchasedPlan;
						updatePurchasedPlan.purchasedPlan.push(purchasedPlan);
						Ti.App.Properties.setObject(Alloy.Globals.setPurchasedPlan, updatePurchasedPlan);
					}
					
					if(evt.transactions[i].productIdentifier == "com.usp.bobpuzzles.removeads")
			        {
			           	Alloy.Globals.purchasedPlan.unlockAds = true;
			        }
				}
				
				var alertPage = Alloy.createController('AlertPage', {
					limit : purchasedPlan,
					alertScreenView : $.anotherView,
					title : 'You have successfully restored your purchases.',
					buttonText : "Ok",
					rewarded : false

				});
				$.subscriptionScreen.open(alertPage);
				$.subscriptionScreen.close();
            }
        }
    }
});
	
	
	$.restorePurchase.addEventListener('click',function(e){
		
		restorePurchases();
		
	});
	

}else{
	
//---------------------inapp start------------------------------
	
	
	$.allPrice.setText(Alloy.Globals.puzzlePlanPrize);
	
	$.allCategories.addEventListener('click', function(e) {
		Alloy.Globals.captureEvent("plan_button_click",{});
		Alloy.Globals.audio.start();
		Alloy.Globals.clickEffect(e.source);
		$.allCategories.touchEnabled = false;
		
		Alloy.Globals.InAppBilling.purchase({
        	productId: 'com.usp.bobpuzzles.unlockninty',
        	type: Alloy.Globals.InAppBilling.ITEM_TYPE_INAPP,
            developerPayload: Alloy.Globals.DEVELOPER_PAYLOAD
        });

	});

	Alloy.Globals.InAppBilling.addEventListener('purchasecomplete', function(e) {
		console.log("inside purchase complete success");
	    if (e.success && e.purchase) {
	        console.log(Alloy.Globals.purchaseProperties(e.purchase));
	        
	        $.allCategories.touchEnabled = true;
	       if (e.purchase.productId === 'com.usp.bobpuzzles.unlockninty') {	 // Prepare the purchase to be consumed
	       	
	            unlockItems();
	        
	        }
	    }else{
	    	$.allCategories.touchEnabled = true;
	    }
	});


	function unlockItems(){
		
			Alloy.Globals.captureEvent("purchaseSuccess", {});

			purchasedPlan = Alloy.Globals.categoryData.images.length;

			var updatePurchasedPlan = Alloy.Globals.purchasedPlan;
			updatePurchasedPlan.purchasedPlan.push(purchasedPlan);

			Ti.App.Properties.setObject(Alloy.Globals.setPurchasedPlan, updatePurchasedPlan);
			

			console.log('-------------------------inside unlockItems--------------------'+JSON.stringify(Ti.App.Properties.getObject('purchasedPlan')));

			var alertPage = Alloy.createController('AlertPage', {
				limit : purchasedPlan,
				alertScreenView : $.anotherView,
				title : 'You have successfully unlocked 90 Puzzles.',
				buttonText : "Ok",
				rewarded : false

			});
			$.subscriptionScreen.open(alertPage);
			$.subscriptionScreen.close();
		
	}
	
	//------inapp  ends-----------	
	
}


if(OS_IOS)
{
    var isRewarded = null;
    var videoLoaded="";
    
    Alloy.Globals.unityAdsModule.addEventListener('bannerVideoCompletion', function(e) {
        isRewarded = true;
        $.adButtonView.remove(activityIndicator);
        if (isRewarded) {
            unlockCategory();
            isRewarded = false;

				if (Alloy.Globals.soundControl.toggleSound == true) {
					Alloy.Globals.playAllSound();
				} else if (Alloy.Globals.soundControl.toggleSound == false) {
					Alloy.Globals.muteAllSounds();
				}
				
				if (Alloy.Globals.soundControl.toggleMusic == true) {
					Alloy.Globals.playBackgroundSound();
				} else if (Alloy.Globals.soundControl.toggleMusic == false) {
					Alloy.Globals.muteBackgroundSound();
				}

        }
    });
    
     $.subscriptionScreen.addEventListener("focus",function(e){ 
        $.adButtonView.add(activityIndicator);
    });
    
    function loadVideo(e) {
        $.adButtonView.add(activityIndicator);
        activityIndicator.show();
        setTimeout(function(e) {
            isvideoLoaded = Alloy.Globals.unityAdsModule.showRewardedVideo();
            if (!isvideoLoaded) {
                Alloy.Globals.playBackgroundSound();
                var alertPage = Alloy.createController('AlertPage', {
					title : 'Ad video is not available at the moment!! Please try again later.',
					buttonText : "Ok",
					id : "RewardedNoloaded"
				});
                $.adButtonView.remove(activityIndicator);
                videoLoaded = false;
                isRewarded = false;
                activityIndicator.hide();
                return;
            }
            Alloy.Globals.muteBackgroundSound();
            videoCounter = 1;
            activityIndicator.hide();
            videoLoaded = true;
            console.log("Rewarded isvideoLoaded : " + isvideoLoaded);
        }, 100);
    }
}

function showVideo(e){
     Alloy.Globals.captureEvent("video_button_click",{});
    Alloy.Globals.muteBackgroundSound();
    var moveToNextPage = function() {
                if(OS_IOS){
                	if (Ti.Network.online) {
                		loadVideo();
                	}else{
                		var alertPage = Alloy.createController('AlertPage', {
						alertScreenView : $.anotherView,
						title : 'Please check your internet connection!!!',
						buttonText : "Ok",
						id : "internet"
					});
	
					$.subscriptionScreen.open(alertPage);
                	}
                	
                }  
                	
                	if(OS_ANDROID){
                	if (Ti.Network.online) {
                		androidUnityAds.rewardedAds(unlockCategory);
                	}else{
                		var alertPage = Alloy.createController('AlertPage', {
						alertScreenView : $.anotherView,
						title : 'Please check your internet connection!!!',
						buttonText : "Ok",
						id : "internet"
					});
	
					$.subscriptionScreen.open(alertPage);
                	}
                	
                }  
        };
    Alloy.Globals.clickEffect(e.source, moveToNextPage);
    
}

var videoCounter = 1;
var counter = 0;
var unlockCategory = function() {
	if (videoCounter == 1) {
				console.log('loaded');

				var alertPage = Alloy.createController('AlertPage', {
					alertScreenView : $.anotherView,
					title : 'You have successfully unlocked 10 Puzzles.',
					buttonText : "Ok",
					limit : 10,
				});
				$.subscriptionScreen.open(alertPage);
				videoCounter++;
				$.subscriptionScreen.close();

			}
	/*console.log('inside unlockCategory : '+" video counter : "+videoCounter+"  counter : "+counter);
	var url = 'http://worldclockapi.com/api/json/utc/now';
	var xhr = Ti.Network.createHTTPClient({
		onload : function(e) {
			var response = JSON.parse(this.responseText);
			console.log("date:" + response["currentDateTime"]);
			setProperty("advWatchTime", response["currentDateTime"]);

			

		},
		onerror : function(e) {
			alert('error' + JSON.stringify(e));
		},
	});
	xhr.open('GET', url);
	xhr.send();*/

};

function setProperty(property, value) {
	Ti.App.Properties.setString(property, value);
}

$.backBtn.addEventListener('click', function(e) {
	Alloy.Globals.audio.start();

	var moveToNextPage = function() {
		$.subscriptionScreen.close();
	};
	Alloy.Globals.clickEffect(e.source, moveToNextPage);

});

Ti.App.addEventListener("closeWindow",function(e){
	$.subscriptionScreen.close();
});


$.subscriptionScreen.open();
