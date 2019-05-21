var args = $.args;

$.alertPage.addEventListener('open', function(e) {
	$.textField.text = "You have completed all the available puzzles. Click on subscribe to get more puzzles.";

	if (e.source.getOrientation() == 1) {
		if (Alloy.isHandheld) {
			$.alertPopup.width = Alloy.Globals.dpFromPercent(80, e.source.getOrientation());
			$.alertPopup.height = Alloy.Globals.dpFromPercent(63, e.source.getOrientation());
			console.log($.alertPopup.width+"         h:"+$.alertPopup.height);
		}

		if (Alloy.isTablet) {
			$.alertPopup.width = Alloy.Globals.dpFromPercent(80, e.source.getOrientation());
			$.alertPopup.height = Alloy.Globals.dpFromPercent(50, e.source.getOrientation());
			
			console.log($.alertPopup.width+"         h:"+$.alertPopup.height);
		}

	}

});

$.alertPage.addEventListener('click', function(e) {

	if (e.source.id == 'subscribeBtn') {
		Alloy.Globals.audio.start();
		var moveToNextPage = function() {
			if (Ti.Network.online) {
				var lockScreen = Alloy.createController('lockScreen', {
					id : "subscription",
					lockScreenView : $.alertPage,
				});
				// $.alertPage.open(lockScreen);
				// $.alertPage.close();
			}else {
					var lockScreen = Alloy.createController('AlertPage', {    ///alert page no internet connection
						alertScreenView : $.anotherView,
						title : 'Please check your internet connection!!!',
						buttonText : "Ok",
						id : "internet"
					}); 
			}
			$.alertPage.open(lockScreen);
			$.alertPage.close();
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);

	}

	if (e.source.id == 'cancelBtn') {
		Alloy.Globals.audio.start();
		var moveToNextPage = function() {
			$.alertPage.close();
		};
		Alloy.Globals.clickEffect(e.source, moveToNextPage);
		// args.subscription.visible = false;
	}

});

if(OS_ANDROID){
	$.alertPage.opacity = 200;
}



$.alertPage.open();
