var DEBUG = false;

var thinlib;
var player;
var track;
var infos;

var LEFT_BOUND = 18;
var RIGHT_BOUND = 382;
var MAX_SPEED = 150;
var MIN_SPEED = 0;
var MAX_COIN_INTERVAL = 15000;
var MIN_COIN_INTERVAL = 5000;
var PLAYER_OFFSET = 15;
var REFRESH_KEYBOARD = 20;

var screenWidth = 640;
var screenHeight = 480;

var duration = 120;

var timeCallback;
var trackCallback;
var mainCallback;
var coinCallback;
var mvObjects;
var trackPosition;
var pauseCollision;

var speed = MIN_SPEED;
var ACCELERATION = 30;

var CAR_HEIGHT = 64;
var CAR_WIDTH = 58;

var audioTrack;
var coinSound;
var collisionAudio;

var infoResolution;

var highScoreGame;

function init() {
	var oMain = document.getElementById('main');	
	
	thinlib = new ThinLib(oMain, screenWidth, screenHeight);	
	
	var parmAbstracto = new Object();

	parmAbstracto.id = 'abstracto';
	parmAbstracto.width = thinlib.getWidth();
	parmAbstracto.height = thinlib.getHeight();
	parmAbstracto.image = 'abstracto.gif';	
	parmAbstracto.color = WHITE	;
	parmAbstracto.backgroundPosition = '0px 0px';
	parmAbstracto.innerHTML = '';

	var abstracto = thinlib.addSprite(parmAbstracto);
	
	setTimeout(function() {
					var oMain = document.getElementById('main'); 
					oMain.removeChild(document.getElementById('abstracto'));	
					
					main();	
		       }, 3000);
}
  	
function main() {	
	var parmAudioTrack = new Object();
	parmAudioTrack.id = 'audioTrack';
	parmAudioTrack.src = 'trilha.ogg';
	parmAudioTrack.name = 'audioTrack';
	audioTrack = new Audio(parmAudioTrack);
	
	var parmCoinSound = new Object();
	parmCoinSound.id = 'coinSound';
	parmCoinSound.src = 'coin.ogg';
	parmCoinSound.name = 'coinSound';
	coinSound = new Audio(parmCoinSound);	

	var parmAudio = new Object();	
	parmAudio.id = 'collisionAudio';
	parmAudio.name = 'collisiionAudio';
	parmAudio.src = 'colisao.ogg';
	
	collisionAudio = new Audio(parmAudio);
	
	var parmMainScreen = new Object();
	parmMainScreen.id = 'mainScreen';
	parmMainScreen.width = thinlib.getWidth();
	parmMainScreen.height = thinlib.getHeight();
	parmMainScreen.image = 'tela_inicial.gif';	
	parmMainScreen.color = WHITE	;
	parmMainScreen.backgroundPosition = '0px 0px';
	parmMainScreen.innerHTML = '';

	var mainScreen = thinlib.addSprite(parmMainScreen);
	
	document.onkeypress = function(){
  		nextScreen();
	};	
}

function nextScreen() {
	var oMain = document.getElementById('main'); 
	oMain.removeChild(document.getElementById('mainScreen'));
		
	var parmCommandsScreen = new Object();
	parmCommandsScreen.id = 'commandsScreen';
	parmCommandsScreen.width = thinlib.getWidth();
	parmCommandsScreen.height = thinlib.getHeight();
	parmCommandsScreen.image = 'comandos.gif';	
	parmCommandsScreen.color = WHITE	;
	parmCommandsScreen.backgroundPosition = '0px 0px';
	parmCommandsScreen.innerHTML = '';
		
  var commandsScreen = thinlib.addSprite(parmCommandsScreen);		
		
	document.onkeypress = null;
		
	document.onkeypress = function(){
  	oMain.removeChild(document.getElementById('commandsScreen'));
			
		document.onkeypress = null;
						
		try {
			var menu1 = new MenuItem('Restart', 1);
			menu1.onSelect = again;
			
			window.menu.append(menu1);
			
			var menu2 = new MenuItem('High Score', 2);
			menu2.onSelect = highScore;
			
			window.menu.append(menu2);
			
			if(window.widget.preferenceForKey('highScore') != null)	{
				highScoreGame = parseInt(window.widget.preferenceForKey('highScore'), 10);
			}
			else {
				highScoreGame = 0;
			}			
		} 
		catch (e) {
			document.getElementById('btnRestart').style.display = 'block';
		}
	
		startGame();
	};	
}

function startGame() {
	var parmInfos = new Object();
	parmInfos.id = 'infos';
	parmInfos.width = thinlib.getWidth();
	parmInfos.height = thinlib.getHeight();
	parmInfos.color = WHITE;

	infos = thinlib.addSprite(parmInfos);	

	trackPosition = -(screenHeight);
	
	var parmTrack = new Object();
	parmTrack.id = 'track';
	parmTrack.width = 400;
	parmTrack.height = 480;
	parmTrack.image = 'pista.gif';
	parmTrack.color = WHITE;
	parmTrack.backgroundPosition = '0px ' + trackPosition + 'px';

	track = thinlib.addSprite(parmTrack);
	
	var initialTop = 50;
	var initialLeft = 450;
	var nextLine = 30;
	
	var seconds = document.createElement('div');
	seconds.style.left = initialLeft + 'px';
	seconds.style.top = initialTop + 'px';
	seconds.style.height = '50px';
	seconds.style.width = '50px';
	seconds.style.position = 'absolute';
	
	var lblSeconds = document.createElement('div');
	lblSeconds.style.left = '10px';
	lblSeconds.style.top = '10px';
	lblSeconds.style.position = 'relative';
	lblSeconds.style.color = BLACK;
	lblSeconds.style.fontFamily = 'Courier'	
	lblSeconds.innerHTML = 'Seconds';
	
	seconds.appendChild(lblSeconds);
	
	var txtSeconds = document.createElement('div');
	txtSeconds.id = 'seconds';
	txtSeconds.style.left = '10px';
	txtSeconds.style.top = '30px';
	txtSeconds.style.position = 'relative';
	txtSeconds.style.color = BLACK;	
	txtSeconds.style.fontFamily = 'Courier New'
	txtSeconds.style.fontSize = '32px';
	txtSeconds.innerHTML = duration;
	
	seconds.appendChild(txtSeconds);	
	
	thinlib.addElement(seconds, infos);
	
	var score = document.createElement('div');
	score.style.left = (initialLeft) + 'px';
	score.style.top = (initialTop + 90) + 'px';
	score.style.height = '50px';
	score.style.width = '50px';
	score.style.position = 'absolute';	
	
	var lblScore = document.createElement('div');
	lblScore.style.left = '10px';
	lblScore.style.top = '10px';
	lblScore.style.position = 'relative';
	lblScore.style.color = BLACK;
	lblScore.style.fontFamily = 'Courier'	
	lblScore.innerHTML = 'Score';
	
	score.appendChild(lblScore);
	
	var txtScore = document.createElement('div');
	txtScore.id = 'score';
	txtScore.style.left = '10px';
	txtScore.style.top = '30px';
	txtScore.style.position = 'relative';
	txtScore.style.color = BLACK;	
	txtScore.style.fontFamily = 'Courier New'
	txtScore.style.fontSize = '32px';	
	txtScore.innerHTML = 0;
	
	score.appendChild(txtScore);
	
	thinlib.addElement(score, infos);	
	
	var speed = document.createElement('div');
	speed.style.left = (initialLeft) + 'px';
	speed.style.top = (initialTop + 180) + 'px';
	speed.style.height = '50px';
	speed.style.width = '50px';
	speed.style.position = 'absolute';		
	
	var lblSpeed = document.createElement('div');
	lblSpeed.style.left = '10px';
	lblSpeed.style.top = '10px';
	lblSpeed.style.position = 'relative';
	lblSpeed.style.color = BLACK;
	lblSpeed.style.fontFamily = 'Courier'	
	lblSpeed.innerHTML = 'Speed';
	
	speed.appendChild(lblSpeed);
	
	var txtSpeed = document.createElement('div');
	txtSpeed.id = 'speed';
	txtSpeed.style.left = '10px';
	txtSpeed.style.top = '30px';
	txtSpeed.style.position = 'relative';
	txtSpeed.style.color = BLACK;	
	txtSpeed.style.fontFamily = 'Courier New'
	txtSpeed.style.fontSize = '32px';
	txtSpeed.innerHTML = 'Very Slow';
	
	speed.appendChild(txtSpeed);
	
	thinlib.addElement(speed, infos);		
	
	var parmPlayer = new Object();
	parmPlayer.image = 'carro.gif';
 	parmPlayer.name = 'player';
	parmPlayer.width = CAR_WIDTH;
	parmPlayer.height = CAR_HEIGHT;
	parmPlayer.frames = 1;
	parmPlayer.left = 50;
	parmPlayer.top = track.offsetHeight - CAR_HEIGHT;
	
	player = thinlib.newAnimation(parmPlayer);	
 	
	thinlib.addElement(player, track);
	
	thinlib.captureKeys();	

	audioTrack.playLoop();

	newCoin();
	newOpponent();
	
	startCallbacks();	
	createCoinCallback();	
}

function newCoin() {
  var left = parseInt(Math.random() * 121 + 18, 10);
  var parameters = new Object();
  
  parameters.image = 'moeda5.gif';
  parameters.name = 'coin';
	parameters.id = 'coin';
  parameters.frames = 1;
  parameters.width = 24;
  parameters.height = 24;
  parameters.left = left;
  parameters.top = -24;
  
  var animation = thinlib.newAnimation(parameters);
  var node = animation.getDOM();
	
	node.collision = false;
	node.move = false;

  thinlib.addElement(node, track);
}

function resetOpponents() { 
	var opponents = document.getElementsByName('opponent');
	var boolOpponents	= false;
	
	if (opponents.length == 0) {
		boolOpponents = true;
  	opponents = new Array();
  }

	if (boolOpponents) {
		var elements = document.getElementsByTagName('div');
		for (var i = 0; i < elements.length; i++) {
			if (boolOpponents && elements[i].name == 'opponent') {
				opponents[opponents.length] = elements[i];
			}
		}
	}
	
	for (var i = 0; i < opponents.length; i++) {
    var left = parseInt(Math.random() * 121 + 18, 10);
		opponents[i].style.left = left + 'px';
		opponents[i].style.top = '-64px';
		opponents[i].orientation = Math.random() * 100 > 50 ? 'left' : 'right'	;
		opponents[i].straight = Math.random() * 100 > 70 ? true : false	;
		opponents[i].collision = false;
		opponents[i].side = Math.random() * 50 + 150;
  }
}

function resetCoin() {
	var coin = document.getElementById('coin');
  var left = parseInt(Math.random() * 121 + 18, 10);	

	coin.style.left = left + 'px';
	coin.style.top = '-24px';
	coin.collision = false;
	coin.move = false;
}

function createCoinCallback() {
	var nextCall = Math.random() * MAX_COIN_INTERVAL;
	
	nextCall = nextCall < MIN_COIN_INTERVAL ? MIN_COIN_INTERVAL : nextCall;
	resetCoin();
	
	coinCallback = setTimeout( function() { 
		var coin = document.getElementById('coin');
		coin.move = true; 
	}, nextCall );	
}

function again() {
  stopCallbacks();
  clearTimeout(coinCallback);
	
	removeAllObjects();
	
	speed = MIN_SPEED;

	audioTrack.stop();
	audioTrack.playLoop();
	
	document.getElementById('seconds').innerHTML = duration;
	document.getElementById('score').innerHTML = '0';
	document.getElementById('speed').innerHTML = 'Very Slow';  
		
  var parmPlayer = new Object();
  parmPlayer.image = 'carro.gif';
 	parmPlayer.name = 'player';
  parmPlayer.width = CAR_WIDTH;
  parmPlayer.height = CAR_HEIGHT;
  parmPlayer.frames = 1;
	parmPlayer.left = 50;
	parmPlayer.top = track.offsetHeight - CAR_HEIGHT;		

	player.setAnimation(parmPlayer);
	
  newOpponent();
	newCoin();
	
	createCoinCallback();		
	startCallbacks();		
}

function callback(ev)
{
  var keyPress = thinlib.getKeyPress();
	var oldSpeed = speed;
	var left1 = 37;       // q or 1
	var left2 = 37;      // Q or 1	
	var right1 = 39;      // w or 3
	var right2 = 39;     // W or 3
	var speedUp1 = 81;    // o or 2
	var speedUp2 = 113;   // O or 2
	var speedDown1 = 87;  // p or 5
	var speedDown2 = 119; // P or 5

  if (keyPress != null) {
    if (keyPress == left1 || keyPress == left2) { 
      var nextpos = player.getDOM().offsetLeft - PLAYER_OFFSET;
      if (nextpos > LEFT_BOUND) {
	  		player.getDOM().style.left = nextpos + 'px';
	  	}
	  	else {
	  		player.getDOM().style.left = LEFT_BOUND + 'px';
			}
    }
		else if (keyPress == right1 || keyPress == right2) { 
      var nextpos = player.getDOM().offsetLeft + PLAYER_OFFSET;
      if (nextpos < RIGHT_BOUND - player.getDOM().offsetWidth) {
        player.getDOM().style.left = nextpos + 'px';
      }
			else {
				player.getDOM().style.left = RIGHT_BOUND - player.getDOM().offsetWidth + 'px';
			}
    }
		else if (keyPress == speedUp1 || keyPress == speedUp2) { 
      speed += ACCELERATION;

			if(speed > MAX_SPEED) {
	  	  speed = MAX_SPEED;
			}
    }
    else if (keyPress == speedDown1 || keyPress == speedDown2) {
      if (speed == MAX_SPEED) {
				if ((speed - MIN_SPEED) % ACCELERATION != 0) {
	  			speed -= (speed - MIN_SPEED) % ACCELERATION;
				}
				else {
					speed -= ACCELERATION;
				}
	  	}
	  	else {
	  		speed -= ACCELERATION;
	  	}		
			
	  	if(speed < MIN_SPEED) {
	  	  speed = MIN_SPEED;
			}
	 	}

  	if (oldSpeed != speed) {
			switch(speed)
			{
				case MIN_SPEED:
					document.getElementById('speed').innerHTML = 'Very Slow';
					break;
				case ACCELERATION * 2:
					document.getElementById('speed').innerHTML = 'Slow';
					break;
				case ACCELERATION * 3:
					document.getElementById('speed').innerHTML = 'Medium';
					break;
				case ACCELERATION * 4:
					document.getElementById('speed').innerHTML = 'High';
					break;
				case MAX_SPEED:
					document.getElementById('speed').innerHTML = 'Very High';
					break;
			}
			
   		thinlib.clearCallback(mvObjects);
	 		mvObjects = thinlib.setCallback(function(){	
	 			moveObjects();
	 		}, 180 - speed);
			
   		thinlib.clearCallback(trackCallback);
	 		trackCallback = thinlib.setCallback(function(){	
	 			rollTrack();
	 		}, 180 - speed);
			
	 	}		
  }
}

function rollTrack(){
	trackPosition = trackPosition + 15;
	
	if(trackPosition >= 0) {''
		trackPosition = -(screenHeight);
	}
	
	track.style.backgroundPosition = '0px ' + trackPosition + 'px';
}

function newOpponent(){
  var left = parseInt(Math.random() * 121 + 18, 10);
  var parameters = new Object();
  
  parameters.image = 'carro.gif';
  parameters.name = 'opponent';
  parameters.frames = 1;
  parameters.width = CAR_WIDTH;
  parameters.height = CAR_HEIGHT;
  parameters.left = left;
  parameters.top = -CAR_HEIGHT;
  
  var animation = thinlib.newAnimation(parameters);
  var node = animation.getDOM();
	node.orientation = Math.random() * 100 > 50 ? 'left' : 'right'	;
	node.straight = Math.random() * 100 > 70 ? true : false	;
	node.collision = false;
	node.side = Math.random() * 50 + 150;

  thinlib.addElement(node, track);	
}

function moveObjects(){
	var opponents = document.getElementsByName('opponent');
	var coin = document.getElementById('coin');
	var boolOpponents	= false;
	var newLeft;
	var newTop;
	
	if (opponents.length == 0) {
		boolOpponents = true;
  	opponents = new Array();
  }

	if (boolOpponents) {
		var elements = document.getElementsByTagName('div');
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].name == 'opponent') {
				opponents[opponents.length] = elements[i];
			}
		}
	}
	
	for (var i = 0; i < opponents.length; i++) {
		var deltaX;
		var deltaY;
		
		if (opponents[i].straight) {
			deltaX = 0;
			deltaY = 15;
		}
		else {
			var tan = opponents[i].side / 164;
			var radian = Math.abs(Math.atan(tan))
			deltaY = parseInt(Math.abs(Math.sin(radian) * 20), 10);
			deltaX = parseInt(Math.abs(Math.cos(radian) * 20), 10);
		}
		
		if (opponents[i].orientation == 'left') {
			deltaX = opponents[i].offsetLeft - deltaX > LEFT_BOUND ? deltaX : opponents[i].offsetLeft - LEFT_BOUND;
			
			newLeft = opponents[i].offsetLeft - deltaX;
			
			if (opponents[i].offsetLeft <= LEFT_BOUND) {
				opponents[i].orientation = 'right';
			}
		}
		else {
			deltaX = opponents[i].offsetLeft + deltaX < RIGHT_BOUND - CAR_WIDTH ? deltaX : RIGHT_BOUND - CAR_WIDTH - opponents[i].offsetLeft;
			
			newLeft = opponents[i].offsetLeft + deltaX;
			
			if (opponents[i].offsetLeft >= RIGHT_BOUND - CAR_WIDTH) {
				opponents[i].orientation = 'left';
			}
		}
		
		newTop = opponents[i].offsetTop + deltaY;
		
		var list1 = new Array();
		var list2 = new Array();
		
		var opponent = new Object();
		opponent.offsetLeft = newLeft;
		opponent.offsetTop = newTop;
		opponent.offsetHeight = CAR_HEIGHT;
		opponent.offsetWidth = CAR_WIDTH;
		
		list1[0] = player.getDOM();
		list2[0] = opponent;
		
		if (thinlib.collision(list1, list2)) {
			opponents[i].collision = true;
		}
		
		if (opponents[i].collision == true) {
			audioTrack.pause();

 			opponents[i].style.left = newLeft + 'px';
			opponents[i].style.top = newTop + 'px';			
			
			collisionAudio.play();
			
			var parmPlayer = new Object();
			parmPlayer.image = 'carro_quebrado.gif';
			parmPlayer.name = 'player';
			parmPlayer.width = CAR_WIDTH;
			parmPlayer.height = CAR_HEIGHT;
			parmPlayer.frames = 1;
			parmPlayer.top = player.getDOM().offsetTop;
			parmPlayer.left = player.getDOM().offsetLeft;
			
			player.setAnimation(parmPlayer);
			
			thinlib.clearCallback(trackCallback);
			thinlib.clearCallback(mvObjects);
			thinlib.clearCallback(mainCallback);
			clearTimeout(coinCallback);
			
			pauseCollision = setTimeout(function(){
				speed = MIN_SPEED;
				document.getElementById('speed').innerHTML = 'Very Slow';
				
				resetOpponents();
				
				audioTrack.playLoop();				
				
				trackCallback = thinlib.setCallback(function(){
					rollTrack();
				}, 300);
				mvObjects = thinlib.setCallback(function(){
					moveObjects();
				}, 250);
				mainCallback = thinlib.setCallback(function () { 
					callback(); 
				}, REFRESH_KEYBOARD);			
				createCoinCallback();	
				
				var parmPlayer = new Object();
				parmPlayer.image = 'carro.gif';
				parmPlayer.name = 'player';
				parmPlayer.width = CAR_WIDTH;
				parmPlayer.height = CAR_HEIGHT;
				parmPlayer.frames = 1;
				parmPlayer.top = player.getDOM().offsetTop;
				parmPlayer.left = player.getDOM().offsetLeft;
				
				player.setAnimation(parmPlayer);
			}, 3000);
			
			return;
		}
		else {
			if (newTop > track.offsetHeight) {
				var score = parseInt(document.getElementById('score').innerHTML, 10);

				document.getElementById('score').innerHTML = ++score;
				updateHighScore(score);
		
				resetOpponents();
				
				return;
			}
			else {
				opponents[i].style.left = newLeft + 'px';
				opponents[i].style.top = newTop + 'px';
			}
		}
	}
	

	if(coin.move == false) {
			return;
	}
		
	coin.style.top = (coin.offsetTop + 10) + 'px';
		
	var list1 = new Array();
	var list2 = new Array();
		
	list1[0] = player.getDOM();
	list2[0] = coin;
		
	if (thinlib.collision(list1, list2)) {
		coin.collision = true;
	}
		
	if (coin.collision == true) {
		coinSound.play();
		
		var score = parseInt(document.getElementById('score').innerHTML, 10);
				
		document.getElementById('score').innerHTML = score + 5;
		updateHighScore(score + 5);			

		clearTimeout(coinCallback);
				
 	  createCoinCallback();			
	}
	else {
		if (coin.offsetTop > track.offsetHeight) {
			clearTimeout(coinCallback);	
		  createCoinCallback();
		}
	}	
}

function timeCounter() {
	var time = parseInt(document.getElementById('seconds').innerHTML, 10);
	
	time--;

	document.getElementById('seconds').innerHTML = time;
	
	if(time == 0) {
		stopCallbacks();
		resetOpponents();
		resetCoin();
		audioTrack.stop();
		clearTimeout(coinCallback);
	} 
}

function removeAllObjects(){
	var opponents = document.getElementsByName('opponent');
	
	if (opponents.length == 0) {
		opponents = new Array();
		var elements = document.getElementsByTagName('div');
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].name == 'opponent') {
				opponents[opponents.length] = elements[i];
			}
		}
	}
	
	for (var i = 0; i < opponents.length; i++) {
		opponents[i].parentNode.removeChild(opponents[i]);
    opponents[i] = null;
  }		
	
	var coin = document.getElementById('coin');
	
	coin.parentNode.removeChild(coin);
  coin = null;
}

function startCallbacks() {
  mainCallback = thinlib.setCallback(function () { callback(); }, REFRESH_KEYBOARD);	
	trackCallback = thinlib.setCallback(function () { rollTrack(); }, 300);
	timeCallback = thinlib.setCallback(function () { timeCounter(); }, 1000);
  mvObjects = thinlib.setCallback(function () { moveObjects(); }, 250 );	
}

function stopCallbacks() {
  thinlib.clearCallback(mainCallback);	
	thinlib.clearCallback(trackCallback);
	thinlib.clearCallback(timeCallback);
  thinlib.clearCallback(mvObjects);	
  clearTimeout(pauseCollision);
}

function highScore() {
	alert('High Score: ' + highScoreGame);
}

function updateHighScore(score) {
	if(score > highScoreGame) {
		highScoreGame = score;
		window.widget.setPreferenceForKey(highScoreGame, 'highScore');
	}
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btnRestart').addEventListener('click', again);  
  init();
});
