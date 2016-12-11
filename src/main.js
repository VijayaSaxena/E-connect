var sentiment = require('sentiment');

var appState = {};
var scoreId = 0;


var scoreBox = function(el, sib, scoreId){
	this.id = scoreId;
	this.element = el;
	this.sibling = sib;
	this.sibling.before(this.element);
	this.sibling.keyup(this,calculateSentiment);
	initStyles(this);
}

var calculateSentiment= function(obj){
	var textmsg = obj.data.sibling.find('div[role="textbox"]').text();
	var sentences = textmsg.split(".").length;
	var maxscore = sentences * 4;

	sentiment(textmsg, function(err, result){
		//percent score may be higher and lower than 100% and -100%, respectively
		var mypercent = Math.floor((result.score/maxscore) * 100);
		var thisScore = Math.floor((result.score/maxscore) * 60) + 60;
		colorIcon(thisScore, obj);
		obj.data.element.text(mypercent +'%');
	})
}

var colorIcon=function(num, obj){
	//range must fall within 0 and 120 to correspond to HSL range
	if (num < 0) num = 0
	if (num > 120) num = 120
	obj.data.element.css("background-color", "hsl(" + num + ",100%,90%)");
}

var initStyles = function(obj){
	obj.element.css("height", "25px");
	obj.element.css("padding","5px 5px 0px");
	obj.element.css("text-align", "left");
	obj.element.css("font-family", "monospace");
	obj.element.css("background-color", "hsl(50,100%,80%)");
	obj.element.html("0%");
}

setTimeout(function(){

var compose = $("div[gh='cm']");
var reply = $("div[aria-label='Reply']");
var msgBox;
var elem;


compose.bind('click',function(){
	
	var intervalId = setInterval(function(){
		//find table without scoreID
		msgBox = $("table[class='iN'][status!='added']");

		if (msgBox){
			msgBox.css("margin", "0");
			/*	grab New Message box and hand it off to another object 
				so it can hook onto the next Message
			*/
			scoreId += 1;
			msgBox.attr('msgBoxId', scoreId)
			msgBox.attr('status','added');
			elem = $(document.createElement('div'));
			$('.aoD.az6').css('margin','0');
			elem.attr('id', 'msg' +scoreId);
			appState[scoreId] = new scoreBox(elem, msgBox, scoreId);
			msgBox = null;
			console.log(appState);
			clearInterval(intervalId);
		}
	},500);
	

})	
},3000);

