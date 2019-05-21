/**
 * Copyright (c) 2011 by Studio Classics. All Rights Reserved.
 * Author: Brian Kurzius
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

var Admob = require('ti.admob');

if(OS_ANDROID){
	var win = Titanium.UI.createWindow({
	backgroundColor: "#FFFFFF"
});

// require AdMob

// check if google play services are available
var code = Admob.isGooglePlayServicesAvailable();
if (code != Admob.SUCCESS) {
    alert("Google Play Services is not installed/updated/available");
}

// then create an adMob view
var adMobView = Admob.createView({
    publisherId:"<<YOUR PUBLISHER ID HERE>>",
    testing:false, // default is false
    //top: 10, //optional
    //left: 0, // optional
    //right: 0, // optional
    bottom: 0, // optional
    adBackgroundColor:"FF8855", // optional
    backgroundColorTop: "738000", //optional - Gradient background color at top
    borderColor: "#000000", // optional - Border color
    textColor: "#000000", // optional - Text color
    urlColor: "#00FF00", // optional - URL color
    linkColor: "#0000FF" //optional -  Link text color
    //primaryTextColor: "blue", // deprecated -- now maps to textColor
    //secondaryTextColor: "green" // deprecated -- now maps to linkColor
    
});


//listener for adReceived
adMobView.addEventListener(Admob.AD_RECEIVED,function(){
   // alert("ad received");
   Ti.API.info("ad received");
});

//listener for adNotReceived
adMobView.addEventListener(Admob.AD_NOT_RECEIVED,function(){
    //alert("ad not received");
     Ti.API.info("ad not received");
});


var adRequestBtn = Ti.UI.createButton({
    title:"Request an ad",
    top:"10%",
    height: "10%",
    width: "80%"
});

adRequestBtn.addEventListener("click",function(){
    adMobView.requestAd();
});

var adRequestBtn2 = Ti.UI.createButton({
    title: "Request a test ad",
    top: "25%",
    height: "10%",
    width: "80%"
});

adRequestBtn2.addEventListener("click",function(){
    adMobView.requestTestAd();
});

var getAAID = Ti.UI.createButton({
    title: "Get AAID",
    top: "40%",
    height: "10%",
    width: "80%"
});

var getIsAdTrackingLimited = Ti.UI.createButton({
    title: "Is Ad tracking limited",
    top: "55%",
    height: "10%",
    width: "80%"
});

getAAID.addEventListener('click', function() {
    Admob.getAndroidAdId(function (data) {
        Ti.API.info('AAID is ' + data.aaID);
    });
});

getIsAdTrackingLimited.addEventListener('click', function() {
    Admob.isLimitAdTrackingEnabled(function (data) {
        Ti.API.info('Ad tracking is limited: ' + data.isLimitAdTrackingEnabled);
    });
});

win.add(adMobView);
win.add(adRequestBtn);
win.add(adRequestBtn2);
win.add(getAAID);
win.add(getIsAdTrackingLimited);
win.open();
}



if(OS_IOS){
	var win = Ti.UI.createWindow({
    backgroundColor: 'white',
    orientationModes: [Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
});

/*
 We'll make two ads. This first one doesn't care about where the user is located.
 */
var ad1 = Admob.createView({
    height: 50,
    bottom: 0,
    debugEnabled: true, // If enabled, a dummy value for `adUnitId` will be used to test
    adType: Admob.AD_TYPE_BANNER,
    adUnitId: '<<YOUR ADD UNIT ID HERE>>', // You can get your own at http: //www.admob.com/
    adBackgroundColor: 'black',
    testDevices: [Admob.SIMULATOR_ID], // You can get your device's id by looking in the console log
    dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
    gender: Admob.GENDER_MALE, // GENDER_MALE, GENDER_FEMALE or GENDER_UNKNOWN, default: GENDER_UNKNOWN
    contentURL: 'https://admob.com', // URL string for a webpage whose content matches the app content.
    requestAgent: 'Titanium Mobile App', // String that identifies the ad request's origin.
    extras: {
       'version': 1.0,
       'name': 'My App'
    }, // Object of additional infos
    tagForChildDirectedTreatment: false, // http:///business.ftc.gov/privacy-and-security/childrens-privacy for more infos
    keywords: ['keyword1', 'keyword2']
});
win.add(ad1);

ad1.addEventListener('didReceiveAd', function(e) {
    Ti.API.info('Did receive ad: ' + e.adUnitId + '!');
});
ad1.addEventListener('didFailToReceiveAd', function(e) {
    Ti.API.error('Failed to receive ad: ' + e.error);
});
ad1.addEventListener('willPresentScreen', function() {
    Ti.API.info('Presenting screen!');
});
ad1.addEventListener('willDismissScreen', function() {
    Ti.API.info('Dismissing screen!');
});
ad1.addEventListener('didDismissScreen', function() {
    Ti.API.info('Dismissed screen!');
});
ad1.addEventListener('willLeaveApplication', function() {
    Ti.API.info('Leaving the app!');
});
ad1.addEventListener('didReceiveInAppPurchase', function(e) {
    Ti.API.info('Did receive an In-App purchase: ' + e.productId + '!');
    Ti.API.info(e);
});

var btn = Ti.UI.createButton({
    title: 'Show interstitial'
});

btn.addEventListener('click', function() {
    var ad2 = Admob.createView({
        debugEnabled: true, // If enabled, a dummy value for `adUnitId` will be used to test
        adType: Admob.AD_TYPE_INTERSTITIAL,
        adUnitId: '<<YOUR ADD UNIT ID HERE>>', // You can get your own at http: //www.admob.com/
        testDevices: [Admob.SIMULATOR_ID], // You can get your device's id by looking in the console log
        dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
        gender: Admob.GENDER_MALE, // GENDER_MALE or GENDER_FEMALE, default: undefined
        keywords: ['keyword1', 'keyword2']
    });
    ad2.receive();

    ad2.addEventListener('didReceiveAd', function(e) {
        Ti.API.info('Did receive ad!');
    });

    ad2.addEventListener('didFailToReceiveAd', function(e) {
        Ti.API.error('Failed to receive ad: ' + e.error);
    });
});

win.add(btn);

win.add(Ti.UI.createLabel({
    text: 'Loading the ads now! ' +
        'Note that there may be a several minute delay ' +
        'if you have not viewed an ad in over 24 hours.',
    top: 40,
    textAlign: 'center'
}));
win.open();
}
