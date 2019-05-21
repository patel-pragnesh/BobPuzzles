var args = $.args;

if(OS_ANDROID){
	var superAwesomeAds = require('superAwesomeAds.js');
	var SAInterstitialAd = require('tv.superawesome.sdk.publisher.SAInterstitialAd');
	var SAVideoAd = require('tv.superawesome.sdk.publisher.SAVideoAd');
	const Activity = require('android.app.Activity');
	var activity = new Activity(Ti.Android.currentActivity);
	
	if(Alloy.Globals.appPropertiesJson!=null && Alloy.Globals.appPropertiesJson.showBannerAds){
		//Alloy.Globals.bannerAdds($.titleView, "", "puzzleScreen", true,Alloy.Globals.appPropertiesJson);
		superAwesomeAds.showBannerAds($.titleView, "", "puzzleScreen",true,Alloy.Globals.purchasedPlan.unlockAds);
	}
}

var imageNumber = args.imageId;
var filePath = [];
var time = 0;
var InterstitialAds_counter = 0;
var adClosed = false, myActivity;
var playedInterstitialAd = false;

//Alloy.Globals.bannerAdds($.titleView, "", "puzzleScreen", true);

// function iosAds() {
// var Admob = require('ti.admob');
// var ad2 = Admob.createView({
// debugEnabled : true, // If enabled, a dummy value for `adUnitId` will be used to test
// adType : Admob.AD_TYPE_INTERSTITIAL,
// // adUnitId: 'ca-app-pub-3940256099942544/4411468910', //test id
// adUnitId : 'ca-app-pub-7751605079886115/2284963394', // production id
// testDevices : [Admob.SIMULATOR_ID], // You can get your device's id by looking in the console log
// keywords : ['kids', 'puzzles', 'games'],
// tagForChildDirectedTreatment : true
// });
// ad2.receive();
//
// ad2.addEventListener('didReceiveAd', function(e) {
// Ti.API.info('Did receive ad!');
// });
//
// ad2.addEventListener('didFailToReceiveAd', function(e) {
// Ti.API.error('Failed to receive ad: ' + e.error);
// });
// }

if (OS_ANDROID) {
	//--------Superawesome ads starts -------------------
	
	function loadAds(){
		_.each(Alloy.Globals.adStatus,function(row,index){
			if(row['status'] == 0){
				switch (row['type']){
					case "static":
						superAwesomeAds.showInterstialsAds(SAInterstitialAd,Alloy.Globals.static_SA_ids,Alloy.Globals.purchasedPlan.unlockAds);
						break;
						
					case "video":
						superAwesomeAds.showVideoAds(SAVideoAd,Alloy.Globals.video_SA_ids,Alloy.Globals.purchasedPlan.unlockAds);
						break;
				}
			}
		});
	}
	
	function loadInterstitialAd(){
		superAwesomeAds.showInterstialsAds(SAInterstitialAd,Alloy.Globals.static_SA_ids,Alloy.Globals.purchasedPlan.unlockAds);
	}
	
	function loadVideolAd(){
		superAwesomeAds.showVideoAds(SAVideoAd,Alloy.Globals.video_SA_ids,Alloy.Globals.purchasedPlan.unlockAds);
	}
	
	loadInterstitialAd();
	loadVideolAd();
	
	
	
	function playAds(type){
		switch (type){
			case "static":
				playedInterstitialAd = true;
				setTimeout(function(){
					loadInterstitialAd();
				},12000);
				
				if(!Alloy.Globals.purchasedPlan.unlockAds){
					SAInterstitialAd.play(Alloy.Globals.static_SA_ids, activity);
				}
				break;
			case "video":
				playedInterstitialAd = false;
				setTimeout(function(){
					loadVideolAd();
				},12000);
				
				if(!Alloy.Globals.purchasedPlan.unlockAds){
					SAVideoAd.play(Alloy.Globals.video_SA_ids, activity);
				}
				break;
		}
	}
	
	//--------Superawesome ads ends -------------------
	
}	//OS_ANDROID


if(OS_IOS)
{
	/*var isvideoLoaded = null;
    var errorOccured = null;

    Alloy.Globals.unityAdsModule.addEventListener('interstitialVideoCompletion', function(e) {
        setTimeout(function(e) {
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
        }, 100);
    });

    Alloy.Globals.unityAdsModule.addEventListener('errorUnityVideo', function(e) {
        errorOccured = true;
        console.log("error occured ");
    });*/
   
   var isvideoLoaded = null;
	var errorOccured = null;
   
   function onAdsEmptyErrors()
	{
		errorOccured = true;
		seconds = 0;
		minutes = 0;
	}

	Alloy.Globals.superAwModule.loadAndShowInterstitial(Alloy.Globals.static_SA_ids1);//30473
	Alloy.Globals.superAwModule.loadAndShowVideo(Alloy.Globals.video_SA_ids1);//30479
	Alloy.Globals.superAwModule.addEventListener('interstitialClosed', function(e) {
		setTimeout(function(e) {
       		if (Alloy.Globals.soundControl.toggleSound == true) {
				Alloy.Globals.playAllSound();
			} else if (Alloy.Globals.soundControl.toggleSound == false) {
				Alloy.Globals.muteAllSounds();
			}

			if (Alloy.Globals.soundControl.toggleMusic == true) {
				//Alloy.Globals.playBackgroundSound();
				Alloy.Globals.BGMusic.start();
			} else if (Alloy.Globals.soundControl.toggleMusic == false) {
				Alloy.Globals.muteBackgroundSound();
			}
        }, 100);
        
        seconds = 0;
		minutes = 0;
	});
	
	Alloy.Globals.superAwModule.addEventListener('interstitialLoaded', function(e) {
		Alloy.Globals.adStatus[0].status = 1;
	});

	Alloy.Globals.superAwModule.addEventListener('interstitialShown', function(e) {
			Alloy.Globals.muteBackgroundSound();
			Alloy.Globals.adStatus[0].status = 0;
			playedInterstitialAd = true;
	});
	
	Alloy.Globals.superAwModule.addEventListener('interstitialFailedToLoad', function(e) {
		onAdsEmptyErrors();
	});
	
	Alloy.Globals.superAwModule.addEventListener('interstitialFailedToShow', function(e) {
		onAdsEmptyErrors();
	});
	
	Alloy.Globals.superAwModule.addEventListener('interstitialEmpty', function(e) {
		onAdsEmptyErrors();
	});
	
	Alloy.Globals.superAwModule.addEventListener('videoClosed', function(e) {
		setTimeout(function(e) {
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
        }, 100);
        
        seconds = 0;
		minutes = 0;
		
		//loading.hide();
		//tempView.visible = false;
	});

	Alloy.Globals.superAwModule.addEventListener('videoFailedToLoad', function(e) {
		onAdsEmptyErrors();
	});
	
	Alloy.Globals.superAwModule.addEventListener('videoFailedToShow', function(e) {
		onAdsEmptyErrors();
	});
	
	Alloy.Globals.superAwModule.addEventListener('videoEmpty', function(e) {
		onAdsEmptyErrors();
		console.log('--------------------------videoEmpty');
	});
	
	Alloy.Globals.superAwModule.addEventListener('videoLoaded', function(e) {
		Alloy.Globals.adStatus[1].status = 1;
		console.log('--------------------------videoloaded');
	});
	
	Alloy.Globals.superAwModule.addEventListener('videoShown', function(e) {
		onAdsEmptyErrors();
		Alloy.Globals.muteBackgroundSound();
		Alloy.Globals.adStatus[1].status = 0;
			playedInterstitialAd = false;
	});
}

/*function iosAds() {

    setTimeout(function(e) {
        isvideoLoaded = Alloy.Globals.unityAdsModule.showVideo();
        Alloy.Globals.muteBackgroundSound();
        if (!isvideoLoaded) {
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
        console.log("ClickVideo isvideoLoaded: " + isvideoLoaded);
    }, 100);
}*/

if (OS_ANDROID) {
    var unityAds = require('unityAds.js');

    unityAds.initialize(false);
    // unityAds.showAds(nextImageLoad);

   /*
    var IUnityServicesListener = require('com.unity3d.services.IUnityServicesListener');
       var UnityMonetization = require('com.unity3d.services.monetization.UnityMonetization');
       var IUnityMonetizationListener = require('com.unity3d.services.monetization.IUnityMonetizationListener');
       var ShowAdPlacementContent = require("com.unity3d.services.monetization.placementcontent.ads.ShowAdPlacementContent");
       var IShowAdListener = require('com.unity3d.services.monetization.placementcontent.ads.IShowAdListener');
       var PlacementContent = require('com.unity3d.services.monetization.placementcontent.core.PlacementContent');
   
       var placementId = "video";
       var interstitialPlacementId = "video";
       var rewardedPlacementId = "rewardedVideo";
   
       var UnityMonetizationListener = new IUnityMonetizationListener({
   
           onPlacementContentReady : function(placementId, placementContent) {
               
   
           },
           onPlacementContentStateChange : function(placementId, placementContent, previousState, newState) {
   
           },
           onUnityServicesError : function(error, message) {
   
           }
       });
   
       var listener = new IShowAdListener({
           onAdFinished : function(var1, finishState) {
               console.log("onAdFinished:" + finishState + "     s:" + var1);
               if (finishState == 'COMPLETED') {
                   nextImageLoad();
                   if (var1 == rewardedPlacementId) {
                       console.log("10 points rewarded");
                   }
               } else if (finishState == 'SKIPPED') {
                   nextImageLoad();
                   console.log("video skipped by user");
               } else if (finishState == 'ERROR') {
                   nextImageLoad();
   
                   console.log('errored occured');
               }
           },
   
           onAdStarted : function(var1) {
               console.log('Adv statred!!!');
   
           }
       });
   
       var myActivity = Ti.Android.currentActivity;
   
       UnityMonetization.initialize(myActivity, "2994014", UnityMonetizationListener, false); // 29940142980710
   
       function showAds() {
           console.log("inside  showAds     placementId:" + placementId + "     plcement raedy:" + UnityMonetization.isReady(rewardedPlacementId) + "      network online:" + Ti.Network.online);
   
           // Check if the Placement is ready:
           if (UnityMonetization.isReady(placementId)) {
               // Retrieve the PlacementContent that is ready:
               var pc = UnityMonetization.getPlacementContent(placementId);
               console.log("inside pc:" + pc.getType());
               // Check that the PlacementContent is the desired type:
               if (pc.getType() == "SHOW_AD") {
   
                   // Cast the PlacementContent as the desired type:
                   var p = ShowAdPlacementContent.cast(pc);
                   console.log("inside p:" + p.getType() + "       p:" + p);
                   // Show the PlacementContent:
                   p.show(myActivity, listener);
                   // onAdFinished("rewardedVideo",finishState);
               }
           } else {
               console.log("this placment is not ready!");
               nextImageLoad();
   
           }
   
       }*/
   

}

var timer = setInterval(function() {
    time++;
}, 1000);

if (Alloy.Globals.soundControl.toggleMusic == true) {
    Alloy.Globals.BGMusic.volume = 0.5;
} else {
    Alloy.Globals.muteBackgroundSound();
}

if (OS_ANDROID) {
    Ti.Android.currentActivity.setRequestedOrientation(Ti.Android.SCREEN_ORIENTATION_PORTRAIT);
}

var platformWidth = OS_IOS ? Ti.Platform.displayCaps.platformWidth : pixelToDp(Ti.Platform.displayCaps.platformWidth);
var platformHeight = OS_IOS ? Ti.Platform.displayCaps.platformHeight : pixelToDp(Ti.Platform.displayCaps.platformHeight);

var mainViewWidth = platformWidth;
var mainViewHeight = platformHeight - $.mainView.top;
var jigsawBoredContainerWidth = mainViewWidth * ($.jigsawBoredContainer.width.replace(/[^\w\s]/gi, '').substr(0) / 100) + (mainViewWidth * ($.img.top.replace(/[^\w\s]/gi, '').substr(0) / 100)) * 2;
var jigsawBoredContainerHeight = mainViewHeight * ($.jigsawBoredContainer.height.replace(/[^\w\s]/gi, '').substr(0) / 100);

var dimension = Alloy.Globals.dpFromPercentWidthHeight(100, 85, 3);

var imageWidth = dimension.width;
imageWidth = imageWidth - (imageWidth % args.mode);
var imageHeight = dimension.height;
imageHeight = imageHeight - (imageHeight % args.mode);

if (Alloy.isTablet) {
    imageHeight = 500;
}

var array = [],
    arr = [];

var jigsawBoredContainer = $.jigsawBoredContainer;
var img = $.img;
var jigsawBored = $.jigsawBored;
var rows = args.mode,
    cols = args.mode;
var totalPieces = rows * cols;

var obj;
function fetchJigsawBackground(rows, cols) {
    if (Alloy.Globals.puzzleType == "jigsawPiece") {
        var pattern = [{
            "rowsCols" : "2x2",
            "backgroundImg" : [1, 3, 7, 9]
        }, {
            "rowsCols" : "3x3",
            "backgroundImg" : [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }, {
            "rowsCols" : "4x4",
            "backgroundImg" : [1, 2, 2, 3, 4, 5, 5, 6, 4, 5, 5, 6, 7, 8, 8, 9]
        }, {
            "rowsCols" : "5x5",
            "backgroundImg" : [1, 2, 2, 2, 3, 4, 5, 5, 5, 6, 4, 5, 5, 5, 6, 4, 5, 5, 5, 6, 7, 8, 8, 8, 9]
        }];

        obj = _.find(pattern, function(a) {
            return a.rowsCols == rows + "x" + cols;
        });
        return obj;
    }
}

var degree = [10, 20, -10, -25, 25, 30, 15, -15, 45, 43, -20, -10, 40, 20, -10 - 20, -18, 35, 25, -20, 40, 30, -20, -10, 30, 20];

var count = 0;

var congratulate;

function loadImage(ImgNumber, matrixMode) {
    rows = matrixMode,
    cols = matrixMode;
    var totalPieces = rows * cols;
    array = [],
    arr = [];
    $.mainView.removeAllChildren();
    $.mainView.add([jigsawBoredContainer, jigsawBored, img]);
    if (Alloy.Globals.puzzleType == "jigsawPiece") {
        var file = Ti.Filesystem.getFile(Alloy.Globals.cropedJigsawPiecesDirectory.resolve());
        var files = file.getDirectoryListing();
        var singleFile;
        for (var i = 0; i < files.length; i++) {
            singleFile = Ti.Filesystem.getFile(Alloy.Globals.cropedJigsawPiecesDirectory.resolve(), files[i]);
            if (singleFile.exists()) {
                singleFile.deleteFile();
            }
        }
    }
    var localPath = "/images/" + Alloy.Globals.categoryData.images[ImgNumber] + ".jpg";
    var imageLeft = (mainViewWidth - imageHeight) / 2;
    $.img.image = localPath;
    $.img.width = imageHeight;
    imageWidth = imageHeight;
    var imageTop = platformHeight * ($.img.top.replace(/[^\w\s]/gi, '').substr(0) / 100);

    $.jigsawBored.width = imageHeight;
    $.jigsawBored.height = imageHeight;
    $.imgWrapper.width = imageHeight + (mainViewWidth * 0.04);	//added 4% extra white area around img width
    $.imgWrapper.height = imageHeight + (mainViewWidth * 0.044);	//added extra white area around img height
    $.imgWrapper.top = (Alloy.isHandheld) ? mainViewHeight * (0.08) : mainViewHeight * (0.075);
    $.jigsawBoredContainer.width = imageHeight + (mainViewWidth * ($.img.top.replace(/[^\w\s]/gi, '').substr(0) / 100)) * 3;
    jigsawBoredContainerWidth = imageHeight + (mainViewWidth * ($.img.top.replace(/[^\w\s]/gi, '').substr(0) / 100)) * 3;
	
	var headerTitleHeight = Alloy.Globals.dpFromPercentWidthHeight(0, $.headerTitle.height.replace(/[^\w\s]/gi, ''), 1);
    headerTitleHeight = headerTitleHeight.height;
	var headerHeight = headerTitleHeight;
    headerTitleHeight = imageTop + imageHeight + 25;

    var eachPieceHeight = ((mainViewHeight - headerTitleHeight) / rows) - 30;
	var blob = $.img.toBlob();
    blob = blob.imageAsResized(imageHeight, imageHeight);

    var data = {
        headerWidth : $.headerTitle.width,
        pieceHeightInContainer : eachPieceHeight,
        jBTop : headerTitleHeight,
        jBWidth : jigsawBoredContainerWidth,
        jBHeight : jigsawBoredContainerHeight,
        imgWidth : imageWidth,
        imgHeight : imageHeight,
        imgLeft : imageLeft,
        imgTop : imageTop,
        total : totalPieces,
        headerHeight : headerHeight
    };
    imageCrop(blob, data);

    if (Alloy.Globals.isOnce == true) {
        congratulate = Alloy.createController("congratulate", {
            imageHeight : blob.height,
            imgTop : data.imgTop,
            platformWidth : platformWidth
        }).getView();
        $.congratulations.add(congratulate);
    }
}

function imageCrop(blob, data) {

    var x, y;
    var newBlob;
    var topCondition,
        leftCondition;
    const pieceWidth = blob.width / cols;
    const pieceHeight = blob.height / rows;
    
    var pieceContainerWidth = platformWidth - data.jBWidth,
        pieceContainerHeight = data.jBHeight;

    var pieceWidthInContainer,
        pieceHeightInContainer;
    switch(rows) {
    case 2:
        pieceWidthInContainer = (Ti.Platform.displayCaps.platformWidth == 320) ? 100 : 120;
        pieceHeightInContainer = (Ti.Platform.displayCaps.platformWidth == 320) ? 100 : 120;
        break;
    case 3:
        pieceWidthInContainer = (Ti.Platform.displayCaps.platformWidth == 320) ? 60 : 73;
        pieceHeightInContainer = (Ti.Platform.displayCaps.platformWidth == 320) ? 60 : 73;
        break;
    case 4:
        pieceWidthInContainer = (Ti.Platform.displayCaps.platformWidth == 320) ? 47 : 60;
        pieceHeightInContainer = (Ti.Platform.displayCaps.platformWidth == 320) ? 47 : 60;
        break;
    case 5:
        pieceWidthInContainer = (Ti.Platform.displayCaps.platformWidth == 320) ? 40 : 48;
        pieceHeightInContainer = (Ti.Platform.displayCaps.platformWidth == 320) ? 40 : 48;
        break;
    }

    var counter = 0;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {

            if (Alloy.Globals.puzzleType == "squarePiece") {
                newBlob = blob.imageAsCropped({
                    x : j * pieceWidth,
                    y : i * pieceHeight,
                    width : pieceWidth,
                    height : pieceHeight
                });

                var puzzlePiece = Ti.UI.createView({
                    id : "image" + counter,
                    width : newBlob.width,
                    height : newBlob.height,
                    widthInContainer : pieceWidthInContainer * 4 / 5,
                    heightInContainer : pieceWidthInContainer * 4 / 5,
                    top : i * pieceHeight + data.imgTop,
                    left : data.imgLeft + (j * pieceWidth),
                    leftInContainer : data.imgLeft + (j * newBlob.width), // (j * pieceWidthInContainer + 15) + (platformWidth - (pieceWidthInContainer * rows + 15 * (rows - 1))) / 2
                    topInContainer : (i == 0) ? ((platformHeight < 812 && OS_IOS) ? (i * (pieceWidthInContainer) + data.jBTop) + 10 : (i * (pieceWidthInContainer) + data.jBTop) + 50) : ((platformHeight < 812) ? (i * (pieceWidthInContainer) + data.jBTop) - 50 : (i * (pieceWidthInContainer) + data.jBTop)),
                    leftPositionInJigsawBored : data.imgLeft + (j * pieceWidth),
                    topPositionInJigsawbored : i * pieceHeight + data.imgTop,
                    touchEnabled : true,
                    bool : true,
                    id2 : 'puzzlePiece',
                });

                var piece = Ti.UI.createImageView({
                    image : newBlob,
                    width : Ti.UI.FILL,
                    height : Ti.UI.FILL,
                    touchEnabled : false,
                    id2 : 'piece'
                });

                var shadowBlend = Ti.UI.createImageView({
                    image : "/images/squareBorder/SquareBev.png",
                    width : Ti.UI.FILL,
                    height : Ti.UI.FILL,
                    touchEnabled : false
                });

                var greenBorder = Ti.UI.createImageView({
                    image : "/images/squareBorder/SquareBorderGreen.png",
                    width : Ti.UI.FILL,
                    height : Ti.UI.FILL,
                    touchEnabled : false,
                    visible : false,
                    id2 : 'greenBorder',
                    zIndex : 10
                });

                var whiteBorder = Ti.UI.createImageView({
                    image : "/images/squareBorder/SquareBorderWhite.png",
                    width : Ti.UI.FILL,
                    height : Ti.UI.FILL,
                    touchEnabled : false,
                    visible : false
                });

                puzzlePiece.add(piece);
                puzzlePiece.add(shadowBlend);
                puzzlePiece.add(greenBorder);
                puzzlePiece.add(whiteBorder);
            }

            if (Alloy.Globals.puzzleType == "jigsawPiece") {
                if (i == 0 && j == 0) {
                    newBlob = blob.imageAsCropped({
                        x : j * pieceWidth,
                        y : i * pieceHeight,
                        width : pieceWidth,
                        height : pieceHeight
                    });

                    x = j * pieceWidth;
                    y = i * pieceHeight;
                }

                if (i == 0 && j > 0) {
                    newBlob = blob.imageAsCropped({
                        x : j * pieceWidth - ((pieceWidth / 3)),
                        y : i * pieceHeight,
                        width : pieceWidth + (pieceWidth / 3),
                        height : pieceHeight
                    });

                    x = j * pieceWidth - ((pieceWidth / 3));
                    y = i * pieceHeight;
                }

                if (i > 0 && j == 0) {
                    newBlob = blob.imageAsCropped({
                        x : j * pieceWidth,
                        y : i * pieceHeight - ((pieceHeight / 3)),
                        width : pieceWidth,
                        height : pieceHeight + (pieceHeight / 3)
                    });

                    x = j * pieceWidth;
                    y = i * pieceHeight - ((pieceHeight / 3));
                }

                if (i > 0 && j > 0) {
                    newBlob = blob.imageAsCropped({
                        x : j * pieceWidth - ((pieceWidth / 3)),
                        y : i * pieceHeight - ((pieceHeight / 3)),
                        width : pieceWidth + (pieceWidth / 3),
                        height : pieceHeight + (pieceHeight / 3)
                    });

                    x = j * pieceWidth - ((pieceWidth / 3));
                    y = i * pieceHeight - ((pieceHeight / 3));
                }

                var cachedBlobFile = Ti.Filesystem.getFile(Alloy.Globals.cropedJigsawPiecesDirectory.resolve(), "newBlob" + counter + new Date().getMilliseconds() + ".jpg");
                filePath.push("newBlob" + counter + new Date().getMilliseconds() + ".jpg");
                if (!cachedBlobFile.exists()) {
                    cachedBlobFile.write(newBlob);
                }

                var puzzlePiece = Ti.UI.createView({
                    id : "image" + counter,
                    width : newBlob.width,
                    height : newBlob.height,
                    widthInContainer : pieceWidthInContainer * 4 / 5,
                    heightInContainer : pieceWidthInContainer * 4 / 5,
                    top : y + data.imgTop,
                    left : data.imgLeft + x,
                    leftInContainer : data.imgLeft + x, // (j * pieceWidthInContainer + 15) + (platformWidth - (pieceWidthInContainer * rows + 15 * (rows - 1))) / 2
                    topInContainer : (i == 0) ? ((platformHeight < 812) ? (i * (pieceWidthInContainer) + data.jBTop) + 10 : (i * (pieceWidthInContainer) + data.jBTop) + 50) : ((platformHeight < 812) ? (i * (pieceWidthInContainer) + data.jBTop) - 50 : (i * (pieceWidthInContainer) + data.jBTop)),
                    leftPositionInJigsawBored : data.imgLeft + x,
                    topPositionInJigsawbored : y + data.imgTop,
                    touchEnabled : true,
                    bool : true
                });

                obj = fetchJigsawBackground(rows, cols);
                var piece = Ti.UI.createMaskedImage({
                    id : "image" + counter,
                    top : 0,
                    width : Ti.UI.FILL,
                    height : Ti.UI.FILL,
                    mask : '/images/' + obj.backgroundImg[counter] + '.png',
                    mode : Ti.UI.BLEND_MODE_SOURCE_ATOP,
                    image : cachedBlobFile.nativePath,
                    touchEnabled : false
                });

                var shadowBlend = Ti.UI.createImageView({
                    image : "/images/Bevel/" + obj.backgroundImg[counter] + "Bev.png",
                    width : Ti.UI.FILL,
                    height : Ti.UI.FILL,
                    touchEnabled : false
                });

                var greenBorder = Ti.UI.createImageView({
                    image : "/images/Green_Borders/" + obj.backgroundImg[counter] + "Bor.png",
                    width : Ti.UI.FILL,
                    height : Ti.UI.FILL,
                    touchEnabled : false,
                    visible : false,
                    zIndex : 10
                });

                var whiteBorder = Ti.UI.createImageView({
                    image : "/images/White_Borders/" + obj.backgroundImg[counter] + "Bor.png",
                    width : Ti.UI.FILL,
                    height : Ti.UI.FILL,
                    touchEnabled : false,
                    visible : false
                });

                puzzlePiece.add(piece);
                puzzlePiece.add(shadowBlend);
                puzzlePiece.add(greenBorder);
                puzzlePiece.add(whiteBorder);
            }

            var eX, eY;

            puzzlePiece.addEventListener('touchstart', function(e) {
                e.source.zIndex = 5;
                if (e.source.bool == true) {
                    e.source.left = e.source.leftInContainer;
                    e.source.top = e.source.topInContainer;
                    e.source.bool = false;
                }

                var matrix1 = Ti.UI.create2DMatrix();

                e.source.animate({
                    transform : matrix1.rotate(0)
                });

                eX = e.x;
                eY = e.y;
            });

            puzzlePiece.addEventListener('touchmove', function(e) {
                var color = e.source;
                var imgId = e.source.id;

                if (OS_IOS) {

                    if (Alloy.isTablet) {
                        var xValue = e.source.left + pixelToDp(e.x - eX);
                        var yValue = e.source.top + pixelToDp(e.y - eY);
                        if (yValue < (data.headerHeight + 2)) {//top check
                            yValue = data.headerHeight + 2;
                        }
                        if (yValue > (platformHeight - newBlob.height / 1.5)) {// bottom  check
                            yValue = platformHeight - newBlob.height / 1.5;
                        }
                        if (xValue > (platformWidth - newBlob.width)) {// right check
                            xValue = platformWidth - newBlob.width;
                        }
                        if (xValue < 0) {// left check
                            xValue = 0;
                        }
                        e.source.top = yValue;
                        e.source.left = xValue;
                        e.source.animate({
                            left : xValue,
                            top : yValue, //e.source.top,
                            duration : 0.5,
                        });
                    } else {
                        var xValue = e.source.left + pixelToDp(e.x - eX);
                        var yValue = e.source.top + pixelToDp(e.y - eY);
                        if (yValue < (data.headerHeight + 2)) {// top check
                            yValue = data.headerHeight + 2;
                        }
                        if (yValue > (platformHeight - newBlob.height / 1.5)) {// bottom check
                            yValue = platformHeight - newBlob.height / 1.5;
                        }
                        if (xValue > (platformWidth - newBlob.width)) {// right check
                            xValue = platformWidth - newBlob.width;
                        }
                        if (xValue < 0) {// left check
                            xValue = 0;
                        }
                        e.source.top = yValue;
                        e.source.left = xValue;

                        e.source.animate({
                            left : xValue,
                            top : yValue, //e.source.top,
                            duration : 0.5,
                        });
                    }
                    e.source.right -= pixelToDp(e.x - eX);
                }

                if (OS_ANDROID) {
                    var xValue = e.source.left + pixelToDp(e.x - eX) / 2;
                    var yValue = e.source.top + pixelToDp(e.y - eY) / 2;

                    if (yValue < (data.headerHeight + 2)) {// top check
                        yValue = data.headerHeight + 2;
                    }
                    if (yValue > (platformHeight - newBlob.height / 1.5)) {// Bottom check
                        yValue = platformHeight - newBlob.height / 1.5;
                    }
                    if (xValue > (platformWidth - newBlob.width)) {// right check
                        xValue = platformWidth - newBlob.width;
                    }
                    if (xValue < 0) {// left check
                        xValue = 0;
                    }
                    e.source.top = yValue;
                    e.source.left = xValue;
                    e.source.animate({
                        left : xValue,
                        top : yValue, //e.source.top,
                        duration : 0.5,
                    });
                }

                topCondition = ((parseInt(e.source.topPositionInJigsawbored) + e.source.height * 0.3) >= (e.source.top) && (e.source.top) >= (parseInt(e.source.topPositionInJigsawbored) - e.source.height * 0.3));
                leftCondition = ((parseInt(e.source.leftPositionInJigsawBored) + e.source.width * 0.3) >= e.source.left && e.source.left >= (parseInt(e.source.leftPositionInJigsawBored) - e.source.width * 0.3));
                if (leftCondition && topCondition) {
                    e.source.getChildren()[2].visible = true;  
                    e.source.getChildren()[3].visible = false;
                } else {
                    e.source.getChildren()[2].visible = false;
                    e.source.getChildren()[3].visible = true;
                }
            });

            puzzlePiece.addEventListener('touchend', function(e) {
                e.source.zIndex = 3;

                if (topCondition && leftCondition && e.source.getChildren()[2].visible == true && e.source.getChildren()[3].visible == false) {
                    e.source.zIndex = 0;

                    Alloy.Globals.MarimbaAccent.start();
					setTimeout(function() {
						Alloy.Globals.MarimbaAccent.stop();
						// (Alloy.Globals.soundControl.toggleMusic == true) ? Alloy.Globals.BGMusic.start() : Alloy.Globals.muteBackgroundSound();
					},250); 
					(Alloy.Globals.soundControl.toggleMusic == true) ? Alloy.Globals.BGMusic.start() : Alloy.Globals.muteBackgroundSound();
                    e.source.borderColor = "transparent";
                    e.source.getChildren()[2].visible = false;
                    e.source.getChildren()[3].visible = false;

                    e.source.borderWidth = 0.2;
                    e.source.animate({
                        left : e.source.leftPositionInJigsawBored,
                        top : e.source.topPositionInJigsawbored,
                        duration : 0.5
                    });

                    e.source.top = e.source.topPositionInJigsawbored;
                    e.source.left = e.source.leftPositionInJigsawBored;

                    data.total--;
                    if (data.total == 0) {
                        setTimeout(function(e) {
                            $.congratulations.visible = true;
                            randomCelebration();
                            Alloy.Globals.congratulationMusic.start();
                            // Alloy.Globals.congratulationMusic.addEventListener('complete',function(){
                            	// Alloy.Globals.congratulationMusic.release();
                            // });
                            if (Alloy.Globals.isOnce == false) {
                                congratulate = Alloy.createController("congratulate", {
                                    imageHeight : blob.height,
                                    imgTop : data.imgTop,
                                    platformWidth : platformWidth
                                }).getView();
                                $.congratulations.add(congratulate);
                            }
                            Alloy.Globals.isOnce = false;
                        }, 500);

                        setTimeout(function() {
                            $.congratulations.visible = false;
                            $.congratulations.remove(congratulate);
                            array = [],
                            arr = [];
                            var updatedData = Alloy.Globals.solvedPuzzle;
                            updatedData[Alloy.Globals.puzzleType][args.mode][imageNumber] = "1";

                            Ti.App.Properties.setObject(Alloy.Globals.setSolvedPuzzle, updatedData);

                            if (Alloy.Globals.solvedPuzzleJSONFile.exists()) {
                                Alloy.Globals.solvedPuzzleJSONFile.write(JSON.stringify(Alloy.Globals.solvedPuzzle));
                            }

                            InterstitialAds_counter++;
                            $.img.image = '';

                            if (InterstitialAds_counter == Alloy.Globals.MaximumAttemptJson) {
								
                                if (OS_ANDROID) {
                                	/*if (!Alloy.Globals.purchasedPlan.unlockAds) {
										Alloy.Globals.LoaderView.visible = true;
										Alloy.Globals.loading.show();
									}
                                	if (Alloy.Globals.isSuperAwesomeVideo) {
                                		console.log("Alloy.Globals.purchasedPlan.unlockAds---->>>"+Alloy.Globals.purchasedPlan.unlockAds);
                                		//loadInterstial(SAInterstitialAd,Alloy.Globals.static_SA_ids);
										superAwesomeAds.showInterstialsAds(SAInterstitialAd, Alloy.Globals.static_SA_ids, Alloy.Globals.purchasedPlan.unlockAds);
										Alloy.Globals.isSuperAwesomeVideo = false;
									} else {
										//loadInterstial(SAVideoAd,Alloy.Globals.video_SA_ids);
										superAwesomeAds.showInterstialsAds(SAVideoAd, Alloy.Globals.video_SA_ids, Alloy.Globals.purchasedPlan.unlockAds);
										Alloy.Globals.isSuperAwesomeVideo = true;
									}*/
									
									
									if(Alloy.Globals.adStatus[0].status == 1 && playedInterstitialAd == false){
										playAds("static");
									}
									else if(Alloy.Globals.adStatus[0].status == 0 && playedInterstitialAd == false){
										playAds("video");
									}
									else if(Alloy.Globals.adStatus[1].status == 1 && playedInterstitialAd == true){
										playAds("video");
									}
									else if(Alloy.Globals.adStatus[1].status == 0 && playedInterstitialAd == true){
										playAds("static");
									}
									
									nextImageLoad();
                                }
                                if (OS_IOS) {
                                	nextImageLoad();
									//iosAds();
									if (Alloy.Globals.purchasedPlan.unlockAds != true) {
										if(Alloy.Globals.adStatus[1].status == 0 && playedInterstitialAd == false){	//d
											 Alloy.Globals.superAwModule.loadAndShowInterstitial(Alloy.Globals.static_SA_ids1);
										}
										
										if(Alloy.Globals.adStatus[0].status == 0 && playedInterstitialAd == false){	//d
											 Alloy.Globals.superAwModule.loadAndShowVideo(Alloy.Globals.video_SA_ids1);
										}
										
										if(Alloy.Globals.adStatus[0].status == 1 && playedInterstitialAd == false){	//d
											Alloy.Globals.superAwModule.loadAndShowInterstitial(Alloy.Globals.static_SA_ids);
										}
										else if(Alloy.Globals.adStatus[1].status == 1 && playedInterstitialAd == false){	//d
											 Alloy.Globals.superAwModule.loadAndShowVideo(Alloy.Globals.video_SA_ids);
										}
										else if(Alloy.Globals.adStatus[1].status == 1 && playedInterstitialAd == true){	//d
											 Alloy.Globals.superAwModule.loadAndShowVideo(Alloy.Globals.video_SA_ids);
										}
										
										else if(Alloy.Globals.adStatus[1].status == 0 && playedInterstitialAd == true){	//d
											Alloy.Globals.superAwModule.loadAndShowInterstitial(Alloy.Globals.static_SA_ids);
										}
									}
                                }
                                InterstitialAds_counter = 0;
                            } else {
                                nextImageLoad();
                            }
                        }, 2000);
                    }
                    e.source.touchEnabled = false;
                }
            });

            array.push(puzzlePiece);
            counter++;
        }
    }
    showCroppedImg(data);
    $.img.opacity = 0.3;
}

function showCroppedImg(data) {
    var pieceContainerWidth = platformWidth - data.jBWidth,
        pieceContainerHeight = data.jBHeight;
    var pieceWidthInContainer = Math.floor(pieceContainerWidth / cols),
        pieceHeightInContainer = (pieceContainerHeight / rows);

    var counter = 0;

    var zIndex = 0;
    for (var i = 0; i < rows; i++) {

        for (var j = 0; j < cols; j++) {

            array[counter].initialLeftPosition = j * (pieceWidthInContainer + 10);
            array[counter].initialTopPosition = i * (pieceWidthInContainer + pieceWidthInContainer * 2 / 5) + pieceWidthInContainer * 1 / 5;
            array[counter].zIndex = 0;

            array[counter].animate({
                top : array[Math.round(data.total / 2)].top,
                left : array[Math.round(data.total / 2) - 1].left,
                // width : array[counter].widthInContainer,
                // height : array[counter].heightInContainer,
                delay : 500,
                duration : 500,
            });

            $.mainView.add(array[counter]);
            counter += 1;
        }
    }

    for (var i = 0; i < $.mainView.getChildren().length; i++) {

        if ($.mainView.getChildren()[i].touchEnabled == true) {

            arr.push($.mainView.getChildren()[i]);
        }
    }

    for (var i = 0; i < arr.length; i++) {
        // arr[i].getChildren()[3].visible = true;
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i].leftInContainer;
        var temp1 = arr[i].topInContainer;
        arr[i].leftInContainer = arr[j].leftInContainer;
        arr[i].topInContainer = arr[j].topInContainer;
        arr[j].leftInContainer = temp;
        arr[j].topInContainer = temp1;

    }
    animationAn();
}

function animationAn() {
    var animation;
    var matrix = Ti.UI.create2DMatrix();

    for (var i = 0; i < arr.length; i++) {

        arr[i].getChildren()[3].visible = true;
        var animation1 = Ti.UI.createAnimation({
            left : arr[i].leftInContainer,
            top : arr[i].topInContainer,
            transform : matrix.rotate(degree[i]),
            // width : arr[i].widthInContainer,
            // height : arr[i].heightInContainer,
            delay : 1000,
            duration : 500,
        });
        arr[i].animate(animation1);

    }
}

var nextImageLoad = function() {
    if (imageNumber < _.lastIndexOf(Alloy.Globals.categoryData.isDownloaded, 1)) {
        imageNumber++;
        console.log('inside nextImageLoad after image++ imageNumber:'+imageNumber);
        loadImage(imageNumber, args.mode);

    } else {

        if (args.mode < 5) {
            imageNumber = 0;
            args.mode++;
            loadImage(imageNumber, args.mode);
        } else {
            if (_.every(Alloy.Globals.categoryData.isDownloaded, function(num) {
                return num == 1;
            })) {
                clearInterval(timer);
                Alloy.Globals.captureEvent("gameplay_duration", {
                    duration : time
                });
                var alertPage = Alloy.createController('AlertPage', {
                    title : 'Congratulations!! You Have Completed All The Puzzles',
                    buttonText : "Ok",
                    id : "complete"
                }).getView();

            } else {
                clearInterval(timer);
                Alloy.Globals.captureEvent("gameplay_duration", {
                    duration : time
                });
                var categoryName = Alloy.createController('puzzleComplitionAlert', {
                    subscription : $.subscriptionView,
                    puzzleScreen : $.puzzleScreen,
                    id : "complete"
                }).getView();
                $.puzzleScreen.close();
            }

        }
    }
};

function dpToPixel(dp) {
    return (parseInt(dp) * (Titanium.Platform.displayCaps.dpi / 160));
}

function pixelToDp(px) {
    return (parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}

loadImage(imageNumber, args.mode);

$.backButton.addEventListener('click', function(e) {
    Alloy.Globals.audio.start();
    clearInterval(timer);
    Alloy.Globals.captureEvent("gameplay_duration", {
        duration : time
    });
    var moveToNextPage = function() {
        $.puzzleScreen.close();
    };
    Alloy.Globals.clickEffect(e.source, moveToNextPage);
    if (Alloy.Globals.soundControl.toggleMusic == true) {
        Alloy.Globals.BGMusic.volume = 1;
        Alloy.Globals.playBackgroundSound();
    }
});



$.puzzleScreen.addEventListener('focus',function(){
	Ti.UI.orientation = Ti.UI.PORTRAIT;
	
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
	
});

$.puzzleScreen.open();
