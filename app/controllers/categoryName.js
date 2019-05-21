var args = $.args;
var osname = Ti.Platform.osname;

if(OS_ANDROID){
	var superAwesomeAds = require('superAwesomeAds.js');
	if(Alloy.Globals.appPropertiesJson!=null && Alloy.Globals.appPropertiesJson.showBannerAds){
		superAwesomeAds.showBannerAds($.categoryNameWindow, $.selectImage, "categoryScreen",true,Alloy.Globals.purchasedPlan.unlockAds);
	}
}

Alloy.Globals.checkDateDifference();

Alloy.Globals.animation = false;
//check for expired advideo watched time
var lockImage,
    tickImage,
    selectedImageView;

$.categoryName.text = Alloy.Globals.categoryData.name;

$.matrixOf2.borderColor = 'white';
// #66f95b
$.matrixOf2.borderWidth = '3';
var matrixMode = 2;
var range =  Alloy.isHandheld ? 18 : 20;

if (osname == 'ipad' || (osname == 'android' && Alloy.isTablet)) {

	var platformWidth = OS_IOS ? Ti.Platform.displayCaps.platformWidth : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformWidth);
	var scrollWidth = (platformWidth * 0.98);
	var boxWidth = (scrollWidth / 4);
console.log('platformWidth : '+platformWidth+"  scrollWidth : "+scrollWidth+"  boxWidth : "+boxWidth);
	readDataFromJSON();
}

if (osname == 'iphone' || (osname == 'android' && Alloy.isHandheld)) {

	var platformWidth = OS_IOS ? Ti.Platform.displayCaps.platformWidth : Alloy.Globals.pixelToDp(Ti.Platform.displayCaps.platformWidth);
	var scrollWidth = (platformWidth * 0.98);
	var boxWidth = (scrollWidth / 3);

	readDataFromJSON();
}

var totalLoaded = 0;
// to keep track of content size on iOS
var currentSize = 0;
var overlap;
// to know when the table is loading
var isLoading = false;
$.selectImage.addEventListener('postlayout', function(e) {
	initialTableSize = e.source.rect.height;
});

var viewsTop = 0,
    totalLoadedOld;
var loaderView;
var loading;
var count = 0;



function readDataFromJSON() {

	for (var i = 0; i <= range; i++) {

		if (Alloy.Globals.categoryData.images.length > totalLoaded) {
			console.log("-------    totalLoaded:" + totalLoaded);
			if (i < range) {
				var selectedImageView = Ti.UI.createView({
					top : 0,
					width : (Alloy.isTablet) ? boxWidth - 0.5 : boxWidth,
					height : (Alloy.isTablet) ? boxWidth : boxWidth,
					id : totalLoaded,
				});

				var whiteBorder = Ti.UI.createImageView({
					id : totalLoaded,
					image : '/images/ImageBox.png',
					width : boxWidth,
					height : boxWidth,
					visible : true,
					top : '5%',
					touchEnabled : false,
					autorotate : false
				});

				var viewLock = Ti.UI.createView({
					width : '23%',
					height : '25%',
					backgroundImage : '/images/Lock.png',
					left : '5%',
					top : "0%",
					visible : false,
					touchEnabled : false,
					id: "lock"
				});

				var img = Ti.UI.createImageView({
					image : "/images/Bob_150/" + Alloy.Globals.categoryData.images[totalLoaded] + ".jpg",
					defaultImage : '/images/NoImage.png',
					width : '74%',
					height : '74%',
					touchEnabled : false,
					borderRadius : '5',
					top : '13%',
					autorotate : false

				});

				var tickImage = Ti.UI.createImageView({
					backgroundImage : '/images/ImageBoxSelected.png',
					height : boxWidth,
					width : boxWidth,
					visible : false,
					id : 'tick',
					touchEnabled : false,
					top : '5%',
					autorotate : false
				});

				var nameOfCategory = Ti.UI.createLabel({
					top : "77%",
					text : Alloy.Globals.categoryData.imageName[totalLoaded], //
					font : {
						fontFamily : 'BubbleGum',
						fontSize : (Alloy.isTablet) ? 25 : 15,
					},
					textAlign : 'center',
					color : "white",
					touchEnabled : false
				});

				lockImage = Ti.UI.createImageView({
					width : boxWidth,
					height : boxWidth,
					image : '/images/ImageBoxLocked.png',
					touchEnabled : false,
					visible : false,
					top : '5%',
					autorotate : false
				});

				selectedImageView.add(nameOfCategory);
				selectedImageView.add(img);
				selectedImageView.add(whiteBorder);
				selectedImageView.add(lockImage);
				selectedImageView.add(viewLock);
				selectedImageView.add(tickImage);

				if (Alloy.Globals.categoryData.isDownloaded[totalLoaded] == 0) {
					lockImage.visible = true;
					viewLock.visible = true;

				}

				if (totalLoaded == 0) {
					overlap = selectedImageView.height;
				}

				if (((totalLoaded % 3 == 0) && Alloy.isHandheld ) || totalLoaded == 0) {
					console.log(" toatal divide 3 : " + totalLoaded);
					if ((totalLoaded % 3 == 0) && Alloy.isHandheld)
						currentSize += selectedImageView.height;

					if (totalLoaded != 0)
						viewsTop += selectedImageView.height;
					selectedImageView.viewsTop = viewsTop;

				} else {
					selectedImageView.viewsTop = viewsTop;
				}

				if ((totalLoaded % 4 == 0) && Alloy.isTablet || totalLoaded == 0) {
					if ((totalLoaded % 4 == 0) && Alloy.isHandheld)
						currentSize += selectedImageView.height;

					if (totalLoaded != 0)
						viewsTop += selectedImageView.height;
					selectedImageView.viewsTop = viewsTop;
				} else {
					selectedImageView.viewsTop = viewsTop;
				}
				console.log("totalLoaded:" + (totalLoaded) + "     electedImageView.viewsTop:" + selectedImageView.viewsTop + "   selectedImageView.id:" + selectedImageView.id + "      viewsTop:" + viewsTop);
				totalLoaded++;

				$.selectImage.add(selectedImageView);
			}

			if ((totalLoaded % range == 0) && i > range-1) {
				loaderView = Ti.UI.createView({
					id : "loaderView",
					height : 50,
					top : 0,
					width : $.selectImage.width,
					backgroundColor : "transparent",
					// bottom : 50,
					viewsTop : (viewsTop + 50),
					touchEnabled:false
				});
				
				loading = Ti.UI.createActivityIndicator({
					height : Ti.UI.FILL,
					width : 50,
					backgroundColor : 'transparent',
					borderRadius : 10,
					style : Ti.UI.ActivityIndicatorStyle.BIG,
					indicatorColor : 'white',
				}); 
				loaderView.add(loading);
				$.selectImage.add(loaderView);
			}
		}
	}
	setTimeout(function() {

		// give some time to the previous loop
		// adjust miliseconds according to your data source speed
		isLoading = false;
	}, 1);

	console.log("count:" + count);

	count++;
}

function getTick() {
	for (var i = 0; i < totalLoaded; i++) {
		
		if (Alloy.Globals.categoryData.isDownloaded[i] == 1) {
			$.selectImage.getChildren()[i].getChildren()[$.selectImage.getChildren()[0].getChildren().length - 2].visible = false;
			$.selectImage.getChildren()[i].getChildren()[$.selectImage.getChildren()[0].getChildren().length - 3].visible = false;
		}
		
		$.selectImage.getChildren()[i].getChildren()[$.selectImage.getChildren()[0].getChildren().length - 1].visible = false;
		if (Alloy.Globals.solvedPuzzle[Alloy.Globals.puzzleType][matrixMode][i] == 1) {
			$.selectImage.getChildren()[i].getChildren()[$.selectImage.getChildren()[0].getChildren().length - 1].visible = true;
		}
	}
}

// cross-platform event listener for lazy tableview loading
function lazyload(_evt) {
	
	_evt.source.getChildren()[_evt.source.getChildren().length - 1].getChildren()[0].show();

	
	var loaderViewsPosition = ((_evt.source.getChildren()[_evt.source.getChildren().length - 1].viewsTop - ( OS_IOS ? _evt.y : Alloy.Globals.pixelToDp(_evt.y))));
	if (loaderViewsPosition >= (initialTableSize - overlap-50)  && loaderViewsPosition <= (initialTableSize - overlap+50)) {// currentSize - overlap < _evt.y + initialTableSize
        
		if (Alloy.Globals.categoryData.images.length == _evt.source.getChildren().length) {
			return;
		} else {
			if (isLoading == true) {
				return;
			} else {
				isLoading = true;
				if (Alloy.Globals.categoryData.images.length == _evt.source.getChildren().length) {
					return;
				} else {
					setTimeout(function() {
						_evt.source.remove(_evt.source.getChildren()[_evt.source.getChildren().length - 1]);
						readDataFromJSON();

						getTick();
					}, 100); 
				}

			}
		}
	}

}

readDataFromJSON();
$.categoryNameWindow.addEventListener('focus', function(e) {
	getTick();
	Ti.UI.orientation = Ti.UI.PORTRAIT;
	
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
});

$.categoryNameWindow.addEventListener('click', function(e) {

	console.log("source----" + e.source.id);

	if (e.source.getParent() == $.matrixType) {
		Alloy.Globals.audio.start();

		Alloy.Globals.clickEffect(e.source, null);
		for (var i = 0; i < $.matrixType.getChildren().length; i++) {

			if (e.source.id == $.matrixType.getChildren()[i].id && e.source.id != 'matrix') {
				e.source.borderColor = 'white';
				e.source.borderWidth = '3';
				matrixMode = e.source.id2;
				 getTick();
			} else {
				$.matrixType.getChildren()[i].borderColor = 'transparent';
			}
		}
	}

	if (e.source.getParent() == $.selectImage) {
		console.log("image:" + e.source.id);
		var moveToNextPage = function() {
			var mode;
			if (matrixMode == 2) {
				mode = "2x2";
			}
			if (matrixMode == 3) {
				mode = "3x3";
			}
			if (matrixMode == 4) {
				mode = "4x4";
			}
			if (matrixMode == 5) {
				mode = "5x5";
			}
			Alloy.Globals.captureEvent("jigsawmatrix_button_click", {
				mode : mode
			});

			if (e.source.getChildren()[3].visible == false && e.source.getChildren()[4].visible == false) {
				Alloy.Globals.letsGo.start();
				Alloy.Globals.captureEvent("puzzle_image_click", {
					imagename : Alloy.Globals.categoryData.images[e.source.id]
				});
				var puzzleScreen = Alloy.createController('puzzleScreen', {
					imageId : e.source.id,
					mode : matrixMode
				});
				$.categoryNameWindow.open(puzzleScreen);
			} else {

				var lockScreen = Alloy.createController('lockScreen', {
					lockScreenView : $.subscription,
					id : "subscription"
				});
				$.categoryNameWindow.open(lockScreen);
			}
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}

	if (e.source.id == "backButton") {
		Alloy.Globals.audio.start();
		var moveToNextPage = function() {
			$.categoryNameWindow.close();
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
	}
});

$.categoryNameWindow.open();

