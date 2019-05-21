// Arguments passed into this controller can be accessed via the `$.args` object directly or:
 var args = $.args;

var boxWidth;
$.totalNumberOfCategoriesToUnlock.text = '/'+args.limit; 
function readDataFromJSON() {

	for (var i = 0; i < Alloy.Globals.categoryData.images.length; i++) {

		console.log('--------' + Alloy.Globals.categoryData.images[i]);
		var selectedImageView = Ti.UI.createView({
			top : 0,
			width : boxWidth,
			height : (Alloy.isTablet) ? boxWidth + 50 : boxWidth + 30,
			id : i,
			id2 : 'selectedImageView'
			// borderColor:'red'
		});

		var whiteBorder = Ti.UI.createImageView({
			id : i,
			image : '/images/ImageBox.png',
			width : boxWidth,
			height : boxWidth,
			visible : true,
			top : '5%',
			touchEnabled : false,
			id2 : 'whiteBorder'
		});

		var viewLock = Ti.UI.createView({
			width : '25%',
			height : '25%',
			backgroundImage : '/images/Lock.png',
			left : '5%',
			top : "0%",
			visible : false,
			touchEnabled : false,
			id2 : 'viewLock'
		});

		var img = Ti.UI.createImageView({
			//id:'img',
			image : "/images/" + Alloy.Globals.categoryData.images[i] + ".jpg",
			defaultImage : '/images/NoImage.png',
			width : '78%',
			height : '57%',
			touchEnabled : false,
			borderRadius : '5',
			top : '13%',
			id2 : 'img'

		});

		var tickImage = Ti.UI.createImageView({
			backgroundImage : '/images/ImageBoxSelected.png',
			height : boxWidth,
			width : boxWidth,
			visible : false,
			id : 'tick',
			touchEnabled : false,
			top : '0%',
			id2 : 'tickImage',
			bool : true
		});

		var nameOfCategory = Ti.UI.createLabel({
			top : "77%",
			text : Alloy.Globals.categoryData.imageName[i], //
			font : {
				fontFamily : 'BubbleGum',
				fontSize : (Alloy.isTablet) ? 25 : 15,
			},
			textAlign : 'center',
			color : "white",
			touchEnabled : false,
			id2 : 'nameOfCategory'
		});

		lockImage = Ti.UI.createImageView({
			width : boxWidth,
			height : boxWidth,
			image : '/images/ImageBoxLocked.png',
			touchEnabled : false,
			visible : false,
			top : '5%',
			id2 : 'lockImage'
		});

		selectedImageView.add(nameOfCategory);
		selectedImageView.add(img);
		whiteBorder.add(tickImage);
		selectedImageView.add(whiteBorder);
		selectedImageView.add(lockImage);
		selectedImageView.add(viewLock);

		if(args.limit == 10){
				//tickImage.visible = true;
			
		}
		// if (Alloy.Globals.solvedPuzzle[Alloy.Globals.puzzleType][matrixMode][i] == 1) {
			// tickImage.visible = true;
		// }

		// if (_.max(Alloy.Globals.purchasedPlan.purchasedPlan) == Alloy.Globals.purchasedPlan.length) {
// 
			// viewLock.visible = false;
		// }

		// if (i >= locked) {
			// lockImage.visible = true;
			// viewLock.visible = true;
// 
		// }

		$.selectImage.add(selectedImageView);
		//console.log("bool---"+e.source.getChildren()[1].getChildren()[1]);

	}

}
var counter = 0;
var categoryToUnlocked = [];
$.unlockImagePage.addEventListener('click',function(e){
	
	/*if(e.source.id2 == 'selectedImageView')
	{
		e.source.getChildren()[2].getChildren()[0].visible = true;
		// alert(e.source.getChildren()[0].getChildren()[0].id2);
	}*/
	
	if (e.source.apiName == 'Ti.UI.View' && e.source.getParent() == $.selectImage) {
		Alloy.Globals.audio.start();
		if (e.source.getChildren()[2].getChildren()[0].bool == true) {

			if (counter < args.limit) {
				// alert(e.source.getChildren()[1].getChildren()[1] );
				e.source.getChildren()[2].getChildren()[0].visible = true;
				e.source.getChildren()[2].getChildren()[0].bool = false;
				counter++;
				$.count.text = counter;
				categoryToUnlocked.push(e.source.id);
				console.log("increament"  + "  "+JSON.stringify(e.source) );    ///////
				// alert(e.source.id); 
			} else {
				alert("max selection reached");
			}
		}
		else if (e.source.getChildren()[2].getChildren()[0].bool == false) {
			e.source.getChildren()[2].getChildren()[0].visible = false;
			e.source.getChildren()[2].getChildren()[0].bool = true;
			counter--;
			$.count.text = counter;
			categoryToUnlocked.splice(_.indexOf(categoryToUnlocked, e.source.id), 1);

			console.log("decreament" + categoryToUnlocked);
	}
} 

if (e.source.apiName == "Ti.UI.Label") {
	Alloy.Globals.audio.start();
		//$.progressBarView.visible = true;
		console.log("categoryToUnlocked:" + categoryToUnlocked.length);
		if (categoryToUnlocked != null) {
			var unlockedCatogory = Alloy.Globals.categoryData;
			//console.log("isSubscribed:" + Alloy.Globals.categoryData[categoryToUnlocked[0]].isSubscribed);
			//console.log('catLength123------'+categoryToUnlocked.length);
			for (var i = 0; i < categoryToUnlocked.length; i++) {
				console.log("unlockedCatogory:---"+JSON.stringify(unlockedCatogory));
				unlockedCatogory[categoryToUnlocked[i]].isSubscribed = 1;
				var UnlockedImages = _.countBy(Alloy.Globals.categoryData[categoryToUnlocked[i]].isDownloaded, function(num) {
					return num == 0;
				}); 

				totalNumberOfUnlockedImages += UnlockedImages.true;
				//totalNumberOfUnlockedImages += Alloy.Globals.categoryData[categoryToUnlocked[i]].images.length; 	unknown code from mukesh's file '
				

				if (args.rewarded) {
					unlockedCatogory[categoryToUnlocked[i]].videoWatchedDate = Ti.App.Properties.getString("advWatchTime");
				}

				// }
				console.log("isSubscribed:" + Alloy.Globals.categoryData[categoryToUnlocked[i]].name + "         " + Alloy.Globals.categoryData[categoryToUnlocked[i]].isSubscribed);
				console.log("watch Date:" + Alloy.Globals.categoryData[categoryToUnlocked[i]].videoWatchedDate);

			}
			Ti.App.Properties.setObject(Alloy.Globals.setCategoryData, unlockedCatogory);
			console.log("totalNumberOfUnlockedImages:" + totalNumberOfUnlockedImages);
			downloadImage();

		} else {
			alert("please select catogory");
		}
	}
	
});


$.unlockImagePage.addEventListener('open', function(e) {
	
	if(e.source.getOrientation() == 1)
	{
		var platformWidth = OS_IOS ? Ti.Platform.displayCaps.platformWidth : pixelToDp(Ti.Platform.displayCaps.platformWidth);
		var scrollWidth = (platformWidth*0.98);
		boxWidth = (scrollWidth/3);
	}
	readDataFromJSON();
	for(var i =0; i < $.selectImage.getChildren()[0].getChildren().length; i++)
	{
		console.log(e.source.id +"  "+$.selectImage.getChildren()[0].getChildren()[2].getChildren()[0].id2);
	}
});

$.unlockImagePage.open();
