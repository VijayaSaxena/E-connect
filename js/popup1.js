chrome.tabs.getSelected(null, function(tab) {
var tabId = tab.id;
var tabUrl = tab.url;
var tabTitle=tab.title;
var body = "Hi, Check out this link: "+ tabUrl;
var links = document.getElementsByClassName("1");
var baseUrl = "https://outlook.com/default.aspx?rru=compose";
var url = '';
var subject = tabTitle;
var outlookUrl = baseUrl +"&subject=" + encodeURIComponent(subject) +"&body=" + encodeURIComponent(body);
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: outlookUrl});
            };
        })();
    }
var gmail_schedule_url="https://docs.google.com/spreadsheets/d/17J2x4NkESZjprSdHywDQqYaMUddN5PpzcjQ7UqYNt4g/copy";

links = document.getElementsByClassName("2");
for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: gmail_schedule_url});
            };
        })();
    }

 tabId = tab.id;
 tabUrl = tab.url;
 tabTitle=tab.title;
 body = "Hi, Check out this link: "+ tabUrl;
 links = document.getElementsByClassName("0");
 baseUrl = "https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1";
 url = '';
 subject = tabTitle;
 gmailUrl = baseUrl +"&su=" + encodeURIComponent(subject) +"&body=" + body;
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: gmailUrl});
            };
        })();
    }

baseUrl = "http://www.facebook.com/share.php?u=";
links = document.getElementsByClassName("3");
fbUrl=baseUrl+tabUrl;
url = '';
 for (var i = 0; i < links.length; i++) {
    (function () {
            var ln = links[i];
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: fbUrl});
            };
        })();
    }

LinkedinUrl="https://www.linkedin.com/shareArticle?mini=true&url=";
LinkedinUrl=LinkedinUrl+tabUrl;
links = document.getElementsByClassName("4");
url = '';
 for (var i = 0; i < links.length; i++) {
    (function () {
            var ln = links[i];
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: LinkedinUrl});
            };
        })();
    }


Gplus="https://plus.google.com/share?url=";
Gplus=Gplus+tabUrl;
links = document.getElementsByClassName("5");
url = '';
 for (var i = 0; i < links.length; i++) {
    (function () {
            var ln = links[i];
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: Gplus});
            };
        })();
    }
var t2="<br>Check out the above link. It's informative!!";
BlogUrl="https://www.blogger.com/blog-this.g?n="+tabTitle+"&t="+encodeURIComponent(t2)+"&u="+tabUrl;
links = document.getElementsByClassName("6");
url = '';
 for (var i = 0; i < links.length; i++) {
    (function () {
            var ln = links[i];
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: BlogUrl});
            };
        })();
    }
t2="Hi, Check out this link: "+tabTitle;
var TUrl="https://twitter.com/intent/tweet?text="+encodeURIComponent(t2)+"&url="+tabUrl;

links = document.getElementsByClassName("7");
url = '';
 for (var i = 0; i < links.length; i++) {
    (function () {
            var ln = links[i];
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: TUrl});
            };
        })();
    }
});
