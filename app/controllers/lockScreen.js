var args = $.args;

// Alloy.Globals.appInBackground($.lockScreen);

function screenOrientationPortrait(orientation) {
	// $.removeClass($.popUpWindowChild, "popUpWindowChildLandscape");
	// $.addClass($.popUpWindowChild, "popUpWindowChild");
	//
	// $.removeClass($.crossButton, 'crossButtonLandscape');
	// $.addClass($.crossButton, 'crossButton');
	//
	// $.removeClass($.demo, 'demoLandscape');
	// $.addClass($.demo, 'demo');
	//
	// $.removeClass($.lockKeyWraper, 'lockKeyWraperLandscape');
	// $.addClass($.lockKeyWraper, 'lockKeyWraper');
	//
	// $.removeClass($.code1, 'code1Landscape lockCodeLandscape');
	// $.removeClass($.code2, 'code2Landscape lockCodeLandscape');
	// $.removeClass($.code3, 'code3Landscape lockCodeLandscape');
	//
	// $.addClass($.code1, 'code1 lockCode');
	// $.addClass($.code2, 'code2 lockCode');
	// $.addClass($.code3, 'code3 lockCode');
	//
	// $.removeClass($.pickerWraper, 'pickerWraperLandscape');
	// $.addClass($.pickerWraper, 'pickerWraper');
	//
	// $.removeClass($.selectedCodeBackground, 'selectedCodeBackgroundLandscape');
	// $.addClass($.selectedCodeBackground, 'selectedCodeBackground');

	if (Alloy.isHandheld) {

		$.extraView.width = Alloy.Globals.dpFromPercent(90, orientation);
		$.extraView.height = Alloy.Globals.dpFromPercent(90, orientation) + Alloy.Globals.dpFromPercent(45, orientation);

		$.popUpWindowChild.width = Alloy.Globals.dpFromPercent(90, orientation);
		$.popUpWindowChild.height = Alloy.Globals.dpFromPercent(90, orientation) + Alloy.Globals.dpFromPercent(45, orientation);
	}

	if (Alloy.isTablet) {
		$.extraView.width = Alloy.Globals.dpFromPercent(70, orientation);
		$.extraView.height = Alloy.Globals.dpFromPercent(70, orientation) + Alloy.Globals.dpFromPercent(35, orientation);
		

		$.popUpWindowChild.width = Alloy.Globals.dpFromPercent(70, orientation);
		$.popUpWindowChild.height = Alloy.Globals.dpFromPercent(70, orientation) + Alloy.Globals.dpFromPercent(35, orientation);
	}
}

// Ti.Gesture.addEventListener('orientationchange', function(e) {
//
// // if(e.orientation == 3)
// // {
// // screenOrientationLandscape(e.orientation);
// // }
//
// if (e.orientation == 1) {
// screenOrientationPortrait(1);
// }
//
// });

function closeLastView(e) {

	// $.popUpWindow.visible = false;
	Alloy.Globals.audio.start();
	var moveToNextPage = function() {
		$.lockScreen.close();
	};
	Alloy.Globals.clickEffect(e.source, moveToNextPage);
	// $.popUpWindow.hide();

	// args.lockScreenView.visible = false;

}

function lastWindow(e) {

	// $.popUpWindow.visible = true;

	var numInWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
	var random1 = [],
	    valuePicker = [];

	for (var i = 0; i < 3; i++) {
		random1.push(Math.floor((Math.random() * 9)));
		if (random1[0] == 0 && random1[1] == 0 && random1[2] == 0) {
			random1[0] = 1;
			random1[2] = 6;
		}
	}

	var newNum = random1.slice(0);
	for (var i = 0; i < numInWords.length; i++) {
		if (random1[0] == i) {
			random1[0] = numInWords[i];
		}
		if (random1[1] == i) {
			random1[1] = numInWords[i];
		}
		if (random1[2] == i) {
			random1[2] = numInWords[i];
		}
	}

	var text = random1[0] + "  " + random1[1] + "  " + random1[2];
	$.code1.setText(random1[0]);
	$.code2.setText(random1[1]);
	$.code3.setText(random1[2]);

	// if (visibility == false) {
	// $.popUpWindow.visible = true;
	// }
	if (OS_IOS) {
		$.picker.setSelectedRow(0, 0, false);
		$.picker.setSelectedRow(1, 0, false);
		$.picker.setSelectedRow(2, 0, false);

		$.picker.addEventListener('change', function(e) {
			if (e.source.getSelectedRow(0).children[0].text == newNum[0] && e.source.getSelectedRow(1).children[0].text == newNum[1] && e.source.getSelectedRow(2).children[0].text == newNum[2]) {

				if (args.id == 'setting') {

					Alloy.Globals.audio.start();
					var settings = Alloy.createController('settings', {
						lockscreen : args.lockScreenView,
						win : $.popUpWindow
					});
					$.lockScreen.open(settings);
					$.lockScreen.close();
				}

				if (args.id == 'subscription') {

					Alloy.Globals.audio.start();

					// if (args.puzzleScreen == undefined) {
					var subscription = Alloy.createController('subscriptionScreen', {
						lockscreen : args.lockScreenView,
						win : $.popUpWindow
					});
					$.lockScreen.open(subscription);
					$.lockScreen.close();

					// } else {
					// args.puzzleScreen.close();
					// var subscription = Alloy.createController('subscriptionScreen', {
					// lockscreen : args.lockScreenView,
					// win : $.win
					// }).getView();
					// }

				}

			}
		});
	}

	if (OS_ANDROID) {

		var lockCodeArray = [0, 0, 0];

		function checkLockCode() {

			if (lockCodeArray[0] == newNum[0] && lockCodeArray[1] == newNum[1] && lockCodeArray[2] == newNum[2]) {

				if (args.id == 'setting') {

					Alloy.Globals.audio.start();
					var settings = Alloy.createController('settings', {
						lockscreen : args.lockScreenView,
						win : $.popUpWindow,
						// win : $.win
					});
					$.lockScreen.open(settings);
					$.lockScreen.close();
				}

				if (args.id == 'subscription') {

					Alloy.Globals.audio.start();
					var subscription = Alloy.createController('subscriptionScreen', {
						lockscreen : args.lockScreenView,
						win : $.popUpWindow
						// win : $.win
					});
					$.lockScreen.open(subscription);
					$.lockScreen.close();

				}
			}

		}

		var opts = {
			cancel : 2,
			options : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			selectedIndex : 0,
			// destructive: 0,
			// title: 'Delete File?'
		};
		var dialog1 = Ti.UI.createOptionDialog(opts);
		var dialog2 = Ti.UI.createOptionDialog(opts);
		var dialog3 = Ti.UI.createOptionDialog(opts);

		// $.pickerWraper.addEventListener('click', function(e) {
		//
		// });

		$.column1.addEventListener('click', function(e) {
			Alloy.Globals.audio.start();

			dialog1.show();
			dialog1.addEventListener('click', function(e1) {
				Alloy.Globals.audio.start();
				e.source.getChildren()[0].text = e1.index;
				lockCodeArray[0] = e1.index;
				dialog1.hide();
				checkLockCode();
			});
		});
		$.column2.addEventListener('click', function(e) {
			Alloy.Globals.audio.start();

			dialog2.show();
			dialog2.addEventListener('click', function(e1) {
				Alloy.Globals.audio.start();
				e.source.getChildren()[0].text = e1.index;
				lockCodeArray[1] = e1.index;
				dialog1.hide();
				checkLockCode();
			});
		});
		$.column3.addEventListener('click', function(e) {
			Alloy.Globals.audio.start();

			dialog3.show();
			dialog3.addEventListener('click', function(e1) {
				Alloy.Globals.audio.start();
				e.source.getChildren()[0].text = e1.index;
				lockCodeArray[2] = e1.index;
				dialog1.hide();
				checkLockCode();
			});
		});

	}

}

lastWindow();

screenOrientationPortrait(1);

	if(OS_ANDROID)
	{
		$.lockScreen.opacity = 200;
	}

$.lockScreen.open();
