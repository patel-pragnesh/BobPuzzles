var args = $.args;

var goodJob = ["/images/seq1_tinified/GoodJob_02.png", "/images/seq1_tinified/GoodJob_03.png", "/images/seq1_tinified/GoodJob_04.png", "/images/seq1_tinified/GoodJob_05.png", "/images/seq1_tinified/GoodJob_06.png", "/images/seq1_tinified/GoodJob_07.png", "/images/seq1_tinified/GoodJob_08.png", "/images/seq1_tinified/GoodJob_09.png", "/images/seq1_tinified/GoodJob_10.png", "/images/seq1_tinified/GoodJob_11.png", "/images/seq1_tinified/GoodJob_12.png", "/images/seq1_tinified/GoodJob_13.png", "/images/seq1_tinified/GoodJob_14.png", "/images/seq1_tinified/GoodJob_15.png", "/images/seq1_tinified/GoodJob_16.png"];
var raysWheel = ["/images/seq2_tinified/Rays0001.png", "/images/seq2_tinified/Rays0002.png", "/images/seq2_tinified/Rays0003.png", "/images/seq2_tinified/Rays0004.png", "/images/seq2_tinified/Rays0005.png", "/images/seq2_tinified/Rays0006.png", "/images/seq2_tinified/Rays0007.png", "/images/seq2_tinified/Rays0008.png", "/images/seq2_tinified/Rays0009.png", "/images/seq2_tinified/Rays0010.png", "/images/seq2_tinified/Rays0011.png", "/images/seq2_tinified/Rays0012.png", "/images/seq2_tinified/Rays0013.png", "/images/seq2_tinified/Rays0014.png", "/images/seq2_tinified/Rays0015.png", "/images/seq2_tinified/Rays0016.png", "/images/seq2_tinified/Rays0017.png", "/images/seq2_tinified/Rays0018.png", "/images/seq2_tinified/Rays0019.png", "/images/seq2_tinified/Rays0020.png"];

$.raysWheel.images = raysWheel;
$.raysWheel.repeatCount = 0;
$.raysWheel.duration = 50;
$.goodJob.images = goodJob;
$.goodJob.repeatCount = 1;
$.goodJob.duration = 50;
$.goodJob.center = {
	x : args.platformWidth / 2,
	y : args.imgTop + args.imageHeight / 2 + 40
};

$.raysWheel.center = {
	x : args.platformWidth / 2,
	y : args.imgTop + args.imageHeight / 2
};



$.goodJob.start();
$.raysWheel.start();

