var bg=chrome.extension.getBackgroundPage();var store=bg.store;var twttr=bg.twttr;var timers={};var accounts=bg.accounts;var account;var TIMELINE_TRANSITION="margin-left 0.25s ease-out";var newTweetsBanner;$(document).ready(function(){var b=0;for(var a in accounts){if(!accounts[a].disabled){b++}}if(b){setTimeout(function(){var g=window.location.href.split("?");var z={};if(g[1]){g=g[1].split("&")||null;for(var w in g){g[w]=g[w].split("=");z[g[w][0]]=unescape(g[w][1])}}if(z.inline){document.getElementById("compose-actions").style.display="none";document.getElementById("compose-actions-popout").style.display="block";document.body.style.width="340px"}$("#tabs").on("click","a",function(k){if(!$(this).hasClass("active-tab")){var j=document.getElementById("timeline");var i=document.getElementsByClassName("active-tab")[0].getAttribute("data-view");var B=this.getAttribute("data-view");if(document.getElementsByClassName("temp-timeline").length){$(".active-tab").removeClass("active-tab");$(this).addClass("active-tab");popView(document.getElementsByClassName("temp-timeline")[0])}else{i=document.getElementById(i+"-"+account.id);B=document.getElementById(B+"-"+account.id);j.style.width="200%";i.style.width=window.innerWidth+"px";B.style.cssFloat="right";B.style.display="block";B.style.width=window.innerWidth+"px";j.style.webkitTransition=TIMELINE_TRANSITION;j.style.marginLeft="-100%";setTimeout(function(){j.style.webkitTransition="none";j.style.width="100%";j.style.marginLeft="0px";i.style.display="none";i.style.width="100%";B.style.width="100%";B.style.cssFloat="left";newTweetsBanner.restoreScrollPosition(B)},500);$(".active-tab").removeClass("active-tab");$(this).addClass("active-tab")}}});$("#compose-text").on("focus, click",function(i){if(!$("#compose-bar").hasClass("active")){$("#compose-bar").addClass("active");$("#compose-hidden").show();if($("#compose-text").hasClass("placeholder")){$("#compose-text").removeClass("placeholder").text("")}setTimeout(function(){$("#compose-hidden").css("opacity","1")},10)}});$("#compose-text").on("blur",function(i){if(this.innerHTML=="<br>"||this.innerHTML==""){$("#compose-bar").removeClass("active");$("#compose-text").addClass("placeholder").text($("#compose-text").attr("data-placeholder"));$("#compose-hidden").css("opacity","0");$("#compose-text").removeAttr("data-reply");setTimeout(function(){$("#compose-hidden").hide()},250)}});$("#compose-text").on("keydown paste",function(i){if((i.ctrlKey||i.metaKey)&&i.keyCode==13){$("#send-button").trigger("click")}setTimeout(function(){var j=document.getElementById("compose-text");var k=getCharactersLeft(j);updateCounter(document.getElementById("compose-count"),k);store.set("tweetTemp",j.innerText);store.set("replyTemp",j.getAttribute("data-reply"));if(k==140){j.removeAttribute("data-reply");store.remove("tweetTemp");store.remove("replyTemp")}if(k<0){$("#send-button").attr("disabled","true");$("#send-button").css("opacity","0.25")}else{$("#send-button").removeAttr("disabled");$("#send-button").css("opacity","1")}},10)});$("#send-button").on("click",function(D){if(!$("#send-button").hasClass("sending")&&getCharactersLeft(document.getElementById("compose-text"))!=140){if(getCharactersLeft(document.getElementById("compose-text"))<0){bg.alert("Too many characters!")}else{$("#send-button").addClass("sending");$("#compose-text").removeAttr("contenteditable");D.target.innerText=0;timers.send=setInterval(function(){D.target.innerText++;if(D.target.innerText==8){D.target.innerText=0}},100);if(document.getElementById("compose-file").files.length){function B(){var F=document.getElementById("compose-text");clearInterval(timers.send);D.target.innerText="Send";$(D.target).removeClass("sending");F.textContent="";F.setAttribute("contenteditable",true);$("#compose-text").blur();F.removeAttribute("data-reply");updateCounter(document.getElementById("compose-count"),140);document.getElementById("compose-file").value="";$("#progress-view").fadeOut(250);var G=document.getElementsByClassName("image-tag");if(G.length){G[0].parentNode.removeChild(G[0])}store.remove("tweetTemp");store.remove("replyTemp")}function E(F){if(F.lengthComputable){document.getElementById("progress-bar").style.width=F.loaded/F.total*250+"px"}}function C(F){bg.twitter.updateWithMedia(account.id,document.getElementById("compose-text").innerText.trim(),F,$("#compose-text").attr("data-reply"),B,E)}document.getElementById("progress-bar").style.width="0px";$("#progress-view").fadeIn(250);var k=document.getElementById("compose-file").files[0];if(k.size>3145728){var i=document.createElement("img");var j=document.createElement("canvas");i.src=window.webkitURL.createObjectURL(k);i.onload=function(){var J=1024;var F=2048;var G=i.width;var O=i.height;if(G>O){if(G>J){O*=J/G;G=J}}else{if(O>F){G*=F/O;O=F}}j.width=G;j.height=O;var P=j.getContext("2d");P.drawImage(i,0,0,G,O);var L=j.toDataURL(k.type,0.8);var K=atob(L.split(",")[1]);var I=L.split(",")[0].split(":")[1].split(";")[0];var Q=new ArrayBuffer(K.length);var H=new Uint8Array(Q);for(var M=0;M<K.length;M++){H[M]=K.charCodeAt(M)}var N=new WebKitBlobBuilder();N.append(Q);C(N.getBlob(I));window.webkitURL.revokeObjectURL(i.src)}}else{C(k)}}else{bg.twitter.update(account.id,document.getElementById("compose-text").innerText.trim(),$("#compose-text").attr("data-reply"),B)}}}});document.getElementById("compose-action-media").onclick=function(i){document.getElementById("compose-file").click();i.preventDefault()};document.getElementById("compose-file").onchange=function(D){var k=this.files[0];var C=/image.*/;if(!k.type.match(C)){alert("Not an image.")}else{var B=document.getElementById("compose-actions");var j=B.getElementsByClassName("image-tag");if(j.length){B.removeChild(j[0])}var i=document.createElement("div");i.innerHTML=Handlebars.templates.imageTag({name:k.name});B.appendChild(i.firstElementChild);$("#compose-text").trigger("keydown")}};$("#compose-bar").on("click",".image-tag a",function(k){var i=this.parentNode;var j=document.getElementById("compose-file");i.parentNode.removeChild(i);j.value="";$("#compose-text").trigger("keydown")});$("#popout-button, #compose-actions-popout").on("click",function(i){chrome.windows.create({url:"timeline.html",width:360,height:600,type:"popup"});window.close()});$("#timeline").on("click","a",function(i){if(this.href.substr(0,4)=="http"){chrome.tabs.create({url:this.href});i.preventDefault()}});$("#timeline").on("mouseenter",".tweet",function(i){$(this).find(".tweet-actions").css("opacity","1");$(this).find(".tweet-time").css("opacity","0")});$("#timeline").on("mouseleave",".tweet",function(i){$(this).find(".tweet-actions").css("opacity","0");$(this).find(".tweet-time").css("opacity","1")});$("#timeline").on("dblclick",".tweet",function(i){pushConversationView(this.parentNode,this.id.split("-")[2]);window.getSelection().empty()});$("#timeline").on("click",".tweet-action-reply",function(k){var j=this.parentNode.parentNode.parentNode;var B=j.id.split("-")[2];var i=twttr.txt.extractMentions(j.getElementsByClassName("tweet-text")[0].innerText);i.unshift(j.getAttribute("data-screen-name"));replyTo(B,i)});$("#timeline").on("click",".tweet-action-favourite",function(j){if(this.innerText=="R"){var i=this.parentNode.parentNode.parentNode;var k=i.id.split("-")[2];this.innerText=0;timers[k+"-favourite"]=setInterval(function(){j.target.innerText++;if(j.target.innerText==8){j.target.innerText=0}},100);if(!$(this).hasClass("favourited")){bg.twitter.favourite(k,account.id,function(){clearInterval(timers[k+"-favourite"]);j.target.innerText="R";$(j.target).addClass("favourited");$(i).append('<div class="tweet-corner-favourite">R</div>');var C=account.stream.timeline;var B=0;while(C[B].id_str>k){B++}if(C[B].id_str==k){C[B].favorited=true}})}else{bg.twitter.unfavourite(k,account.id,function(){clearInterval(timers[k+"-favourite"]);j.target.innerText="R";$(j.target).removeClass("favourited");$(i).find(".tweet-corner-favourite").remove();var C=account.stream.timeline;var B=0;while(C[B].id_str>k){B++}if(C[B].id_str==k){C[B].favorited=false}})}}});$("#timeline").on("click",".tweet-action-retweet",function(j){if(this.innerText=="J"){var i=this.parentNode.parentNode.parentNode;var k=i.id.split("-")[2];this.innerText=0;timers[k+"-retweet"]=setInterval(function(){j.target.innerText++;if(j.target.innerText==8){j.target.innerText=0}},100);if(!$(this).hasClass("retweeted")){bg.twitter.retweet(k,account.id,function(C){clearInterval(timers[k+"-retweet"]);j.target.innerText="J";$(j.target).addClass("retweeted");$(i).append('<div class="tweet-corner-retweet">J</div>');i.setAttribute("data-retweet-id",C.id_str);var D=account.stream.timeline;var B=0;while(D[B].id_str>k){B++}if(D[B].id_str==k){D[B].retweeted=true;D[B].current_user_retweet={id_str:C.id_str}}})}else{bg.twitter.deleteStatus(i.getAttribute("data-retweet-id"),account.id,function(){clearInterval(timers[k+"-retweet"]);j.target.innerText="J";$(j.target).removeClass("retweeted");$(i).find(".tweet-corner-retweet").remove();i.removeAttribute("data-retweet-id");var C=account.stream.timeline;var B=0;while(C[B].id_str>k){B++}if(C[B].id_str==k){C[B].retweeted=false;delete C[B].current_user_retweet}})}}});$("#timeline").on("click",".message-thread",function(i){var j=this.id.split("-")[3];pushMessageView(this.parentNode,j)});$("#timeline").on("keydown paste",".message-compose-text",function(i){if(i.keyCode==13){$(this.parentNode.getElementsByClassName("send-button")[0]).trigger("click")}setTimeout(function(){var k=getCharactersLeft(i.target);updateCounter(i.target.parentNode.getElementsByClassName("counter")[0],k);var j=i.target.parentNode.getElementsByClassName("send-button")[0];if(k<0){j.setAttribute("disabled",true);j.style.opacity="0.25"}else{j.removeAttribute("disabled");j.style.opacity="1"}})});$("#timeline").on("click",".dm-send-button",function(B){var k=this.parentNode.getElementsByTagName("input")[0];if(!$(this).hasClass("sending")&&getCharactersLeft(k)!=140){var i=this.parentNode.getElementsByClassName("counter")[0];var j=this.parentNode.parentNode.getElementsByClassName("message-header")[0].getAttribute("data-user-id");if(getCharactersLeft(k)<0){bg.alert("Too many characters!")}else{$(this).addClass("sending");k.setAttribute("disabled",true);this.innerText=0;timers.messageSend=setInterval(function(){B.target.innerText++;if(B.target.innerText==8){B.target.innerText=0}},100);bg.twitter.dm(account.id,k.value,j,function(){clearInterval(timers.messageSend);B.target.innerText="Send";$(B.target).removeClass("sending");k.value="";k.removeAttribute("disabled");k.focus();i.textContent="140"})}}});$("#timeline").on("click",".back-button",function(j){var i=this;while(i.className!="temp-timeline"&&i.className){i=i.parentNode}popView(i)});$("#timeline").on("keydown",".dm-recipient",function(i){if(i.keyCode==13){this.parentNode.getElementsByClassName("dm-compose-button")[0].click()}});$("#timeline").on("click",".dm-compose-button",function(k){var j=this.parentNode.getElementsByTagName("input")[0];if(!$(this).hasClass("sending")&&j.value.length){$(this).addClass("sending");j.setAttribute("disabled",true);this.textContent=0;timers.DMCompose=setInterval(function(){k.target.innerText++;if(k.target.innerText==8){k.target.innerText=0}},100);bg.twitter.getFriendships({accountId:account.id,parameters:[["source_id",account.id],["target_screen_name",j.value]],success:function(C){i();if(C.relationship.source.can_dm){pushMessageView(k.target.parentNode.parentNode,C.relationship.target.id_str,C.relationship.target.screen_name)}else{var B=webkitNotifications.createNotification("images/48.png","Can't create DM","You don't have permission to Direct Message that user");B.show()}},error:function(E,C,D){i();if(D.status==404){var B=webkitNotifications.createNotification("images/48.png","User not found","Couldn't create DM - user does not exist")}else{var B=webkitNotifications.createNotification("images/48.png","Twitter error","Couldn't create DM - "+E)}B.show()}});function i(){clearInterval(timers.DMCompose);k.target.innerText="New";$(k.target).removeClass("sending");j.value="";j.removeAttribute("disabled");j.focus()}}});$("#timeline").on("click","#reload-link",function(){bg.document.location.reload();this.parentNode.textContent="Loading...";setTimeout(function(){document.location.reload()},5000)});document.getElementById("account-select-input").onchange=function(k){var C=document.getElementsByClassName("temp-timeline");if(C.length){popView(C[0])}var i=document.getElementsByClassName("active-tab")[0].getAttribute("data-view");var j=document.getElementById(i+"-"+account.id);account=bg.twitter.getAccountById($(this).val());var B=document.getElementById(i+"-"+account.id);j.style.display="none";B.style.display="block";document.getElementById("account-select-image").src=account.image;newTweetsBanner.restoreScrollPosition(B)};var f=document.getElementById("timeline");var q=document.getElementById("account-select-input");var r=store.get("timelineCache")||{};var m=["timeline","mentions","userTimeline"];var d;for(var v in accounts){if(!accounts[v]["disabled"]){var n='<option value="'+accounts[v].id+'"';if(accounts[v]["default"]){account=accounts[v];n+=" selected";document.getElementById("account-select-image").src=accounts[v].image}n+=">"+accounts[v].screenName+"</option>";q.innerHTML+=n;var u=0;while(d=m[u++]){log("Building timelines");if(accounts[v].stream){var s=accounts[v].stream[d];if(d=="timeline"){d="home"}var A="";var h=document.createElement("div");h.id=d+"-"+accounts[v].id;h.className="timeline-"+d;if(r[h.id]&&r[h.id]!='<div class="loading">0</div>'){h.innerHTML=r[h.id];if(!h.getElementsByClassName("loading").length){h.innerHTML+='<div class="loading">0</div>'}var x=h.children[0].id.split("-")[2];var w=0;if(s){try{while(s[w].id_str>x&&w<100){log("Tweet output");s[w].account_id=accounts[v].id;if(!s[w].processed){s[w]=processTweet(s[w])}A+=tweetFromTemplate(s[w],d);w++;if(!s[w]){break}}}catch(e){}if(w<100){h.innerHTML=A+h.innerHTML}else{h.innerHTML=A+'<div class="loading">0</div>'}}}else{if(s){for(var w in s){s[w].account_id=accounts[v].id;if(!s[w].processed){s[w]=processTweet(s[w])}A+=tweetFromTemplate(s[w],d)}h.innerHTML=A+'<div class="loading">0</div>'}else{h.innerHTML='<div class="loading" style="font-family:Helvetica,Arial">No tweets</div>'}}f.appendChild(h)}else{f.innerHTML='<div class="loading" style="font-family:Helvetica,Arial">Error - Please <a href="#" id="reload-link">reload</a></div>'}}var y=document.createElement("div");y.id="messages-"+accounts[v].id;y.className="timeline-messages";y.innerHTML=Handlebars.templates.messagesHeader();f.appendChild(y);function c(F,B){var E={};var k=[];for(var C=F.stream.messages.length-1;C>=0;C--){var D=jQuery.extend({},F.stream.messages[C]);D.account_id=F.id;if(D.sender_id!=F.id){if(k.indexOf(D.sender_id)==-1){k.push(D.sender_id)}E[D.sender_id]=D}else{if(!E[D.recipient.id_str]){k.push(D.recipient.id_str);E[D.recipient.id_str]=D;E[D.recipient.id_str].sender=E[D.recipient.id_str].recipient}else{if(new Date(E[D.recipient.id_str].created_at)<new Date(D.created_at)){E[D.recipient.id_str].text=D.text;E[D.recipient.id_str].created_at=D.created_at}}}}k.sort(function(G,i){return new Date(E[i].created_at)-new Date(E[G].created_at)});for(var j in k){B.innerHTML+=Handlebars.templates.messageThread(E[k[j]])}updateTimestamps()}c(accounts[v],y)}}if(!account){account=accounts[0]}cacheTimelines();$(".timeline-home, .timeline-mentions, .timeline-userTimeline").on("scroll",function(j){newTweetsBanner.checkScroll(this.id);if(this.scrollHeight-(this.scrollTop+this.offsetHeight)<100){var D=this.getElementsByClassName("loading")[0];if(!D.getAttribute("data-loading")){D.setAttribute("data-loading",true);timers["loading-"+this.id]=setInterval(function(){D.innerText++;if(D.innerText==8){D.innerText=0}},100);var C=timers["loading-"+this.id];var i=this;var B=this.getElementsByClassName("tweet");B=B[B.length-1].id.split("-")[2];var k=function(G){clearInterval(C);D.removeAttribute("data-loading");for(var E=1;E<G.length;E++){G[E].account_id=account.id;G[E]=processTweet(G[E]);var F=document.createElement("div");F.innerHTML=tweetFromTemplate(G[E],document.getElementsByClassName("active-tab")[0].getAttribute("data-view"));i.insertBefore(F.firstElementChild,D)}account.stream.timeline=account.stream.timeline.concat(G);updateTimestamps();cacheTimelines()};switch(this.className){case"timeline-home":bg.twitter.getTimeline({accountId:account.id,type:"home",parameters:[["max_id",B]],success:k});break;case"timeline-mentions":bg.twitter.getMentions({accountId:account.id,parameters:[["max_id",B]],success:k});break;case"timeline-userTimeline":bg.twitter.getUserTimeline({accountId:account.id,parameters:[["max_id",B]],success:k});break}}}});if(account.id){var p=document.getElementById("home-"+account.id);if(p){p.style.display="block";newTweetsBanner.restoreScrollPosition(p)}}updateTimestamps();setInterval(updateTimestamps,60000);if(navigator.appVersion.indexOf("Mac")!=-1&&!z.inline){$("#compose-bar").addClass("mac")}var t=store.get("tweetTemp");var o=store.get("replyTemp");var l=document.getElementById("compose-text");if(t&&t!=l.getAttribute("data-placeholder")){l.innerText=t;if(o){l.setAttribute("data-reply",o)}$("#compose-text").removeClass("placeholder").trigger("keydown")}})}else{timeline.innerHTML='<div class="loading" style="font-family:Helvetica,Arial">No accounts connected</div>'}newTweetsBanner={elem:document.getElementById("new-tweets-banner"),value:0,lastID:"0",hidden:true,checkScroll:function(d){var c=this.getCurrentTweet().id.split("-")[2];if(c>this.lastID&&c.length==this.lastID.length){this.lastID=c;this.updateCount(d)}bg.twitter.timelineScrollCache[d].scrollTop=document.getElementById(d).scrollTop;bg.twitter.timelineScrollCache[d].lastID=this.lastID},updateCount:function(g){var c=0;var e=g.split("-")[0];var f=document.getElementById(e+"-"+account.id+"-"+this.lastID);if(f){var d=f.previousSibling;while(d){c++;d=d.previousSibling}this.value=c;this.elem.innerText=this.value+" new tweets";if(this.value&&this.hidden){this.elem.style.marginTop="0px";this.hidden=false}else{if(!this.value&&!this.hidden){this.elem.style.marginTop="-25px";this.hidden=true}}}},getCurrentTweet:function(){this.elem.parentNode.style.marginLeft="1px";var c=document.elementFromPoint(0,document.getElementById("timeline").offsetTop);this.elem.parentNode.style.marginLeft="0px";return c},restoreScrollPosition:function(c){var e=this.getCurrentTweet().id.split("-")[2];var d=bg.twitter.timelineScrollCache[c.id];if(d){c.scrollTop=d.scrollTop;if(d.scrollTop){this.lastID=d.lastID}else{this.lastID=e}}else{this.lastID=e;bg.twitter.timelineScrollCache[c.id]={scrollTop:0,lastID:e}}this.updateCount(c.id)}}});function getCharactersLeft(e){if(e.tagName=="DIV"){var g="";var a=e.childNodes;for(var b=0;b<a.length;b++){if(a[b].length||a[b].innerHTML){var c=a[b].textContent.replace(String.fromCharCode(160)," ");if(c=="\n"){c=""}g+=c+"\n"}}g=g.slice(0,-1)}else{var g=e.value}var d=g.length;var f=twttr.txt.extractUrls(g);for(var b in f){d+=((f[b].charAt(4)==":")?20:21)-f[b].length}if(e.tagName=="DIV"){if(document.getElementsByClassName("image-tag").length){d+=19}}return 140-d}function updateCounter(b,a){b.textContent=a;b.style.color="rgb("+(255-5*a)+",0,0)"}function timeAgo(b){var c=(Date.now()-new Date(b))/1000;var a="s";if(c>=60){c/=60;a="m";if(c>=60){c/=60;a="h";if(c>=24){c/=24;a="d";if(c>=7){c/=7;a="w"}}}}return Math.floor(c)+a}function updateTimestamps(){var a=document.getElementsByClassName("tweet-time");for(var b=0;b<a.length;b++){a[b].innerText=timeAgo(a[b].getAttribute("data-timestamp"))}}function processTweet(a){if(a.retweeted_status){a.retweeted_status.retweeted_by=a.user.screen_name;if(a.user.id==a.account_id){a.retweeted_status.retweeted_id_str=a.id_str}a.retweeted_status.id_str=a.id_str;a.retweeted_status.account_id=a.account_id;a=a.retweeted_status}if(a.entities.media){a.entities.urls=a.entities.urls.concat(a.entities.media)}a.text=twttr.txt.autoLink(a.text,{urlEntities:a.entities.urls,hashtagClass:"tweet-hashtag",usernameClass:"tweet-username",usernameIncludeSymbol:true}).replace(/\n/g,"<br />").replace(String.fromCharCode(160)," ");a.processed=true;return a}function replyTo(g,c){var e="";for(var b in c){if(c[b].toLowerCase()==account.screenName.toLowerCase()){c.splice(b,1)}}$("#compose-text").click().focus();$("#compose-text").html("@"+c.join(" @")+"&nbsp;");$("#compose-text").attr("data-reply",g);$("#compose-text").trigger("keydown");var f=document.getElementById("compose-text");var a=document.createRange();a.setStart(f.childNodes[0],c[0].length+2);a.setEnd(f.childNodes[0],f.innerText.length);var d=window.getSelection();d.removeAllRanges();d.addRange(a)}function replyToDM(a){$('a[data-view="messages"]').click();pushMessageView(document.getElementById("messages-"+account.id),a)}function pushView(b,c){c.style.display="block";c.style.width=window.innerWidth+"px";var a=document.getElementById("timeline");a.style.width="200%";a.appendChild(c);b.style.width=window.innerWidth+"px";a.style.webkitTransition=TIMELINE_TRANSITION;a.style.marginLeft="-100%";setTimeout(function(){a.style.webkitTransition="none";a.style.width="100%";a.style.marginLeft="0px";b.style.display="none";b.style.width="100%";c.style.width="100%"},500)}function popView(b){var c=document.getElementsByClassName("active-tab")[0].getAttribute("data-view");c=document.getElementById(c+"-"+account.id);c.style.display="block";c.style.width=window.innerWidth+"px";b.style.width=window.innerWidth+"px";var a=document.getElementById("timeline");a.style.width="200%";a.style.marginLeft="-100%";setTimeout(function(){a.style.webkitTransition=TIMELINE_TRANSITION;a.style.marginLeft="0px"});setTimeout(function(){a.style.webkitTransition="none";a.style.width="100%";a.removeChild(b);c.style.width="100%"},500)}function pushMessageView(f,a,b){var d=[];var c=document.createElement("div");c.className="temp-timeline";c.style.overflowY="hidden";var j=bg.twitter.getAccountById(account.id).stream.messages;for(var e=j.length-1;e>=0;e--){var k=jQuery.extend({},j[e]);if(k.sender_id==a||k.recipient_id==a){k.text=twttr.txt.autoLink(k.text,{usernameIncludeSymbol:true});k.account_id=account.id;d.push(k)}}var h="";if(d.length){b=(d[0].sender_id==account.id)?d[0].recipient_screen_name:d[0].sender_screen_name;for(var e in d){h+=Handlebars.templates.message(d[e])}}c.innerHTML=Handlebars.templates.messageHeader({sender_screen_name:b,sender_id:a});c.innerHTML+='<div class="scroll-container" style="padding-bottom:103px"><div class="message-scroll">'+h+"</div></div>";c.innerHTML+=Handlebars.templates.messageFooter();pushView(f,c);var g=c.getElementsByClassName("message-scroll")[0];g.scrollTop=g.scrollHeight;updateTimestamps();setTimeout(function(){$(c).find(".message-compose-text").trigger("focus")},500)}function pushConversationView(a,f){var b=document.createElement("div");b.className="temp-timeline";b.innerHTML='<div class="message-header"><button class="back-button">Back</button><h1>Conversation View</h1></div><div class="loading">0</div>';var c=b.getElementsByClassName("loading")[0];timers.conversationView=setInterval(function(){c.innerText++;if(c.innerText==8){c.innerText=0}},100);function e(g){g.account_id=account.id;g=processTweet(g);var h=document.createElement("div");h.innerHTML=tweetFromTemplate(g,"conversation");b.insertBefore(h.firstElementChild,c);updateTimestamps();if(g.in_reply_to_status_id_str){d(g.in_reply_to_status_id_str)}else{clearInterval(timers.conversationView);b.removeChild(c)}}function d(g){bg.twitter.getStatus({accountId:account.id,parameters:[["id",g]],success:e})}d(f);pushView(a,b)}function updateTimeline(k,c){log("Starting timeline update");if(k=="home"){var g=c.stream.timeline}else{var g=c.stream[k]}var m=document.getElementById(k+"-"+c.id);var j=m.firstElementChild;var a=(m.children)?m.children[0].id.split("-")[2]:"0";var d=0;while(g[d].id_str>a){log("Timeline update");g[d].account_id=c.id;if(!g[d].processed){g[d]=processTweet(g[d])}var b=document.createElement("div");b.innerHTML=tweetFromTemplate(g[d],k);m.insertBefore(b.firstElementChild,j);var l=$("#"+k+"-"+c.id+"-"+g[d].id_str).outerHeight();try{var f=(bg.twitter.timelineScrollCache[m.id].scrollTop||localStorage.noScroll=="true")}catch(h){}m.scrollTop+=l;if(f){newTweetsBanner.updateCount(m.id);bg.twitter.timelineScrollCache[m.id].scrollTop+=l}else{animateScroll(m,0,250)}d++;if(!g[d]){break}}updateTimestamps()}function updateMessage(a,k){var j=(k.sender_id==a)?k.recipient_id:k.sender_id;var f=document.getElementsByClassName("temp-timeline");var g=document.getElementById("message-thread-"+a+"-"+j);if(!g){var d=document.getElementById("messages-"+a);if(k.sender_id==a){k.sender=k.recipient}k.account_id=a;g=document.createElement("div");g.innerHTML=Handlebars.templates.messageThread(k);d.insertBefore(g.firstElementChild,d.children[1])}else{g.getElementsByClassName("tweet-text")[0].innerHTML=k.text;g.getElementsByClassName("tweet-time")[0].setAttribute("data-timestamp",k.created_at);g.parentNode.insertBefore(g,g.parentNode.children[1])}k.text=twttr.txt.autoLink(k.text,{hashtagClass:"tweet-hashtag",usernameClass:"tweet-username",usernameIncludeSymbol:true});for(var e=0;e<f.length;e++){var b=f[e].getElementsByClassName("message-header")[0];if(b){if(b.getAttribute("data-user-id")==j){var d=f[e].getElementsByClassName("message-scroll")[0];var h=(d.scrollTop+d.offsetHeight==d.scrollHeight);k.account_id=a;var c=document.createElement("div");c.innerHTML=Handlebars.templates.message(k);d.appendChild(c);if(h){d.scrollTop=d.scrollHeight}}}}updateTimestamps()}function deleteStatus(h,g){log("About to delete");var f=[document.getElementById("home-"+h),document.getElementById("userTimeline-"+h),document.getElementById("mentions-"+h)];var c=0;for(var b in f){try{while(f[b].children[c].id.split("-")[2]>g||f.children[c].getAttribute("retweet")&&f.children[c].id.split("-")[2]!=g){log("Deleting");c++}if(f[b].children[c].id.split("-")[2]==g){f.removeChild(f.children[c])}}catch(d){}}}function cacheTimelines(){var c=document.getElementById("timeline").children;var e={};var b=0;while(c[b]){log("Caching");if(c[b].children&&c[b].className!="timeline-messages"){var d=jQuery.extend({},c[b].children);e[c[b].id]="";var a=0;while(d[a]&&a<101){e[c[b].id]+=d[a].outerHTML;a++}}b++}store.set("timelineCache",e)}function animateScroll(a,f,e){var g=Date.now();var c=a.scrollTop;var d=f-c;function b(){var h=(Date.now()-g)/e;if(h>1){h=1}a.scrollTop=c+d*h;if(h!=1){webkitRequestAnimationFrame(b)}}b()}function tweetFromTemplate(b,a){b.timeline=a;return Handlebars.templates.tweet(b)}function log(a){bg.console.log(Date.now()+": "+a)};