var args = $.args;

console.log("limit alert:" + args.title);

$.alertPage.addEventListener('open', function(e) {
	$.textField.text = args.title;
	$.ok_cancel_label.text = args.buttonText;

	if (e.source.getOrientation() == 1) {
		$.alertPopup.width = Alloy.Globals.dpFromPercent(80, e.source.getOrientation());
		$.alertPopup.height = Alloy.Globals.dpFromPercent(60, e.source.getOrientation());
	}

});
var counter = 0;
$.btn.addEventListener('click', function(e) {
	Alloy.Globals.audio.start();

	// args.alertScreenView.visible = false;

	var moveToNextPage = function() {
		if (args.id != undefined && (args.id == "internet" || args.id == "allImagesUnlocked" || args.id == 'RewardedNoloaded' || args.id == "noAds")) {
			console.log('inside Alert No Ads if------------------->');
			$.alertPage.close();
			
		} else {
			if(args.id != "purchaseCompleteNoAds"){
				console.log('inside Alert No Ads else------------------->');
				Ti.App.fireEvent("closeWindow");
				var jsonUpdate = Alloy.Globals.categoryData;
				for (var i = 0; i < Alloy.Globals.categoryData.isDownloaded.length; i++) {
	
					if (Alloy.Globals.categoryData.isDownloaded[i] == 0 && counter < args.limit) {
						console.log("inside for loop:" + Alloy.Globals.categoryData.isDownloaded[i] + "       i:" + i);
	
						jsonUpdate.isDownloaded[i] = 1;
	
						console.log('JSON Update------' + JSON.stringify(Alloy.Globals.categoryData.isDownloaded) + "     counter:" + counter);
						counter++;
	
					}
				}
				Ti.App.Properties.setObject(Alloy.Globals.setCategoryData, jsonUpdate);
				if (Alloy.Globals.categoryJSONFile.exists()) {
					Alloy.Globals.categoryJSONFile.write(JSON.stringify(Alloy.Globals.categoryData));
				}
				$.alertPage.close();
			}
			
		}

		if (args.id != undefined && args.id == "complete" || args.id == "purchaseCompleteNoAds") {
			console.log('inside Alert No Ads------------------->');
			$.alertPage.close();
			var startPage = Alloy.createController('index', {
				page:$.alertPage
			});
			// $.alertPage.open(startPage);
			
			
		}
		

	};
	Alloy.Globals.clickEffect(e.source, moveToNextPage);

});



if (OS_ANDROID) {
	$.alertPage.opacity = 200;
}

$.alertPage.open();
