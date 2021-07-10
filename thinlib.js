var WHITE = '#FFFFFF';
var BLACK = '#000000';
var RED = '#FF0000';
var GREEN = '#00FF00';
var BLUE = '#0000FF';

function ThinLib(oPlayground, iWidth, iHeight) {
  var playground = oPlayground;
  var width = iWidth != null ? iWidth : window.screen.width;
  var height = iHeight != null ? iHeight : window.screen.height;
  
  var sprites = 0;

  var keyPress = null;
  
  this.getPlayground = function() {
    return playground;
  }
  
  this.getWidth = function() {
    return width;
  }
  
  this.getHeight = function() {
    return height;
  }

  this.setCallback = function(func, iRefresh) {
    return setInterval(func, iRefresh);
  }

  this.clearCallback = function(callback) {
    clearInterval(callback);
  }

  this.addSprite = function(parameters) {
    try {
    var oSprite;
    
    oSprite = createElement('DIV', '');
    
    oSprite.innerHTML = '&nbsp;';
    oSprite.id = parameters.id;
    oSprite.style.width = parameters.width + 'px';
    oSprite.style.height = parameters.height + 'px';
    oSprite.style.position = 'absolute';
    
    if (parameters.image != null) {
      oSprite.style.backgroundImage = 'url(' + parameters.image + ')';
      oSprite.style.backgroundRepeat = 'no-repeat';
    }
    
    oSprite.style.backgroundColor = parameters.color != null ? parameters.color : WHITE;
		oSprite.style.backgroundPosition = parameters.backgroundPosition != null ? parameters.backgroundPosition : '0px 0px';
    oSprite.style.zIndex = sprites++;
    oSprite.style.left = parameters.left != null ? parameters.left + 'px' : 0;
    oSprite.style.top = parameters.top != null ? parameters.top + 'px' : 0;
    oSprite.style.overflow = 'hidden';
    
    playground.appendChild(oSprite);
    
    return oSprite;
  } 
  catch (ex) {
    alert(ex.message);
  }
  }
  
  this.removeSprite = function(oSprite)
  {
    try {
      playground.removeChild(oSprite);  
    }
    catch (e) { }
  }
 
  this.addElement = function(oElement, oSprite) {
    var oNode;
  
  	if (oElement instanceof Animation) {
    	oNode = oElement.getDOM();
  	}
  	else {
    	oNode = oElement;
  	}
  
    oSprite.appendChild(oNode);
  } 
  
  this.removeElement = function(oElement, oSprite) {
    try {
    oSprite.removeChild(oElement);
  }
  catch (ex) { }
  }
  
  this.newAnimation = function(parameters) {
    var oAnimation = new Animation(parameters);
  
  oAnimation.updateDOM();
    
    return oAnimation;
  }
  
  this.disposeAnimation = function(oAnimation) {
    oAnimation.dispose();
  }  
  
  this.captureKeys = function() {
    document.onkeydown = function(e){
      _keyDown(window.event || e)
    };
    document.onkeyup = function(e){
        _keyUp(window.event || e)
    };
  }  
  
  this.getKeyPress = function () {
      return keyPress;
  }
  
  this.collision = function(list1, list2, callback)  {
    var collision = true;
		var retCollision = false;

    for(var i = 0; i < list1.length; i++){
      for(var j = 0; j < list2.length; j++) {
        var objA = new Object();
        objA.pontoX1 = list1[i].offsetLeft;
        objA.pontoX2 = list1[i].offsetLeft + list1[i].offsetWidth;
        objA.pontoY1 = list1[i].offsetTop;
        objA.pontoY2 = list1[i].offsetTop + list1[i].offsetHeight;

        var objB = new Object();
        objB.pontoX1 = list2[j].offsetLeft;
        objB.pontoX2 = list2[j].offsetLeft + list2[j].offsetWidth;
        objB.pontoY1 = list2[j].offsetTop;
        objB.pontoY2 = list2[j].offsetTop + list2[j].offsetHeight;

        if (objA.pontoX2 < objB.pontoX1) {
          collision = false;
        }

        if (objA.pontoX1 > objB.pontoX2) {
          collision = false;
        }

        if (objA.pontoY2 < objB.pontoY1) {
          collision = false;					
        }

        if (objA.pontoY1 > objB.pontoY2) {
          collision = false;					
        }

				if (collision) {
					retCollision = true;
				}

        if(collision && callback != null) {
          callback(list1[i], list2[j]);
        }
      }
    }
		
		return retCollision;
  }
  
  function _keyDown(ev) {
		keyPress = ev.keyCode != null ? ev.keyCode : ev.which != null ? ev.which : ev.charCode;
  }

  function _keyUp() {  
	  keyPress = null;
  }
}	

function createElement(type, name){
	try {
		return document.createElement('<' + type + ' NAME="' + name + '">');
	}
	catch(e){
		return document.createElement(type);
	}
}

function $(sId) {
  return document.getElementById(sId);
}

function Audio(parameters) {
	var audio = createElement('AUDIO', parameters.name);
	audio.name = parameters.name;
	audio.id = parameters.id != null ? parameters.id : parameters.name + parseInt(Math.random() * 1000, 10);
	audio.src = parameters.src
	audio.adjust = parameters.adjust != null ? parameters.adjust : 0;

	var audioClone = createElement('AUDIO', parameters.name);
	audioClone.name = audio.name;
	audioClone.id = audio.id + 'clone';
	audioClone.src = audio.src
	audioClone.adjust = audio.adjust;
	
	var loop;
	var choice = true;
	
	this.play = function() {
		try {
		    audio.loop = false;
			audio.play();
		} catch (e) {};
	}
	
	this.playLoop = playLoop;
	function playLoop() {
		try {
			audio.loop = true;
			audio.play();			
		} catch(e) {};
	}	
	
	this.pause = function() {
		try {
			audio.pause();
		} catch(e) {};
	}	
	
	this.stop = function() {
		try {
			audio.currentTime = 0;
			audio.pause();		
		} catch(e) {};
  }	
	
	this.getDOM = function() {
		return audio;
	}
}

function Animation(parameters) {
  var image = parameters.image;
  var name = parameters.name;
	var id = parameters.id != null ? parameters.id : parameters.name + parseInt(Math.random() * 1000, 10);
  var width = parameters.width;
  var height = parameters.height;
  var frames = parameters.frames;
  var refresh = parameters.refresh != null ? parameters.refresh : 100;
  var frame = 0;  
  var left = parameters.left != null ? parameters.left : 0;
  var top = parameters.top != null ? parameters.top : 0;
  var vertical = parameters.vertical != null ? parameters.vertical : false;
  var repeat = parameters.repeat != null ? parameters.repeat : true;
  
  var oDiv = createElement('DIV', name);

  this.setAnimation = function (parameters) {
    if (refresh > 1) {
      clearInterval(interval);
    }
  
    image = parameters.image;
    width = parameters.width;
    height = parameters.height;
    frames = parameters.frames;
    refresh = parameters.refresh;
    frame = 0;
    left = parameters.left != null ? parameters.left : 0;
    top = parameters.top != null ? parameters.top : 0;  
    vertical = parameters.vertical != null ? parameters.vertical : false;
    repeat = parameters.repeat != null ? parameters.repeat : true;

    this.updateDOM();

    if (refresh > 1) 
    {
      interval = setInterval(refreshAnimation, refresh);
    }
  }  
  
  this.dispose = function() {
    clearInterval(interval);
  }

  this.updateDOM = function() {
    oDiv.innerHTML = '&nbsp;';
    oDiv.style.position = 'absolute';
    oDiv.style.backgroundImage = 'url(\'' + image + '\')';
    oDiv.style.backgroundRepeat = 'no-repeat';
    oDiv.style.width = width + 'px';
    oDiv.style.height = height + 'px';
    oDiv.style.top = top + 'px';
    oDiv.style.left = left + 'px';  
    oDiv.style.display = 'block';
    oDiv.style.overflow = 'visible';
    oDiv.name = name;
		oDiv.id = id;
		oDiv.setAttribute('id', id);
    oDiv.setAttribute('name', name);
  }

  this.updateDOM();
	
  var interval = refresh > 1 ? setInterval(refreshAnimation, refresh) : 0;

  this.getDOM = function() {
    return oDiv;
  }
  
  function refreshAnimation() {
    frame++;  

    if(frame >= frames) {
      if(!repeat) {
        clearInterval(interval);
        oDiv.parentNode.removeChild(oDiv);  
    
		    oDiv = null;
		
        return;
      }
      frame = 0;
    }

    if (vertical) {
      oDiv.style.background = 'url(' + image + ') no-repeat ' + '0px -' + (frame * height) + 'px';
    }
    else {
      oDiv.style.background = 'url(' + image + ') no-repeat ' + '-' + (frame * width) + 'px 0px';
    }   
  }
} 
  
