
JSPacMan = new function() {
var VERSION = '2.6';

// auto-start the game on loading
var gameAutoStart=true;

// config: game images to be loaded

var imgPath='pacimages/';
var pacimagesPng = [
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n',
	'o', 'p', 'q', 'r', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'food',
	'e0', 'e1', 'e2', 'e4', 'e8', 'ge',
	'g11', 'g12', 'g13', 'g21', 'g22', 'g23', 'g31', 'g32', 'g33',
	'g41', 'g42', 'g43', 'ga1', 'ga2', 'ga3', 'gn1', 'gn2', 'gn3', 'gx',
	'pb1', 'pf1', 'pf2', 'pf3', 'pl1', 'pl2', 'pl3', 'pr1', 'pr2', 'pr3',
	'px1', 'px2', 'px3', 'px4', 'px5', 'px6', 'px7',// 's',
	'bonus0', 'bonus1', 'bonus2', 'bonus3',
	'gameover', 'gamepaused',
	'mazebgmini'
];
var pacimagesGif = [
	'life_hi', 'life_lo', 'xx', 'neon_lo', 'neon_hi'
];

// config: image name references

var transparentGif='xx'; // must be GIF for msie 6 sake
var transparentImage='x'; // should be PNG, if sprites are PNGs

var pacAnimations = {
	'0': ['pr1', 'pr2', 'pr3'], // default, initial
	'1': ['pr1', 'pr2', 'pr3'], // right
	'2': ['pl1', 'pl2', 'pl3'], // left
	'4': ['pb1', 'pb1', 'pb1'], // up
	'8': ['pf1', 'pf2', 'pf3'], // down
	'x': ['px1', 'px2', 'px3', 'px4', 'px5', 'px6', 'px7'], // killed
	'xDelay': 174, // base-delay for kill animation
	'phases': 3,
	'cyclic': false // cycles or moves back & forth
};

var ghostAnimations = {
	// s .. standard, a .. panic, n .. blinking (end of panic), x .. caught, killed, e .. eyes only (travelling home)
	// eyes: directional states of eye-overlay (0: neutral/home, 1: right, 2: left, 4: up, 8: down)
	// phases: animation-steps (for states s, a, n)
	// cycles through steps or moves back & forth
	'1': {
		's': ['g11', 'g12', 'g13'],
		'a': ['ga1', 'ga2', 'ga3'],
		'n': ['gn1', 'gn2', 'gn3'],
		'x': 'gx',
		'e': 'ge',
		'eyes': {
			'0': 'e0',
			'1': 'e1',
			'2': 'e2',
			'4': 'e4',
			'8': 'e8'
		},
		'phases': 3,
		'cyclic': true
	},
	'2': {
		's': ['g21', 'g22', 'g23'],
		'a': ['ga1', 'ga2', 'ga3'],
		'n': ['gn1', 'gn2', 'gn3'],
		'x': 'gx',
		'e': 'ge',
		'eyes': {
			'0': 'e0',
			'1': 'e1',
			'2': 'e2',
			'4': 'e4',
			'8': 'e8'
		},
		'phases': 3,
		'cyclic': true
	},
	'3': {
		's': ['g31', 'g32', 'g33'],
		'a': ['ga1', 'ga2', 'ga3'],
		'n': ['gn1', 'gn2', 'gn3'],
		'x': 'gx',
		'e': 'ge',
		'eyes': {
			'0': 'e0',
			'1': 'e1',
			'2': 'e2',
			'4': 'e4',
			'8': 'e8'
		},
		'phases': 3,
		'cyclic': true
	},
	'4': {
		's': ['g41', 'g42', 'g43'],
		'a': ['ga1', 'ga2', 'ga3'],
		'n': ['gn1', 'gn2', 'gn3'],
		'x': 'gx',
		'e': 'ge',
		'eyes': {
			'0': 'e0',
			'1': 'e1',
			'2': 'e2',
			'4': 'e4',
			'8': 'e8'
		},
		'phases': 3,
		'cyclic': true
	}
};

var ghostsMoveEyesAtHome = true; // flag for eyes random movement in cage

var bonusImageNames = ['bonus0', 'bonus1', 'bonus2', 'bonus3'];

// config: use of semi-transparent PNG images (required for ie6 support)

var mazeTilesArePng= true;
var spritesArePng= true; // sprites: pac-man, ghosts, bonuses

// config: ui-element-ids

// required
var mazeElementId='pacmanMaze';
// other: use empty string to ignore or if not available
var scoreDisplayId='pacmanScoredisplay';
var hiScoreDisplayId='';
var levelNumberDisplayId='pacmanLeveldisplay';
var mazeSetSelectorId='pacmanMazeselect';
var gameControlPaneId='pacmanControls';
var animationSpeedIndicatorIdPrefix='pacmanNeon_s'; // indexed 0 ... n
var animationQualityIndicatorIdPrefix='pacmanNeon_q'; // indexed 0 ... n
var progressDialogId='pacmanProgress';
// required if 'progressDialogId' is in use
var progressbarId='pacmanProgressbar';
var progressbarValueId='pacmanProgressvalue';
var progressbarLength=160; // width in px
// dialogs
var restartDialogId='pacmanRestartdialog';
// remaining lifes indicators
var lifeIndicatorIds= ['pacmanLife1', 'pacmanLife2', 'pacmanLife3', 'pacmanLife4', 'pacmanLife5'];

// config ui image-refs (required, if animationSpeedIndicators or animationQualityIndicators used)
var animationSpeedIndicatorLo = 'neon_lo';
var animationSpeedIndicatorHi = 'neon_hi';
var animationQualityIndicatorLo = 'neon_lo';
var animationQualityIndicatorHi = 'neon_hi';

// life indicators should be GIFs (msie 6 ...)
var lifeImageRemaining='life_lo';
var lifeImageCurrent='life_hi';
var lifeImageExpired='xx';

// config: animation settings

var Settings = {
	speed: [282, 252, 228, 204], // delay in msecs
	quality: [5, 6, 7], // intermediate steps used to cross a tile
	speedFactor: [1.08, 1, 0.94], // correction factor for speed per quality
	speedValue: 1, // initial value (array index)
	qualityValue: 1, // initial value (array index)
	hitSensitivity: 0.96, // max. hit-radius relative to tile-width
	levelEndBlinking: true, // flag blink bg-color at end of level
	pillBlinkInterval: 0, // (msecs) set to zero for static display
	initialMazeMode: 'StandardLevels'
};

// config: sprite dimensions (in px)

var tileWidth= 27;
var pacWidth= 27;
var pacHeight= 27;
var ghostWidth= 27;
var ghostHeight= 27;
var pacGridOffsetX= 0;
var pacGridOffsetY= 0;
var ghostGridOffsetX= 0;
var ghostGridOffsetY= 0;
var bonusWidth= 27;
var bonusHeight= 27;

var gamepausedOffsetY=-17; // offset to vertical center
var gameoverOffsetY=-17; // offset to vertical center

var mazeBlinkColor=''; // color to blink the maze azt end of level (leave empty for default action)
var autoCenterDialogs = false;

// definitions

var MazeSets = {
	StandardLevels: [
		{
			color: "blueneon",
			backdrop: "mazebgmini",
			maze: [
				"ahhhhhhhhhhhhhhc",
				"vp............pv",
				"v.ahm.ahhc.lhc.v",
				"d.o...vxxq...o.b",
				"x...n.vxxt.n...x",
				"im.lg.bhhr.em.li",
				"v...v..x...v...v",
				"v.k.o.lhhm.o.k.v",
				"vp............pv",
				"bhhhhcxacxahhhhd"
			]
		},
		{
			color: "gold",
			backdrop: "mazebgmini",
			maze: [
				"ahhhihhhhhhihhhc",
				"v.p.o......o.p.v",
				"v.k...ahhc...k.v",
				"d...n.vxxq.n...b",
				"x.n.v.vxxt.v.n.x",
				"ihd.o.bhhr.o.bhi",
				"v......x.......v",
				"v.lm.n.lm.n.lm.v",
				"vp...v....v...pv",
				"bhhhhgxacxehhhhd"
			]
		},
		{
			color: "grass",
			backdrop: "mazebgmini",
			maze: [
				"ahhhhhhhhhhhhhhc",
				"v..p........p..v",
				"v.lhm.ahhc.lhm.v",
				"d.....vxxq.....b",
				"x.k.n.vxxt.n.k.x",
				"c...v.bhhr.v...a",
				"v.n.o..x...o.n.v",
				"v.o...lhhm...o.v",
				"v.p.n......n.p.v",
				"bhhhfcxacxafhhhd"
			]
		},
		{
			color: "cyan",
			backdrop: "mazebgmini",
			maze: [
				"ahhhhhhhhhhhhhhc",
				"v.p..........p.v",
				"v.k.n.ahhc.n.k.v",
				"d...v.vxxq.v...b",
				"x..ag.vxxt.ec..x",
				"im.bd.bhhr.bd.li",
				"v......x.......v",
				"v.k.lm.ac.lm.k.v",
				"v.p....bd....p.v",
				"bhhhhcxacxahhhhd"
			]
		},
		{
			color: "greenneon",
			backdrop: "mazebgmini",
			maze: [
				"ahhhhhhhhhhhhhhc",
				"v..............v",
				"vpahm.ahhc.lhcpv",
				"d.v...vxxq...v.b",
				"x.o.n.vxxt.n.o.x",
				"c...o.bhhr.o...a",
				"v.n....x.....n.v",
				"v.bm.lhhhhm.ld.v",
				"v.p..........p.v",
				"bhhhhcxacxahhhhd"
			]
		}
	]
};

var blinkRate=4;
var blinkSteps=6;
var pillFactor=1.75;
var pillMaxLength=18;
var eyesFactor=.75;
var bonusLifeScore=10000;
var ghostResetDelay=20;
var ghostResetAlpha=.7;
var ghostResetDelta=.05;


// internal vars

var msieLe6 = (window.pacmanMsieLe6)? true:false;
var soundActive=(window.JSPacManUI && JSPacManUI.soundActive())? true:false;

var f1= new Array();
var f2= new Array();
var fw= new Array();
var fft= new Array();
for (var i=1; i<=10; i++) {
	f1[i]=new Array();
	f2[i]=new Array();
	fw[i]=new Array();
	fft[i]=new Array();
}

var t1= [
	0,  // 0
	9,  // 1: rd
	10, // 2: ld
	5,  // 3: ru
	6,  // 4: lu
	13, // 5: rdu
	14, // 6: ldu
	11, // 7: rld
	7,  // 8: rlu
	15  // 9: rlud
];

var tx= new Array();
var ty= new Array();
tx[0]=0;  ty[0]=0;
tx[1]=1;  ty[1]=0;  //r
tx[2]=-1; ty[2]=0;  //l
tx[4]=0;  ty[4]=-1; //u
tx[8]=0;  ty[8]=1;  //d

var t2 = new Array();
t2[0]= [0];
t2[1]= [1];
t2[2]= [2];
t2[4]= [4];
t2[8]= [8];
t2[3]= [1, 2];
t2[9]= [1, 8];
t2[10]=[2, 8];
t2[12]=[4, 8];
t2[5]= [1, 4];
t2[6]= [2, 4];
t2[7]= [1, 2, 4];
t2[11]=[1, 2, 8];
t2[13]=[1, 4, 8];
t2[14]=[2, 4, 8];
t2[15]=[1, 2, 4, 8];

var tdx=[2, 0, 1];
var tdy=[4, 0, 8];

var t3 = new Array();
t3[0]=0; t3[1]=2; t3[2]=1; t3[4]=8; t3[8]=4;

var nextNodes= new Array();
var pacNext=null;
var pacLast=null;

var gHomePos= new Array( [5,9], [5,8], [4,9], [4,8]  );
var gHomeOffset= new Array( [0,1], [-2, 1], [0,-1], [-2,-1]);
var gbid= new Array(1,2,4,8);

var elements = new Object();
var mazeColor, mazeMode, imgRef, imgCnt, imgTotal, tileGrid, pillMinLength, bonusLength, levels, aStep, aSpeed, gameDelay

var g= new Array();

for (var i=1; i<=4; i++) {
	g[i]=new Ghost(i);
	g[i].bid=gbid[i-1];
	g[i].bm=15^gbid[i-1];
}
var pac= new Pacman();
var bonus=new Array();
	for (var i=1; i<=4; i++) bonus[i]=0;
var movedir=0;
var runThru=false;
var gameOn= false;
var pill= false;
var pillCnt= 0;
var food= 0;
var nLevel= 0;
var nScore=0;
var nLife=0;
var gStep, gStep2;
var phaseSet=true;
var bonusLifeCnt=0;
var pacInitDir=0;
var ghostInitDir=0;
var pGstrat, pGsLookahead;
var pillPeriode, pillCnt;
var isPause=false;
var restartDialogOn=false;
var gameTimer=null;
var enterTime=0;
var highScore=highScoreSaved=highScoreMin=0;
var highScoreCallback=null;

var aSpan= new Array();
var gSpan= new Array();
var gSpan2= new Array();

var gameStatus=0;
var statusCnt=0;
var ghostCnt=0;
var setupComplete=false;
var lastBgImageSrc='';
var pillBlink=false;
var pillBlinkTimer=null;
var pillPositions=[];
var gameLocked=true;

var ghostBonus=new Array(200,400,800,1600);

var isSpaceTile= {
	food:true, x:true, p:true, s:true
};

// colors

var colorDefs = {
	grey: '#d3d3d3',
	gold: '#ecd4a4',
	white: '#ffffff',
	cyan: '#93dcdc',
	blueneon: '#79c1cd',
	darkneon: '#6bc6e4',
	greenneon: '#93dcac',
	emerald: '#95e995',
	grass: '#bfe390',
	red: '#ec5c81',
	pueblored: '#e9708f',
	desert: '#cbb383',
	reddesert: '#fa9fb1',
	cranberry: '#ed99bb',
	velvet: '#c880f9',
	ice: '#b3e5e5',
	forest: '#74b092',
	lemon: '#e5e5af',
	plum: '#d8a8f0',
	midnight: '#8f8fcb'
};

var randomcolors= [
	'gold',
	'blueneon',
	'greenneon',
	'darkneon',
	'cyan',
	'grass',
	'pueblored',
	'velvet',
	'ice',
	'lemon',
	'plum',
	'midnight'
];

function getRandomColor() {
	return randomcolors[Math.floor(Math.random()*randomcolors.length)];
}


// constructors

function Ghost(i) {
	this.r= 0;
	this.c= 0;
	this.s= 0;
	this.d= 0;
	this.p= 0;
	this.pn= 0;
	this.z= 0;
	this.osx=0;
	this.osy=0;
	this.posx=0;
	this.posy=0;
	this.lastn=null;
	this.bid=0;
	this.bm=0;
	this.alpha=1;
	this.e=-1;
	this.lc='';
	this.pmax=ghostAnimations[i].phases-1;
}

function Pacman() {
	this.r= 0;
	this.c= 0;
	this.p= 0;
	this.pn= 0;
	this.dir= pacInitDir;
	this.md= 0;
	this.dx= 0;
	this.dy= 0;
	this.osx=0;
	this.osy=0;
	this.posx=0;
	this.posy=0;
	this.reversed=false;
	this.lc='';
	this.pmax=pacAnimations.phases-1;
}


// basics

function setMazeColor(clr, forced) {
	if (clr) {
		elements.maze.style.backgroundColor=(colorDefs[clr])? colorDefs[clr]:clr;
	}
	else if (forced) {
		elements.maze.style.backgroundColor='transparent';
	}
}

function setMazeBackdrop(bgimg) {
	if (bgimg && imgRef[bgimg]) {
		var src=imgRef[bgimg].src;
		if (src!=lastBgImageSrc) {
			if (msieLe6) {
				if (src.toLowerCase().indexOf('.png')==src.length-4) {
					elements.maze.style.filter= "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='"+src+"')";
					elements.maze.style.backgroundImage='none';
				}
				else {
					elements.maze.style.backgroundImage='url('+src+')';
					elements.maze.style.filter='';
				}
			}
			else {
				elements.maze.style.backgroundImage='url('+src+')';
			}
			lastBgImageSrc=src;
		}
	}
	else if (lastBgImageSrc) {
		elements.maze.style.backgroundImage='none';
		if (msieLe6) elements.maze.style.filter='';
		lastBgImageSrc='';
	}
}

function setVisibility(obj, v) {
	obj.style.visibility= (v)? 'visible' : 'hidden';
}

function setOpacity(obj,v) {
	if (typeof obj.style.opacity != 'undefined') {
		obj.style.opacity=v;
	}
	else if (typeof obj.style.filter != 'undefined') {
		if (!obj.style.filter) {
			if (v<1) obj.style.filter='progid:DXImageTransform.Microsoft.Alpha(Opacity='+Math.floor(v*100)+')';
		}
		else {
			if (v<1) {
				var f=obj.filters.item('DXImageTransform.Microsoft.Alpha');
				f.opacity = Math.floor(v*100);
				f.enabled = true;
			}
			else {
				obj.filters.item('DXImageTransform.Microsoft.Alpha').enabled = false;
			}
		}
	}
	else if (typeof obj.style.MozOpacity != 'undefined') {
		obj.style.MozOpacity=v;
	}
	else if (typeof obj.style.WebkitOpacity != 'undefined') {
		obj.style.WebkitOpacity=v;
	}
	else if (typeof obj.style.OOpacity != 'undefined') {
		obj.style.OOpacity=v;
	}
	else if (typeof obj.style.KhtmlOpacity != 'undefined') {
		obj.style.KhtmlOpacity=v;
	}
}

function getStyleProperty(element, cssSelector, camelCase) {
	var v;
	try {
		if ((element.style) && (element.style.getPropertyValue)) {
			v=element.style.getPropertyValue(cssSelector);
		}
		if (!v) {
			if ((document.defaultView) && (document.defaultView.getComputedStyle)) {
				var cs=document.defaultView.getComputedStyle(element, '');
				if (cs) v=cs.getPropertyValue(cssSelector);
			}
			else if (element.currentStyle) {
				if (!camelCase) camelCase=cssSelector;
				v=element.currentStyle[camelCase];
			}
		}
	}
	catch(e) {}
	return v;
}

function setImage(id, img) {
	var el=document.images[id];
	if (el) el.src=imgRef[img].src;
}

function setSpriteImg(obj, img) {
	obj.src=imgRef[img].src;
}

function moveElement(obj,x,y) {
	obj.style.left=x+'px';
	obj.style.top=y+'px';
}

function setMaze(r,c,s) {
	if (imgRef[s]) {
		tileGrid[r][c].src=imgRef[s].src;
	}
	else {
		tileGrid[r][c].src=imgRef[transparentImage].src;
	}
}

// msie-pre-7 png fixes

function setSpriteImgMsieLe6(obj, img) {
	obj.filters.item(0).src=imgRef[img].src;
}

function setMazeMsieLe6(r,c,s) {
	if (imgRef[s]) {
		tileGrid[r][c].filters.item(0).src=imgRef[s].src;
	}
	else {
		tileGrid[r][c].filters.item(0).src=imgRef[transparentImage].src;
	}
}


// controls & settings

function setQuality(v) {
	var s1=aStep;
	var s2=gStep;
	var s3=gStep2;
	aStep=Settings.quality[v];
	setSpan();
	pillMinLength=10*aStep;
	pillPeriode=(nLevel<6)? pillMaxLength*aStep : Math.max(pillMinLength, (pillMaxLength-nLevel+5)*aStep);
	bonusLength=10*aStep;
	if (animationQualityIndicatorIdPrefix) {
		if (Settings.qualityValue !=v) setImage(animationQualityIndicatorIdPrefix+Settings.qualityValue, animationQualityIndicatorLo);
		setImage(animationQualityIndicatorIdPrefix+v, animationQualityIndicatorHi);
	}
	Settings.qualityValue=v;
	var cf1=aStep/s1;
	var cf2=gStep/s2;
	var cf3=gStep2/s3;
	pac.osx=Math.round(pac.osx*cf1);
	pac.osy=Math.round(pac.osy*cf1);
	for (var i=1; i<=4; i++) {
		if (g[i].s==0) continue;
		if (pill && g[i].s==2) {
			g[i].osx=Math.round(g[i].osx*cf2);
			g[i].osy=Math.round(g[i].osy*cf2);
		}
		else if (g[i].s==3) {
			g[i].osx=Math.round(g[i].osx*cf3);
			g[i].osy=Math.round(g[i].osy*cf3);
		}
		else {
			g[i].osx=Math.round(g[i].osx*cf1);
			g[i].osy=Math.round(g[i].osy*cf1);
		}
	}
	setGameSpeed();
}

function setSpeed(v) {
	if (animationSpeedIndicatorIdPrefix) {
		if (Settings.speedValue!=v) setImage(animationSpeedIndicatorIdPrefix+Settings.speedValue, animationSpeedIndicatorLo);
		setImage(animationSpeedIndicatorIdPrefix+v, animationSpeedIndicatorHi);
	}
	Settings.speedValue=v;
	setGameSpeed();
}

function setGameSpeed() {
	aSpeed=Settings.speed[Settings.speedValue]*Settings.speedFactor[Settings.qualityValue];
	gameDelay=Math.round(aSpeed/aStep);
}

function setMazeMode(v) {
	if (MazeSets[v] || v=='RandomLevels') mazeMode=v;
}

// init, preload & setup

var initCalled=false;

function init() {
	initCalled=false;
	if (!document.getElementById || !document.createElement || !document.images) {
		alert('Sorry, DOM-compatible browser required (e.g. Mozilla, Firefox, Internet Explorer 5+, Safari, etc).\n ');
		return;
	}
	if (document.readyState=='complete' || document.readyState=='loaded') {
		setup();
	}
	else if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', initCallback, false );
		window.addEventListener('load', initCallback, false );
	}
	else if (document.attachEvent) {
		document.attachEvent('onreadystatechange', initCallback);
		document.attachEvent('onload', initCallback);
	}
	else {
		setTimeout( function() { initCallback(); }, 200);
	}
}

function initCallback() {
	if (initCalled) return;
	if (document.addEventListener) {
		document.removeEventListener('DOMContentLoaded', initCallback, false );
		document.removeEventListener('load', initCallback, false );
	}
	else if (document.attachEvent) {
		// IE<9
		if (document.readyState=='complete') {
			document.detachEvent('onreadystatechange', initCallback);
			document.detachEvent('onload', initCallback);
		}
		else {
			return;
		}
	}
	// check for readiness
	if (!document.getElementById(mazeElementId) || (progressDialogId && !document.getElementById(progressDialogId))) {
		// retry later
		setTimeout( function() { initCallback(); }, 200);
		return;
	}
	initCalled=true;
	setup();
}

function setup() {
	if (progressDialogId) {
		var obj=document.getElementById(progressDialogId);
		setVisibility(obj, true);
		if (autoCenterDialogs) centerElementOnBoard(obj);
	}
	preload();
}

function preload() {
	imgRef=new Object();
	imgCnt=0;
	imgTotal=pacimagesPng.length+pacimagesGif.length;
	var i, n, img;
	for (i=0; i<pacimagesPng.length; i++) {
		n=pacimagesPng[i];
		img=imgRef[n]=new Image();
		img.src=imgPath+n+'.png';
		if (img.complete) {
			imgTotal--;
		}
		else {
			img.onload=preloadHandler;
		}
	}
	for (i=0; i<pacimagesGif.length; i++) {
		n=pacimagesGif[i];
		img=imgRef[n]=new Image();
		img.src=imgPath+n+'.gif';
		if (img.complete) {
			imgTotal--;
		}
		else {
			img.onload=preloadHandler;
		}
	}
	if (imgTotal==0) preloadComplete();
}

function preloadHandler() {
	imgCnt++;
	if (progressDialogId) {
		var d=document.getElementById(progressbarId);
		var v = imgCnt/imgTotal;
		d.style.width=Math.round(progressbarLength*v)+'px';
		d=document.getElementById(progressbarValueId);
		d.innerHTML=Math.round(v*100)+'%';
	}
	if (imgCnt==imgTotal) setTimeout(function() { preloadComplete(); }, 10);
}

function preloadComplete() {
	if (progressDialogId) {
		var d=document.getElementById(progressDialogId);
		setVisibility(d, false);
		d.style.display='none';
	}
	elements.maze=document.getElementById(mazeElementId);
	if (scoreDisplayId) elements.scoredisplay=document.getElementById(scoreDisplayId);
	if (hiScoreDisplayId) elements.hiscoredisplay=document.getElementById(hiScoreDisplayId);
	if (levelNumberDisplayId) elements.leveldisplay=document.getElementById(levelNumberDisplayId);
	initMaze();
	initSprites();
	if (gameControlPaneId) setVisibility(document.getElementById(gameControlPaneId), true);
	initMazeMode();
	setQuality(Settings.qualityValue);
	setSpeed(Settings.speedValue);
	enableKeyboard();
	gameLocked=false;
	if (window.JSPacManUI) JSPacManUI.activateTouchControls();
	if (gameAutoStart) {
		setTimeout(function() { newGame(); }, 10);
	}
	else {
		keyLock=true;
	}
	setupComplete=true;
}

function initMazeMode() {
	mazeMode=Settings.initialMazeMode;
	levels=MazeSets[mazeMode];
	if (mazeSetSelectorId) {
		var select=document.getElementById(mazeSetSelectorId);
		if (select) {
			for (var i=0, l=select.options.length; i<l; i++) {
				if (select.options[i].value==mazeMode) {
					select.selectedIndex=i;
					return;
				}
			}
			select.selectedIndex=0;
		}
	}
}

function initMaze() {
	var r,c, img, st, styleTop, tgr;
	var transpSrc=imgRef[transparentImage].src;
	tileGrid=new Array();
	for (r=1; r<=10; r++) {
		tgr=tileGrid[r]=new Array();
		styleTop=tileWidth*(r-1)+'px';
		for (c=1; c<=16; c++) {
			img=document.createElement('img');
			st=img.style;
			st.width=st.height=tileWidth+'px';
			st.padding=0;
			st.position='absolute';
			st.top=styleTop;
			st.left=tileWidth*(c-1)+'px';
			st.zIndex=1;
			if (mazeTilesArePng && msieLe6) {
				img.src=imgRef[transparentGif].src;
				st.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+transpSrc+"', sizingMethod='scale')";
			}
			else {
				img.src=transpSrc;
			}
			elements.maze.appendChild(img);
			tgr[c]=img;
		}
	}
	// assert maze dimensions and position
	st=elements.maze;
	st.width=(tileWidth*16)+'px';
	st.height=(tileWidth*10)+'px';
	var position=st.position || getStyleProperty(elements.maze, 'position');
	if (!position || !position.match(/\b(absolute|relative|fixed)\b/i)) st.position='relative';
}

function initSprites() {
	var d, id, st, img, d2, obj;
	var transpSrc=imgRef[transparentImage].src;
	var misieFilter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+transpSrc+"', sizingMethod='scale')";
	// create pac-sprite
	d = elements.pac = document.createElement('div');
	st=d.style;
	st.visibility='hidden';
	st.height=pacHeight+'px';
	st.width=pacWidth+'px';
	st.position='absolute';
	st.zIndex=3;
	st.padding=st.margin=0;
	img = elements.pacimg = document.createElement('img');
	st=img.style;
	st.height=pacHeight+'px';
	st.width=pacWidth+'px';
	st.padding=st.margin=0;
	if (spritesArePng && msieLe6) {
		img.src=imgRef[transparentGif].src;
		st.filter=misieFilter;
	}
	else {
		img.src=transpSrc;
	}
	d.appendChild(img);
	elements.maze.appendChild(d);
	for (var i=1; i<=4; i++) {
		// create a ghost-sprite
		id='g'+i;
		d = elements[id] = document.createElement('div');
		st=d.style;
		st.visibility='hidden';
		st.height=ghostHeight+'px';
		st.width=ghostWidth+'px';
		st.position='absolute';
		st.padding=st.margin=0;
		st.zIndex=2;
		id='gbody'+i;
		d2= elements[id] = document.createElement('div');
		st=d2.style;
		st.height=ghostHeight+'px';
		st.width=ghostWidth+'px';
		st.position='absolute';
		st.left=st.top=0;
		st.padding=st.margin=0;
		st.zIndex=1;
		id='imgg'+i;
		img = elements[id] = document.createElement('img');
		st=img.style;
		st.height=ghostHeight+'px';
		st.width=ghostWidth+'px';
		st.padding=st.margin=0;
		if (spritesArePng && msieLe6) {
			img.src=imgRef[transparentGif].src;
			st.filter=misieFilter;
		}
		else {
			img.src=transpSrc;
		}
		d2.appendChild(img);
		d.appendChild(d2);
		id='geyes'+i;
		d2= elements[id] = document.createElement('div');
		st=d2.style;
		st.height=ghostHeight+'px';
		st.width=ghostWidth+'px';
		st.position='absolute';
		st.visibility='visible';
		st.left=st.top=0;
		st.padding=st.margin=0;
		st.zIndex=2;
		id='imgge'+i;
		img = elements[id] = document.createElement('img');
		st=img.style;
		st.height=ghostHeight+'px';
		st.width=ghostWidth+'px';
		st.padding=st.margin=0;
		if (spritesArePng && msieLe6) {
			img.src=imgRef[transparentGif].src;
			st.filter=misieFilter;
		}
		else {
			img.src=transpSrc;
		}
		d2.appendChild(img);
		d.appendChild(d2);
		elements.maze.appendChild(d);
		// create a bonus-sprite
		id='bonus'+i;
		d = elements[id] = document.createElement('div');
		st=d.style;
		st.visibility='hidden';
		st.height=bonusHeight+'px';
		st.width=bonusWidth+'px';
		st.position='absolute';
		st.zIndex=3;
		st.padding=st.margin=0;
		id='imgbonus'+i;
		img = elements[id] = document.createElement('img');
		st=img.style;
		st.height=bonusHeight+'px';
		st.width=bonusWidth+'px';
		st.padding=st.margin=0;
		if (spritesArePng && msieLe6) {
			img.src=imgRef[transparentGif].src;
			st.filter=misieFilter;
		}
		else {
			img.src=transpSrc;
		}
		d.appendChild(img);
		elements.maze.appendChild(d);
	}
	// create gameover sprite
	d=elements.gameover=document.createElement('div');
	obj=imgRef.gameover;
	st=d.style;
	st.width=obj.width+'px';
	st.height=obj.height+'px';
	st.position='absolute';
	st.zIndex=100;
	st.left=Math.floor((tileWidth*16-obj.width)/2)+'px';
	st.top=(Math.floor((tileWidth*10-obj.height)/2)+gameoverOffsetY)+'px';
	st.padding=st.margin=0;
	st.visibility='hidden';
	img=elements.imggameover=document.createElement('img');
	st=img.style;
	st.width=obj.width+'px';
	st.height=obj.height+'px';
	if (msieLe6 && obj.src.toLowerCase().indexOf('.png')>0) {
		st.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+obj.src+"', sizingMethod='scale')";
		img.src=imgRef[transparentGif].src;
	}
	else {
		img.src=obj.src;
	}
	d.appendChild(img);
	elements.maze.appendChild(d);
	// create gamepaused sprite
	d=elements.gamepaused=document.createElement('div');
	obj=imgRef.gamepaused;
	st=d.style;
	st.width=obj.width+'px';
	st.height=obj.height+'px';
	st.position='absolute';
	st.zIndex=100;
	st.left=Math.floor((tileWidth*16-obj.width)/2)+'px';
	st.top=(Math.floor((tileWidth*10-obj.height)/2)+gamepausedOffsetY)+'px';
	st.padding=st.margin=0;
	st.visibility='hidden';
	img=elements.imggamepaused=document.createElement('img');
	st=img.style;
	st.width=obj.width+'px';
	st.height=obj.height+'px';
	st.padding=st.margin=0;
	if (msieLe6 && obj.src.toLowerCase().indexOf('.png')>0) {
		st.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+obj.src+"', sizingMethod='scale')";
		img.src=imgRef[transparentGif].src;
	}
	else {
		img.src=obj.src;
	}
	d.appendChild(img);
	elements.maze.appendChild(d);
	if (restartDialogId) {
		// create a shield for dialogs
		img=elements.dialogscreen=document.createElement('img');
		st=img.style;
		st.width=16*tileWidth+'px';
		st.height=10*tileWidth+'px';
		st.position='absolute';
		st.visibility='hidden';
		st.left=st.top=0;
		st.zIndex=1000;
		img.src=imgRef[transparentGif].src;
		elements.maze.appendChild(img);
		// register the dialogElement
		elements.restartdialog=document.getElementById(restartDialogId);
		elements.restartdialog.style.zIndex=1001;
	}
	// set msie 6 method references
	if (msieLe6) {
		if (spritesArePng) setSpriteImg=setSpriteImgMsieLe6;
		if (mazeTilesArePng) setMaze=setMazeMsieLe6;
	}
}

// maze & game setup

function buildMaze(lvl) {
	var r, c, d, f1r, fwr, z, m;
	mazeColor=(lvl.color)? lvl.color:'';
	setMazeColor(mazeColor, true);
	setMazeBackdrop(lvl.backdrop);
	m=lvl.maze;
	food=0;
	pillPositions.length=0;
	for (r=1; r<=10; r++) {
		fwr=fw[r];
		f1r=f1[r];
		for (c=1; c<=16; c++) {
			f1r[c]=0;
			z=m[r-1].charAt(c-1);
			if (z=='.') {
				setMaze(r,c,"food");
				f1r[c]=9;
				food++;
				fwr[c]=true;
			}
			else {
				setMaze(r,c,z);
				if ((z=='p') || (z=='s')) {
					f1r[c]=8;
					food++;
					pillPositions.push({r: r, c: c, i: z, i0: (imgRef[z+z])? z+z:'x'});
				}
				fwr[c]=isSpaceTile[z];
			}
		}
	}
	pacInitDir=0;
	if (fw[7][7]) pacInitDir|=2;
	if (fw[7][9]) pacInitDir|=1;
	if (fw[8][8]) pacInitDir|=8;
	ghostInitDir=0;
	if (fw[4][11]) ghostInitDir|=4;
	if (fw[6][11]) ghostInitDir|=8;
	if (fw[5][12]) ghostInitDir|=1;
	
	// calc directions
	f2=new Array();
	for (r=1; r<=10; r++) {
		f2[r]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	}
	for (r=2; r<10; r++) {
		for (c=2; c<16; c++) {
			if (fw[r][c] && (r<4 || r>5 || c<8 || c>9))  {
				d=0;
				if (fw[r-1][c]) d|=4;
				if (fw[r+1][c]) d|=8;
				if (fw[r][c-1]) d|=2;
				if (fw[r][c+1]) d|=1;
				if ((d==3) || (d==12)) d=0;
				f2[r][c]=d;
			}
		}
	}
}

function calcNextNodes() {
	var dirs=t2[15];
	var fm,fr,fd,dx,dy,x,y;
	for (var m=0; m<dirs.length; m++) {
		var d=dirs[m];
		fd=nextNodes[d]=new Array();
		for (var r=1; r<=10; r++) {
			fr=fd[r]=new Array();
			for (var c=1; c<=16; c++) {
				if (f2[r][c] & d) {
					dx=tx[d];
					dy=ty[d];
					y=r;
					x=c;
					while (true) {
						if (y==10) {fr[c]= (x==7)? [5,15]:[5,2]; break;}
						if (x==1) {fr[c]=[9,10]; break;}
						if (x==16) {fr[c]=[9,7]; break;}
						x+=dx;
						y+=dy;
						if (f2[y][x]) {fr[c]=[y,x]; break;}
					}
				}
				else {
					fr[c]=null;
				}
			}
		}
	}
}


// general


function pHome() {
	pill=false; pillCnt=0;
	movedir=0;
	pPorted=false;
	with (pac) {
		r=7; c=8;
		osx=0; osy=0;
		md=0; dir= pacInitDir;
		dx=0; dy=0;
		p=0; pn=1; 
		reversed=false;
		pacLast=[r,c];
		pacNext=null;
		lc='';
		setPac(r,c,pacAnimations[md][p]);
	}
	setOpacity(elements.pac, 1);
}

function gHome(i) {
	with (g[i]) {
		for (var k=0; k<gHomePos.length; k++) {
			if (tileFree(i,gHomePos[k][0],gHomePos[k][1])) {
				r=gHomePos[k][0];
				c=gHomePos[k][1];
				osx=gHomeOffset[k][0];
				osy=gHomeOffset[k][1];
				break
			}
		};
		s=0;
		p=0;
		pn=1; 
		z=0;
		d=0;
		e=-1;
		lc='';
		alpha=1;
		setGhost(i,r,c);
	}
	setOpacity(elements['gbody'+i], 1);
	setOpacity(elements['geyes'+i], 1);
	setVisibility(elements['g'+i], true);
}

function newGame() {
	if (gameLocked) return;
	keyLock=false;
	if (gameTimer) clearTimeout(gameTimer);
	if (pillBlinkTimer) clearTimeout(pillBlinkTimer);
	isPause=false;
	if (elements.restartdialog) setRestartDialogVisible(false);
	setVisibility(elements.gameover, false);
	setVisibility(elements.gamepaused, false);
	nLife=3;
	if (lifeIndicatorIds.length) {
		for (var i=0, l=lifeIndicatorIds.length; i<l; i++) {
			if (i<nLife-1) {
				setImage(lifeIndicatorIds[i], lifeImageRemaining);
			}
			else if (i==nLife-1) {
				setImage(lifeIndicatorIds[i], lifeImageCurrent);
			}
			else {
				setImage(lifeIndicatorIds[i], lifeImageExpired);
			}
		}
	}
	nScore=0;
	nLevel=0;
	highScore=highScoreSaved;
	displayLevel();
	displayScore();
	displayHighScore();
	bonusLifeCnt=0;
	if (MazeSets[mazeMode]) levels=MazeSets[mazeMode];
	startLevel();
	gameTimer=setTimeout(function() { gameStep(); }, gameDelay);
}

function startLevel() {
	gameOn=false;
	setVisibility(elements.pac, false);
	for (i=1; i<=4; i++) {
		setVisibility(elements['g'+i], false);
		setVisibility(elements['bonus'+i], false);
		bonus[i]=0;
	}
	runThru=false;
	nLevel++;
	displayLevel();
	displayScore();
	gameStatus=0;
	statusCnt=0;
	pGstrat=Math.min(0.75, 0.25+nLevel/10);
	pGsLookahead=Math.min(0.6, 0.2+nLevel/10);
	pillPeriode=(nLevel<6)? pillMaxLength*aStep : Math.max(pillMinLength, (pillMaxLength-nLevel+5)*aStep);
	//buildMaze(levels[(nLevel-1)%levels.length]);
	if (mazeMode=='RandomLevels' || nLevel>levels.length) {
		buildMaze(getRandomMaze());
	}
	else {
		buildMaze(levels[nLevel-1]);
	}
	calcNextNodes();
	f2[5][1]=f2[5][16]=f2[10][7]=f2[10][10]=16;
	for (var r=1; r<=10; r++) {
		for (var c=1; c<=16; c++) fft[r][c]=0;
	}
	for (var i=1; i<=4; i++) gHome(i);
	pHome();
	pac.lfx=pac.lfy=0;
	setVisibility(elements.pac, true);
	phaseSet=true;
	gameOn=true;
	startPillBlinking(true);
}

function startPillBlinking(skip) {
	pillBlink= false;
	if (Settings.pillBlinkInterval) {
		blinkPills(skip);
	}
	else {
		pillBlinkTimer=null;
	}
}

function blinkPills(skip) {
	if (pillBlinkTimer) clearTimeout(pillBlinkTimer);
	if (pillPositions.length) {
		pillBlink=!pillBlink;
		if (!skip) {
			for (var i=0, l=pillPositions.length; i<l; i++) {
				var p=pillPositions[i];
				setMaze(p.r,p.c, (pillBlink)? p.i:p.i0);
			}
		}
		pillBlinkTimer=setTimeout(function() {blinkPills();}, Settings.pillBlinkInterval);
	}
	else {
		pillBlinkTimer=null;
	}
}

function clearPillPosition(r,c) {
	for (var i=0, l=pillPositions.length; i<l; i++) {
		var p=pillPositions[i];
		if (p.r==r && p.c==c) {
			pillPositions.splice(i,1);
			return;
		}
	}
}

function setSpan() {
	for (var n=1-aStep; n<aStep; n++) aSpan[n]= (n==0)? 0 : Math.round(n*tileWidth/aStep);
	gStep=Math.round(aStep*pillFactor);
	for (n=1-gStep; n<gStep; n++) gSpan[n]= (n==0)? 0 : Math.round(n*tileWidth/gStep);
	gStep2=Math.round(aStep*eyesFactor);
	for (n=1-gStep2; n<gStep2; n++) gSpan2[n]= (n==0)? 0 : Math.round(n*tileWidth/gStep2);
}

function limitOffsets(obj,limit) {
	if (obj.osx>=limit) obj.osx=limit-1;
	if (obj.osy>=limit) obj.osy=limit-1;
	if (obj.osx<=-limit) obj.osx=1-limit;
	if (obj.osy<=-limit) obj.osy=1-limit;
}

function getRand(x) {
	return Math.floor(Math.random() * x);
}

function tileFree(n, r,c) {
	if (n) {
		return (fft[r][c]&g[n].bm)? false:true;
	}
	else {
		return (fft[r][c])? false:true;
	}
}

function isCollision(x1,y1,x2,y2, radius) {
	return (Math.abs(x1-x2)+Math.abs(y1-y2)<radius);
}

function addScore(n) {
	nScore+=n;
	bonusLifeCnt+=n;
	if (bonusLifeCnt>=bonusLifeScore) {
		bonusLife();
		bonusLifeCnt-=bonusLifeScore;
	}
	displayScore();
	if (highScore<nScore) {
		highScore=nScore;
		displayHighScore();
	}
}

function displayLevel() {
	if (elements.leveldisplay) elements.leveldisplay.innerHTML=nLevel;
}

function displayScore() {
	if (elements.scoredisplay) elements.scoredisplay.innerHTML=nScore;
}

function displayHighScore() {
	if (elements.hiscoredisplay) elements.hiscoredisplay.innerHTML=nScore;
}


// main

function gameStep() {
	if (gameTimer) clearTimeout(gameTimer);
	var now=new Date();
	enterTime=now.getTime();
	if (gameOn) {
		phaseSet=(!phaseSet);
		switch(gameStatus) {
			case 0: doMove(); break;
			case 1: resetGhost(); break;
			case 2: resetPac(); return;
			case 3: endLevel(); break;
			case 4: startLevel(); break;
		}
	}
	if (gameOn || isPause) gameTimer=setTimeout(function() { reLoop(); }, 1);
}

function reLoop() {
	if (gameTimer) clearTimeout(gameTimer);
	var now=new Date();
	var delay = gameDelay + enterTime - now.getTime();
	gameTimer=setTimeout(function() { gameStep(); }, (delay>0)? delay:1);
}

function doMove() {
	for (var i=1; i<=4; i++) {
		if (bonus[i]>0) {
			bonus[i]--;
			if (bonus[i]==0) {
				setVisibility(elements['bonus'+i], false);
			}
			else {
				setOpacity(elements['bonus'+i], bonus[i]/bonusLength);
			}
		}
	}
	with (pac) {
		if (osx+osy==0) {
			if (f2[r][c]==16) {
				pTeleport();
				if (window.JSPacManUI) JSPacManUI.saveLastTouch();
			}
			else {
				pMove();
			}
		}
		if (runThru) {
			if (pPorted) {
				pPorted=false
			}
			else {
				osx+=dx;
				osy+=dy;
				osx%=aStep;
				osy%=aStep;
			}
			if (osx==0) c+=dx;
			if (osy==0) r+=dy;
			if (phaseSet) {
				if (pacAnimations.cyclic) {
					p++;
					if (p>pmax) p=0;
				}
				else {
					p+=pn;
					if (p==pmax) pn=-1;
					if (p==0) pn=1;
				}
			}
			setPac(r,c,pacAnimations[md][p]);
			if (osx+osy==0 && f2[r][c]) dir=f2[r][c];
		}
	}
	var r=pac.r+Math.round(pac.osy/aStep*.75);
	var c=pac.c+Math.round(pac.osx/aStep*.75);
	if (f1[r][c]>=8) {
		setMaze(r,c,'x');
		if (f1[r][c]==8) {
			if (!pill) {
				pill=true;
				for (var i=1; i<=4; i++) translateGPos(i,false);
			}
			pillCnt=pillPeriode;
			addScore(40);
			ghostCnt=0;
			if (soundActive) JSPacManUI.playSound('pillbeam');
			if (Settings.pillBlinkInterval) clearPillPosition(r,c);
		}
		else {
			addScore(15);
			if (soundActive) JSPacManUI.playSound('doteat');
		}
		f1[r][c]=0;
		food--;
		if (food==0) {
			statusCnt=blinkSteps*blinkRate;
			gameStatus=3;
			g[1].alpha=.75;
			for (i=1; i<=4; i++) {
				setOpacity(elements['gbody'+i], .75);
				setOpacity(elements['geyes'+i], .75);
			}
			if (soundActive) JSPacManUI.playSound('endlevel');
			if (pillBlinkTimer) clearTimeout(pillBlinkTimer);
			return;
		}
	}
	gmove();
	checkHits();
	if (gameStatus>0) return;
	if (pill) {
		pillCnt--;
		if (pillCnt==0) {
			pill=false;
			for (i=1; i<=4; i++) {
				var gi=g[i];
				if (gi.s!=4) translateGPos(i,true);
			}
		}
	}
}


// pacman

function setPac(r,c,s) {
	pac.posx=tileWidth*(c-1)+aSpan[pac.osx];
	pac.posy=tileWidth*(r-1)+aSpan[pac.osy];
	if (s!=pac.lc) {
		setSpriteImg(elements.pacimg, s);
		pac.lc=s;
	}
	moveElement(elements.pac,pac.posx+pacGridOffsetX, pac.posy+pacGridOffsetY);
}

function pMove() {
	with (pac) {
		if (dir&movedir) {
			md= dir&movedir;
			if (window.JSPacManUI) JSPacManUI.saveLastTouch();
		}
		else {
			md&=dir;
			if (md==0) runThru=false;
		}
		if (md) {
			runThru=true;
			dx=(md&3);
			dy=(md&12);
			if (dx) {
				dir=3;
				dx=tx[dx];
			}
			if (dy) {
				dir=12;
				dy=ty[dy];
			}
		}
		reversed=false;
		if (f2[r][c]) {
			setPacNextNode();
			pacLast=[r,c];
		}
	}
}

function setPacNextNode() {
	with (pac) {
		if (md) {
			var n=nextNodes[md][r][c];
			if (n) {
				var d=f2[n[0]][n[1]] & (15^t3[md]);
				while (d && t2[d].length<2) {
					var nn=nextNodes[d][n[0]][n[1]];
					if (nn) {
						n=nn;
						d=f2[n[0]][n[1]] & (15^t3[d]);
					}
					else {
						break;
					}
				}
				pacNext=n;
				return;
			}
		}
		pacNext=null;
	}
}

function pTeleport(i) {
	with (pac) {
		var d=md|movedir;
		if (r==5) {
			if (c<=1 && (d&2)) {pPort(10, 10, 4); return; }
			if (c>=16 && (d&1)) {pPort(10, 7, 4); return; }
		}
		if (r>=10) {
			if (c==10 && (d&8)) {pPort(5, 1, 1); return; }
			if (c==7 && (d&8)) {pPort(5, 16, 2); return; }
		}
	}
}

function pPort(tr,tc,td) {
	pac.r=tr; pac.c=tc;
	pac.md=pac.dir=movedir=td;
	pac.osx=pac.dx=tx[td]; pac.osy=pac.dy=ty[td];
	pPorted=true;
}


// ghosts

function setGhost(i,r,c) {
	var eyes;
	var gi=g[i];
	var s=gi.s;
	var gc;
	var ga=ghostAnimations[i];
	if (pill && (s==2 || s==1)) {
		gi.posx=tileWidth*(c-1)+gSpan[gi.osx];
		gi.posy=tileWidth*(r-1)+gSpan[gi.osy];
		if (pillCnt>4*aStep) {
			gc=ga.a;
		}
		else {
			gc=(pillCnt%6<3)? ga.n:ga.a;
		}
	}
	else if (s==0) {
		gi.posx=tileWidth*(c-1)+gi.osx;
		gi.posy=tileWidth*(r-1)+gi.osy;
		gc=ga.s;
	}
	else if (s==3) {
		gi.posx=tileWidth*(c-1)+gSpan2[gi.osx];
		gi.posy=tileWidth*(r-1)+gSpan2[gi.osy];
		gc=ga.e;
	}
	else {
		gi.posx=tileWidth*(c-1)+aSpan[gi.osx];
		gi.posy=tileWidth*(r-1)+aSpan[gi.osy];
		gc=ga.s;
	}
	if (s!=3) {
		gc=gc[gi.p];
	}
	if (s<3) fft[gi.r][gi.c]|=gi.bid;
	setSpriteImg(elements['imgg'+i], gc);
	if (gi.d!=gi.e) {
		setSpriteImg(elements['imgge'+i], ga.eyes[gi.d]);
		gi.e=gi.d;
	}
	moveElement(elements['g'+i], gi.posx+ghostGridOffsetX, gi.posy+ghostGridOffsetY);
}

function gmove() {
	for (i=1; i<=4; i++) {
		if (gameOn) {
			with (g[i]) {
				fft[r][c]&=bm;
				if (phaseSet) {
					if (ghostAnimations[i].cyclic) {
						p++;
						if (p>pmax) p=0;
					}
					else {
						p+=pn;
						if (p==pmax) pn=-1;
						if (p==0) pn=1;
					}
				}
				switch(s) {
					case 1: gMove1(i); break;
					case 2: gMove2(i); break;
					case 3: gMove3(i); break;
					case 4: gMove4(i); break;
					default: gMove0(i); break;
				}
			}
		}
		if (g[i].s!=4) {
			with (g[i]) {
				setGhost(i,r,c);
			}
		}
	}
}

function gMoveEyes(i) {
	if (Math.random()<.01) {
		g[i].d=(Math.random()<.5)? 0 : t2[15][getRand(t2[15].length)];
	}
}

function gMove0(i) {
	with (g[i]) {
		if (tileFree(i,5,10) && pac.dx+pac.dy!=0) {
			if ((z>40) || (getRand(30)<1)) {
				s++;
				r=5; c=10;
				osx=osy=0;
				d=2;
			}
			else {
				if (ghostsMoveEyesAtHome) gMoveEyes(i);
				z++;
			}
		}
		else {
			if (ghostsMoveEyesAtHome) gMoveEyes(i);
		}
	}
}

function gMove1(i) {
	with (g[i]) {
		if (tileFree(i,5,11)) {
			if (osx==0) {
				osx++;
			}
			else {
				osx++;
				if (osx==aStep) {
					c=11;
					osx=0;
					d=t2[ghostInitDir][getRand(t2[ghostInitDir].length)];
					s++;
				}
			}
		}
	}
}

function gMove2(i) {
	with (g[i]) {
		if (osx+osy==0) {
			var x= f2[r][c];
			if (x==16) {
				gTeleport(i);
			}
			else {
				if (x>0) {
					var gdm= x&(15^t3[d]);
					if (Math.random()<pGstrat) {
						gmoveStrat(i,gdm);
					}
					else {
						gmoveRand(i,gdm);
					}
				}
				if (d>0) {
					if (tileFree(i,r+ty[d],c+tx[d])) {
						gSet(i);
					}
					else {
						reverseStuck(i,x);
					}
				}
			}
		}
		else {
			gSet(i);
		}
	}
}

function gMove3(i) {
	with (g[i]) {
		if (osx+osy==0) {
			if (r==5 && c==11) {
				setVisibility(elements['g'+i], false);
				gHome(i);
				return;
			}
			var x= f2[r][c];
			if (x==16) {
				gTeleport(i);
			}
			else if (x>0) {
				var gdm= x&(15^t3[d]);
				var node='r'+r+'c'+c;
				if (lastn[node] && t2[gdm].length>1 && Math.random()>.3) gdm &= 15^lastn[node];
				var desx=11-g[i].c;
				var desy=5-g[i].r;
				d=0;
				if (desx!=0) d= (desx>0)? 1:2;
				if (desy!=0) d|= (desy>0)? 8:4;
				d&=gdm;
				if (d>0) {
					gmoveRand(i,d);
				}
				else {
					var adx=(desx>0)? gdm&(15^2):gdm&(15^1);
					var ady=(desy>0)? gdm&(15^4):gdm&(15^1);
					if (adx) {
						gmoveRand(i,adx);
					}
					else if (ady) {
						gmoveRand(i,ady);
					}
					else {
						gmoveRand(i,gdm);
					}
				}
				lastn[node]=d;
			}
		}
		gSet(i);
	}
}

function gMove4(i) {
	var gi=g[i];
	gi.z--;
	if (gi.z==0) {
		gi.s=3;
		var cf=gStep2/gStep;
		gi.osx=Math.round(gi.osx*cf);
		gi.osy=Math.round(gi.osy*cf);
		gi.lastn=new Array();
		setGhost(i,gi.r,gi.c);
		setOpacity(elements['gbody'+i],1);
		setOpacity(elements['geyes'+i],1);
	}
	else if (gi.z<ghostResetDelay/2) {
		gi.alpha-=ghostResetDelta*2;
		setOpacity(elements['gbody'+i], gi.alpha);
	}
	else {
		gi.alpha-=ghostResetDelta;
		setOpacity(elements['gbody'+i], gi.alpha);
	}
}

function gSet(i) {
	with (g[i]) {
		osy+=ty[d];
		osx+=tx[d];
		if (s==3) {
			osx%=gStep2;
			osy%=gStep2;
		}
		else if (pill && s==2) {
			osx%=gStep;
			osy%=gStep;
		}
		else {
			osx%=aStep;
			osy%=aStep;
		}
		if (osx==0) c+=tx[d];
		if (osy==0) r+=ty[d];
	}
}

function gmoveRand(i,k) {
	g[i].d=t2[k][getRand(t2[k].length)];
}

function gmoveStrat(i,gdm) {
	var desx, desy, px, py;
	var gi=g[i];
	if (pill) {
		desy=gi.r-pac.r;
		desx=gi.c-pac.c;
	}
	else if (pacNext && Math.random()<pGsLookahead) {
		py=pacNext[0];
		px=pacNext[1];
		desy=py-gi.r;
		desx=px-gi.c;
		if (desx==0 && desy==0) {
			desy=pac.r-gi.r;
			desx=pac.c-gi.c;
		}
	}
	else {
		desy=pac.r-gi.r;
		desx=pac.c-gi.c;
	}
	gi.d=0;
	if (desx!=0) gi.d= (desx>0)? 1:2;
	if (desy!=0) gi.d|= (desy>0)? 8:4;
	gi.d&=gdm;
	gmoveRand(i, (gi.d>0)? gi.d:gdm );
}

function reverseStuck(i,x) {
	with (g[i]) {
		if (x==0) {if (tileFree(i,r-ty[d],c-tx[d])) d=t3[d];
		}
		else {
			var vd= t2[x][getRand(t2[x].length)];
			if (tileFree(i,r+ty[vd],c+tx[vd])) {
				d=vd;
				gSet(i);
			}
		}
	}
}

function translateGPos(i,reset) {
	with (g[i]) {
		if (s==3) return;
		if ((reset) && (s==2)) {
			osx= Math.round(osx/pillFactor-tx[d]*.1);
			osy= Math.round(osy/pillFactor-ty[d]*.1);
			limitOffsets(g[i], aStep);
		}
		else if (s==2) {
			osx= Math.round(osx*pillFactor+tx[d]*.1);
			osy= Math.round(osy*pillFactor+ty[d]*.1);
			limitOffsets(g[i], gStep);
		}
	}
}

function gTeleport(i) {
	with (g[i]) {
		if (r==5) {
			if (c<=1 && (d&2)) {gPort(i, 10, 10, 4); return; }
			if (c>=16 && (d&1)) {gPort(i, 10, 7, 4); return; }
		}
		if (r>=10) {
			if (c==10 && (d&8)) {gPort(i, 5, 1, 1); return; }
			if (c==7 && (d&8)) {gPort(i, 5, 16, 2); return; }
		}
	}
}

function gPort(i,tr,tc,td) {
	g[i].r=tr; g[i].c=tc;
	g[i].d=td;
	gSet(i);
}

// hit-test

function checkHits() {
	var crash=0;
	var hitRadius=tileWidth*Settings.hitSensitivity;
	for (i=1; i<=4; i++) {
		if (g[i].s==2 && isCollision(g[i].posx,g[i].posy, pac.posx,pac.posy, hitRadius)) {
			crash=i;
			if (pill) {
				bonus[i]=bonusLength;
				var b=elements['bonus'+i];
				moveElement(b, g[i].posx, g[i].posy);
				setSpriteImg(elements['imgbonus'+i], bonusImageNames[ghostCnt]);
				setOpacity(b, 1);
				setVisibility(b, true);
				addScore(ghostBonus[ghostCnt]);
				if (ghostCnt<3) ghostCnt++;
				var gi=g[i];
				translateGPos(i,true);
				if (ghostAnimations[i].x) setSpriteImg(elements['imgg'+i], ghostAnimations[i].x);
				setOpacity(elements['gbody'+i], ghostResetAlpha);
				setOpacity(elements['geyes'+i], ghostResetAlpha);
				gi.alpha=ghostResetAlpha;
				gi.z=ghostResetDelay;
				gi.s=4;
				fft[gi.r][gi.c]&=gi.bm;
			}
			else {
				setOpacity(elements['gbody'+i], .5);
			}
		}
	}
	if (crash>0) {
		if (pill) {
			gameStatus=1;
			statusCnt=2;
			if (soundActive) JSPacManUI.playSound('ghostcatch');
		}
		else {
			setSpriteImg(elements.pacimg, pacAnimations.x[0]);
			pac.p=0;
			gameStatus=2;
			if (soundActive) JSPacManUI.playSound('pacend');
			if (highScoreCallback && nLife==1 && nScore>=highScoreMin) gameLocked=keyLock=true;
		}
	}
}

function resetGhost() {
	statusCnt--;
	if (statusCnt==0) gameStatus=0;
}

function resetPac() {
	if (gameTimer) clearTimeout(gameTimer);
	pac.p++;
	var al=pacAnimations.x.length;
	if (pac.p<al) {
		setSpriteImg(elements.pacimg, pacAnimations.x[pac.p]);
		setOpacity(elements.pac, 1-pac.p/(al*2.5));
		gameTimer=setTimeout(function() { resetPac(); }, pacAnimations.xDelay-pac.p*2);
	}
	else {
		if (lifeIndicatorIds.length && nLife<=lifeIndicatorIds.length) setImage(lifeIndicatorIds[nLife-1], lifeImageExpired);
		nLife--;
		if (nLife>0) {
			for (var i=1; i<=4; i++) {
				var gi=g[i];
				fft[gi.r][gi.c]&=gi.bm;
				gHome(i);
			}
			if (lifeIndicatorIds.length && nLife<=lifeIndicatorIds.length) setImage(lifeIndicatorIds[nLife-1], lifeImageCurrent);
			pHome();
			gameStatus=0;
			gameTimer=setTimeout(function() { gameStep(); }, 100);
		}
		else {
			gameOver();
		}
	}
}

function bonusLife() {
	if (lifeIndicatorIds.length && nLife<=lifeIndicatorIds.length) {
		setImage(lifeIndicatorIds[nLife-1], lifeImageRemaining);
		nLife++;
		if (nLife<=lifeIndicatorIds.length) setImage(lifeIndicatorIds[nLife-1], lifeImageCurrent);
	}
	else {
		nLife++;
	}
	if (soundActive) JSPacManUI.playSound('bonuslife');
}

function gameOver() {
	gameOn=false;
	gameStatus=-1;
	setOpacity(elements.gameover, .1);
	setVisibility(elements.gameover, true);
	setVisibility(elements.pac, false);
	setVisibility(elements.gamepaused, false);
	for (var i=1; i<=4; i++) {
		setOpacity(elements['gbody'+i], .6);
		setOpacity(elements['geyes'+i], .7);
	}
	statusCnt=.1;
	if (Settings.pillBlinkInterval) {
		startPillBlinking();
		if (pillBlinkTimer) clearTimeout(pillBlinkTimer);
		pillBlinkTimer=null;
	}
	gameTimer=setTimeout(function() { showGameOver(); }, 8);
}

function showGameOver() {
	if (statusCnt<1) {
		statusCnt+=.01;
		setOpacity(elements.gameover, statusCnt);
		gameTimer=setTimeout(function() { showGameOver(); }, 8);
	}
	else {
		statusCnt=1;
		setOpacity(elements.gameover, 1);
		gameTimer=setTimeout(function() { evaluateHighScore(); }, 10);
	}
}

function evaluateHighScore() {
	if (nScore && nScore>=highScoreMin && highScoreCallback) {
		highScoreMin=nScore;
		if (nScore>highScoreSaved) highScoreSaved=nScore;
		gameLocked=false;
		keyLock=true;
		highScoreCallback(nScore, nLevel);
	}
}

function endLevel() {
	var a=g[1].alpha-=.015;
	for (var i=1; i<=4; i++) {
		setOpacity(elements['gbody'+i], a);
	}
	if (Settings.levelEndBlinking) {
		if (statusCnt%blinkRate==0) {
			if ((statusCnt/blinkRate)%2==blinkSteps%2) {
				if (mazeBlinkColor) {
					setMazeColor(mazeBlinkColor, true);
				}
				else {
					setMazeColor((mazeColor!='white')? 'white':'grey');
				}
			}
			else {
				setMazeColor(mazeColor, true);
			}
		}
	}
	statusCnt--;
	if (statusCnt==0) {
		setMazeColor(mazeColor, true);
		gameStatus=4;
	}
}

function doPause() {
	if (gameStatus>=0) {
		if (gameOn) {
			setVisibility(elements.gamepaused, true);
			gameOn=false;
			isPause=true;
			if (pillBlinkTimer) clearTimeout(pillBlinkTimer);
		}
		else {
			setVisibility(elements.gamepaused, false);
			gameOn=true;
			isPause=false;
			startPillBlinking();
		}
	}
}

function showRestartDialog() {
	if (gameTimer) clearTimeout(gameTimer);
	if (pillBlinkTimer) clearTimeout(pillBlinkTimer);
	setRestartDialogVisible(true);
}

function hideRestartDialog(ok) {
	if (elements.restartdialog) setRestartDialogVisible(false);
	if (ok) {
		setTimeout(function() { newGame(); }, 10);
	}
	else {
		setTimeout(function() { reLoop(); }, 10);
		startPillBlinking();
	}
}

function setRestartDialogVisible(v) {
	setVisibility(elements.restartdialog, v);
	setVisibility(elements.dialogscreen, v);
	elements.dialogscreen.style.display= (v)? 'block':'none';
	if (v) {
		setOpacity(elements.dialogscreen, .25);
		if (autoCenterDialogs) centerElementOnBoard(elements.restartdialog);
	}
	restartDialogOn=v;
}

function centerElementOnBoard(obj) {
	var st=obj.style;
	st.left=Math.floor((tileWidth*20-obj.offsetWidth)/2)+'px';
	st.top=Math.floor((tileWidth*14-obj.offsetHeight)/2)+'px';
}

function useSound(v) {
	soundActive=(v)? true:false;
}

function setHighScore(hi, hiMin) {
	hi=Number(hi);
	if (!isNaN(hi)) {
		var refresh = (hi>highScore);
		highScore=highScoreSaved=Math.floor(hi);
		if (refresh) displayHighScore();
	}
	hiMin=Number(hiMin);
	if (!isNaN(hiMin)) {
		highScoreMin=highScoreSaved=Math.floor(hiMin);
	}
	else {
		highScoreMin=highScoreSaved;
	}
}

function setHighScoreCallback(callback) {
	highScoreCallback=callback;
}

function setPacDirection(v) {
	movedir=v&15;
}

function unloadTasks() {
	highScoreCallback=null;
}

if (document.addEventListener) {
	window.addEventListener('unload', unloadTasks, false);
}
else if (document.attachEvent) {
	window.attachEvent('onunload', unloadTasks);
}


// random maze

var rBackdrop='mazebgmini';

var rf= new Array();
for (var r=0; r<=15; r++) {
	rf[r]=new Array();
}

var rCageFrame= new Array(
	[3,7], [3,8], [3,9], [3,10],
	[4,7], [4,10], [5,7], [5,10],
	[6,7], [6,8], [6,9], [6,10]
);
var rStandardFree= new Array([7,7], [5,11], [6,11], [7,9], [7,10], [7,11], [5,2], [5,15], [9,7], [9,10]);
var rForceUpperGateFree= false;

var rOrdC=[2,15,3,14,4,13,5,12,6,11,7,10,8,9];
var rOrdR=[2,9,3,8,4,7,5,6];

var rSymLine= [2,8];

var tileRef=new Array(
	'x', 'l', 'm', 'h', 'o',
	'b', 'd', 'f', 'n', 'a',
	'c', 'i', 'v', 'e', 'g',
	'y', 'k', 'q', 't', 'r',
	'z', 'u'
);

function getRandomMaze() {
	var edgelines=false;
	var sym=(Math.random()>.5);
	var i, r, c, x, y;
	rMazeSetUp();
	var n=getRand(20)+12;
	// edge lines
	if (Math.random()>.5) {
		var k=getRand(8)+2;
		if (sym && k>5) k=5;
		for (i=2; i<k; i++) {
			var z=getRand(4);
			if (z==0) {
				rEdgeLine(2, (sym)? getRand(3)+11:getRand(8)+4, 8);
			}
			else if (z==1) {
				rEdgeLine(13, (sym)? getRand(3)+11:getRand(8)+4, 4);
			}
			else if ((sym) || (z==2)) {
				rEdgeLine(getRand(4)+4,15,2);
			}
			else if (z==3) {
				rEdgeLine(getRand(4)+4,2,1);
			}
		}
		edgelines=true;
		n-=k;
	}
	// inner lines
	if (sym) {
		for (i=0; i<n; i+=2) rLine(getRand(6)+3, getRand(7)+8, (Math.random()>.5)? 1:8);
		for (i=0; i<rSymLine.length; i++) {
			r=rSymLine[i];
			rf[r][8]=-1;
			if (rf[r+1][8]>=0) rf[r+1][8]&=14;
		}
		for (r=2; r<10; r++) {
			for (c=2; c<9; c++) {
				if (rf[r][17-c]>=0) rSet(r,c);
			}
		}
	}
	else {
		for (i=0; i<n; i++) rLine(getRand(6)+3, getRand(12)+3, (Math.random()>.5)? 1:8);
	}
	if (edgelines) {
		for (i=2; i<4; i++) {
			r=rOrdR[i];
			for (c=3; c<15; c++) rFillBag(r,c);
		}
		for (r=3; r<9; r++) {
			for (i=2; i<4; i++) rFillBag(r,rOrdC[i]);
		}
	}
	// fill grid
	rGrow(2);
	if (sym) {
		for (r=2; r<10; r++) {
			for (c=8; c<17; c++) {
				if ((r>3) && (r<7) && (c<11)) continue;
				var sc=17-c;
				if (rf[r][sc]>=0) rClear(r,sc);
				if (rf[r][c]>=0) rSet(r,sc);
			}
		}
	}
	rGrow(0);
	
	rf[4][1]&=7; rf[4][1]|=2;
	rf[6][1]&=11; rf[6][1]|=2;
	rf[4][16]&=7; rf[4][16]|=1;
	rf[6][16]&=11; rf[6][16]|=1;
	rf[10][6]&=14; rf[10][6]|=8;
	rf[10][8]&=13; rf[10][8]|=8;
	rf[10][9]&=14; rf[10][9]|=8;
	rf[10][11]&=13; rf[10][11]|=8;
	
	rClearWalls(sym);
	// pill placement
	if (sym) {
		rSetPill(2+getRand(2),2+getRand(3),true);
		rSetPill(9-getRand(2),2+getRand(3),true);
	}
	else {
		var pox1=getRand(3);
		var pox2=getRand(3);
		var poy1=(pox1>0)? 2: 2+getRand(2);
		var poy2=(pox2>0)? 9: 9-getRand(2);
		rSetPill(poy1, 2+pox1,false);
		rSetPill(poy1,15-pox1,false);
		rSetPill(poy2, 2+pox2,false);
		rSetPill(poy2,15-pox2,false);
	}
	var rclr;
	for (var i=0; i<100; i++) {
		rclr=getRandomColor();
		if (rclr!=mazeColor) break;
	}
	return { color: rclr, maze: rGetParsedGrid(), backdrop: rBackdrop };
}

function rMazeSetUp() {
	var r, c, i;
	for (r=0; r<=11; r++) {
		for (c=0; c<=17; c++) rf[r][c]=-1;
	}
	for (c=1; c<17; c++) { rSet(1,c); rSet(10,c) }
	for (r=2; r<10; r++) { rSet(r,1); rSet(r,16) }
	for (i=0; i<gHomePos.length; i++) {
		var p=gHomePos[i];
		rf[p[0]][p[1]]=-3;
	}
	for (i=0; i<rCageFrame.length; i++) {
		rSet(rCageFrame[i][0],rCageFrame[i][1]);
	}
	for (i=0; i<rStandardFree.length; i++) {
		rf[rStandardFree[i][0]][rStandardFree[i][1]]=-2;
	}
	rf[5][1]=-3;
	rf[5][16]=-3;
	rf[10][7]=-3;
	rf[10][10]=-3;
	rf[4][1]&=7;
	rf[6][1]&=11;
	rf[4][16]&=7;
	rf[6][16]&=11;
	rf[10][6]&=14;
	rf[10][8]&=13;
	rf[10][9]&=14;
	rf[10][11]&=13;
	if (rForceUpperGateFree || Math.random()<.3) rf[4][11]=-2;
	rf[7][8]=-3;
}

function rSet(r,c) {
	var d=0;
	if (rf[r+1][c]>=0) { rf[r+1][c]|=4; d|=8 }
	if (rf[r-1][c]>=0) { rf[r-1][c]|=8; d|=4 }
	if (rf[r][c+1]>=0) { rf[r][c+1]|=2; d|=1 }
	if (rf[r][c-1]>=0) { rf[r][c-1]|=1; d|=2 }
	rf[r][c]=d;
}

function rClear(r,c) {
	if (rf[r+1][c]>=0) rf[r+1][c]&=255^4;
	if (rf[r-1][c]>=0) rf[r-1][c]&=255^8;
	if (rf[r][c+1]>=0) rf[r][c+1]&=255^2;
	if (rf[r][c-1]>=0) rf[r][c-1]&=255^1;
	rf[r][c]=-1;
}

function rLine(r,c,d) {
	if (rf[r][c]!=-1) return;
	if (rf[r+1][c]>=0 || rf[r-1][c]>=0 || rf[r][c+1]>=0 || rf[r][c-1]>=0) return;
	if (rf[r+1][c+1]>=0 || rf[r+1][c-1]>=0 || rf[r-1][c+1]>=0 || rf[r-1][c-1]>=0) return;
	rSet(r,c);
	rLineDraw(r,c,d);
}

function rEdgeLine(r,c,d) {
	if (rf[r][c]!=-1) return;
	if (d&3) {
		if (rf[r-1][c]>=0 || rf[r-2][c]>=0 || rf[r+1][c]>=0 || rf[r+2][c]>=0 || rf[r+3][c]>=0 || rf[r-3][c]>=0) return;
		if (d==1 && (rf[r][c+1]>=0 || rf[r+1][c+1]>=0 || rf[r-1][c+1]>=0)) return;
		if (d==2 && (rf[r][-1]>=0 || rf[r+1][c-1]>=0 || rf[r-1][c-1]>=0)) return;
	}
	else {
		if (rf[r][c+1]>=0 || rf[r][c+2]>=0 || rf[r][c-1]>=0 || rf[r][c-2]>=0 || rf[r][c+3]>=0 || rf[r][c-3]>=0) return;
		if (d==8 && (rf[r+1][c]>=0 || rf[r+1][c-1]>=0 || rf[r+1][c+1]>=0)) return;
		if (d==4 && (rf[r-1][c]>=0 || rf[r-1][c-1]>=0 || rf[r-1][c+1]>=0)) return;
	}
	rSet(r,c);
	rLineDraw(r,c,d, true);
}

function rLineDraw(r,c,d, isEdge) {
	var l=(d&3)? getRand(8-r)+1 : getRand(14-r)+1;
	if (isEdge  && (d&12) && l>6) l==6;
	for (var k=0; k<l; k++) {
		r+=ty[d];
		c+=tx[d];
		if (rf[r][c]!=-1) return;
		if ((d&3) && (rf[r+1][c]>=0 || rf[r-1][c]>=0)) return;
		if ((d&12) && (rf[r][c+1]>=0 || rf[r][c-1]>=0)) return;
		var r2=r+ty[d];
		var c2=c+tx[d];
		if (rf[r2][c2]>=0) return;
		if ((d&3) && (rf[r2+1][c2]>=0 || rf[r2-1][c2]>=0)) return;
		if ((d&12) && (rf[r2][c2+1]>=0 || rf[r2][c2-1]>=0)) return;
		rSet(r,c);
	}
}

function rGrow(ofs) {
	for (var ri=ofs; ri<rOrdR.length; ri++) {
		var r=rOrdR[ri];
		for (var ci=ofs; ci<rOrdC.length; ci++) {
			var c=rOrdC[ci];
			var x=rf[r][c];
			if ((x>=0) && (x<15)) {
				if (c<9) {
					if ((x&1)==0) rGrowLine(r,c,1);
					if ((x&2)==0) rGrowLine(r,c,2);
				}
				else {
					if ((x&2)==0) rGrowLine(r,c,2);
					if ((x&1)==0) rGrowLine(r,c,1);
				}
				if (r<6) {
					if ((x&4)==0) rGrowLine(r,c,4);
					if ((x&8)==0) rGrowLine(r,c,8);
				}
				else {
					if ((x&4)==0) rGrowLine(r,c,4);
					if ((x&8)==0) rGrowLine(r,c,8);
				}
			}
		}
	}
}

function rGrowLine(r,c,d) {
	var dx=tx[d];
	var dy=ty[d];
	var dr=t3[d];
	r+=dy;
	c+=dx;
	while (rf[r][c]==-1 && rf[r+dy][c+dx]<0) {
		if (d&3) {
			if (rf[r+1][c]>=0 && (rf[r+1][c]&dr)==0) return;
			if (rf[r-1][c]>=0 && (rf[r-1][c]&dr)==0) return;
			var c1=c+dx;
			if (rf[r+1][c1]>=0 && (rf[r+1][c1]&dr)==0) return;
			if (rf[r-1][c1]>=0 && (rf[r-1][c1]&dr)==0) return;
		}
		else {
			if (rf[r][c+1]>=0 && (rf[r][c+1]&dr)==0) return;
			if (rf[r][c-1]>=0 && (rf[r][c-1]&dr)==0) return;
			var r1=r+dy;
			if (rf[r1][c+1]>=0 && (rf[r1][c+1]&dr)==0) return;
			if (rf[r1][c-1]>=0 && (rf[r1][c-1]&dr)==0) return;
		}
		rSet(r,c);
		r+=dy;
		c+=dx;
	}
}

function rFillBag(r,c) {
	if (rf[r][c]==-1 && rf[r-1][c-1]<0 && rf[r-1][c]<0 && rf[r-1][c+1]<0 && rf[r][c-1]<0 && rf[r][c+1]<0 && rf[r+1][c-1]<0 && rf[r+1][c]<0 && rf[r+1][c+1]<0) {
		rSet(r,c);
		if (Math.round()>.7) return;
		var r1=r;
		var c1=c+1;
		while (rf[r1][c1]==-1 && c1<16) {
			if (rf[r1][c1+1]>=0 || rf[r1-1][c1+1]>=0 || rf[r1+1][c1+1]>=0) break;
			rSet(r1,c1);
			c1++;
		}
		r1=r+1;
		c1=c;
		while (rf[r1][c1]==-1 && r1<8) {
			if (rf[r1+1][c1]>=0 || rf[r1+1][c1-1]>=0 || rf[r1+1][c1+1]>=0) break;
			rSet(r1,c1);
			r1++;
		}
	}
}

function rSetPill(r,c,sym) {
	if (rf[r][c]==-1) {
		rf[r][c]=-5;
		var sc=17-c;
		if (sym && rf[r][sc]==-1) {
			rf[r][sc]=-5;
		}
	}
	else {
		var dx=(c<9)? +1:-1;
		var dy=(r<5)? +1:-1;
		for (var i=0; i<50; i++) {
			var x=c+getRand(2)*dx;
			var y=r+getRand(2)*dy;
			if (rf[y][x]<0) {
				rf[y][x]=-5;
				var sx=17-x;
				if (sym && rf[y][sx]==-1) {
					rf[y][sx]=-5;
				}
				break;
			}
		}
	}
}

function rClearWalls(sym) {
	var r, c;
	for (c=3; c<14; c++) {
		var passages=0;
		var lpr=0;
		for (var r=2; r<=9; r++) {
			if (rf[r][c]<=0) {
				lpr=r;
				if (++passages==2) break;
			}
		}
		if (passages<2) {
			var posPassages=new Array();
			for (r=2; r<=9; r++) {
				if (Math.abs(lpr-r)>6 && rf[r][c]>0 && rf[r][c-1]<=0 && rf[r][c+1]<=0 && rf[r-1][c]>0 && rf[r+1][c]>0) posPassages[posPassages.length]=r;
			}
			if (posPassages.length==0) {
				for (r=2; r<=9; r++) {
					if (rf[r][c]>0 && rf[r][c-1]<=0 && rf[r][c+1]<=0 && rf[r-1][c]>0 && rf[r+1][c]>0) posPassages[posPassages.length]=r;
				}
			}
			if (posPassages.length) {
				var pr=posPassages[Math.floor(Math.random()*posPassages.length)];
				rClear(pr,c);
				if ((sym) && (c<9)) {
					var sc=17-c;
					if (rf[pr][sc-1]<=0 && rf[pr][sc+1]<=0 && rf[pr-1][sc]>0 && rf[pr+1][sc]>0) rClear(pr,sc);
				}
			}
		}
	}
}

function rGetParsedGrid() {
	var a=new Array();
	for (var r=1; r<=10; r++) {
		var s='';
		for (var c=1; c<=16; c++) {
			var v=rf[r][c];
			if (v<-4) {
				s+='p';
			}
			else if (v<-2) {
				s+='x';
			}
			else if (v<0) {
				s+='.';
			}
			else if (v==0) {
				s+='z';
			}
			else if (v>0) {
				if (c==10) {
					if (r==4) {
						s+=tileRef[ (rf[4][11]>0 && (rf[4][11]&2))? 21:17 ];
						continue;
					}
					if (r==5) {
						s+=tileRef[18];
						continue;
					}
					if (r==6) {
						s+=tileRef[19];
						continue;
					}
				}
				if ((v&4) && r>1) {
					if (rf[r-1][c]>0 && (rf[r-1][c]&8) && c>1 && rf[r][c-1]>0 && (rf[r][c-1]&4) && c<16 && rf[r][c+1]>0 && (rf[r][c+1]&4)) v&=11;
				}
				if ((v&8) && r<10) {
					if (rf[r+1][c]>0 && (rf[r+1][c]&4) && c>1 && rf[r][c-1]>0 && (rf[r][c-1]&8) && c<16 && rf[r][c+1]>0 && (rf[r][c+1]&8)) v&=7;
				}
				if ((v&1) && c<16) {
					if (rf[r][c+1]>0 && (rf[r][c+1]&2) && r>1 && rf[r-1][c]>0 && (rf[r-1][c]&1) && r<10 && rf[r+1][c]>0 && (rf[r+1][c]&1)) v&=14;
				}
				if ((v&2) && c>1) {
					if (rf[r][c-1]>0 && (rf[r][c-1]&1) && r>1 && rf[r-1][c]>0 && (rf[r-1][c]&2) && r<10 && rf[r+1][c]>0 && (rf[r+1][c]&2)) v&=13;
				}
				s+=tileRef[v];
			}
		}
		a.push(s);
	}
	return a;
}

// keyboard

var keyLock=false;

function enableKeyboard() {
	if (document.addEventListener) {
		document.addEventListener("keypress", keyHandler, true);
		document.addEventListener("keydown", keyFix, true);
	}
	else if (document.attachEvent) {
		if (document.captureEvents && window.Event && window.Event.KEYPRESS) document.captureEvents(Event.KEYPRESS);
		document.attachEvent('onkeypress',  keyHandler);
		document.attachEvent('onkeydown',  keyFix);
	}
}

function keyFix(e) {
	if (keyLock) return;
	// remap some keyCodes
	if (!e) e=window.event
	if (e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return true;
		var k=e.keyCode;
		if (k==8) keyHandler({which:8})
		else if (k==37) keyHandler({which:28})
		else if (k==39) keyHandler({which:29})
		else if (k==38) keyHandler({which:30})
		else if (k==40) keyHandler({which:31})
		else if (k==27) keyHandler({which:27})
		else if (k>=57373 && k<=57376) {
			if (k==57373) keyHandler({which:30})
			else if (k==57374) keyHandler({which:31})
			else if (k==57375) keyHandler({which:28})
			else if (k==57376) keyHandler({which:29});
		}
		else {
			e.cancleBubble=false;
			return true;
		}
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();
		e.cancleBubble=true;
		e.returnValue=false;
		return false;
	}
	return true;
}

function keyHandler(e) {
	if (keyLock) return;
	var k;
	var ctrl=false;
	if (e) {
		k=e.which || e.keyCode;
		ctrl=(e.ctrlKey || e.metaKey || e.altKey || e.metaKey || e.modifiers);
	}
	else if (window.event) {
		k=window.event.keyCode;
		ctrl= (window.event.ctrlKey || window.event.altKey || window.event.metaKey);
	}
	else return true;
	if (ctrl)  return true;
	if (k=='') {
		// map specials
		if (e==null) e=window.event;
		if (e.charCode==0 && e.keyCode) {
			if (e.keyCode==37) k=28
			else if (e.keyCode==39) k=29
			else if (e.keyCode==38) k=30
			else if (e.keyCode==40) k=31
			else if (e.keyCode==27) k=27;
		}
	}
	var ch= (k>=32 && k<127)? String.fromCharCode(k):'';
	ch=ch.toLowerCase();
	
	if (restartDialogOn) {
		if (ch=='n' || k==27) {
			hideRestartDialog(false);
		}
		else if (ch=='y' || k==13) {
			hideRestartDialog(true);
		}
	}
	else {
		if (ch=="8" || ch=="w" || ch=="i" || k==30) {
			movedir=4;
		}
		else if (ch=="4" || ch=="a" || ch=="j" || k==28) {
			movedir=2;
		}
		else if (ch=="6" || ch=="d" || ch=="l" || k==29) {
			movedir=1;
		}
		else if (ch=="5" || ch=="s" || ch=="k" || k==31 || ch=="2" || k==98) {
			movedir=8;
		}
		else if (ch=="p" || k==27) {
			doPause();
		}
		else if (ch=="n") {
			if (elements.restartdialog && (gameOn || isPause) && nScore>0) {
				showRestartDialog();
			}
			else {
				newGame();
			}
		}
	}
	
	if (window.event) e=window.event;
	if (e.preventDefault) e.preventDefault();
	if (e.stopPropagation) e.stopPropagation();
	e.cancleBubble=true;
	e.returnValue=false;
	return false;
}

function setKeyLock(v) {
	keyLock= (v)? true:false;
}

// trigger

setTimeout(function() { init(); }, 5);

// external start and stop

function gameStart() {
	if (gameTimer) clearTimeout(gameTimer);
	gameTimer=null;
	var el=document.getElementById(mazeElementId);
	if (el) {
		el.style.display='block';
		if (window.focus) window.focus();
		if (setupComplete) {
			newGame();
		}
		else {
			gameAutoStart=true;
		}
	}
}

function gameStop() {
	if (gameTimer) clearTimeout(gameTimer);
	if (pillBlinkTimer) clearTimeout(pillBlinkTimer);
	gameTimer=null;
	keyLock=true;
}

// define external API

this.setMazeMode=setMazeMode;
this.setQuality=setQuality;
this.setSpeed=setSpeed;
this.setImage=setImage;
this.newGame=newGame;
this.hideRestartDialog=hideRestartDialog;
this.useSound=useSound;
this.setHighScore=setHighScore;
this.setHighScoreCallback=setHighScoreCallback;
this.setPacDirection=setPacDirection;
this.pause=doPause;
this.setKeyLock=setKeyLock;
this.gameStart = gameStart;
this.gameStop = gameStop;
this.VERSION=VERSION;

this.startLevel=startLevel;

// end of closure
};
