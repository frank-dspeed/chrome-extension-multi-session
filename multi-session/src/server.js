var cookieSession = require('cookie-session')
var express = require('express')
var app = express()
app.use(express.cookieParser());

/**
 * 	session_name('COOKIE1');
	$newid = session_create_id();
	session_id($newid);
	session_start();
	$_SESSION['login'] = true;
	header('Location: user.php');

    1. Store COOKIE1 with content session id then redirect to user page to do not do that
 */

app.use([
    cookieSession({
        name: 'session',
        keys: ['/* secret keys */'],

        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }),
    req => req.session.login=true
])






/*
<?php
session_name('COOKIE1');
session_start();
if ((!isset($_SESSION['login'])) || (!$_SESSION['login'])) {
	header("HTTP/1.0 403 Forbidden");
	exit;
}
?>
*/
app.use('user', req => {
    if (!req.session.login) {
        req.res.status(403).send()
    }
    // start Session is done via the first root
    req.res.status(201).cookie('COOKIE1', true).redirect(301, '/user')
    //COOKIE1
})



`<!DOCTYPE html>
<html lang="fr">

<head>
	<script src="js.cookie.min.js"></script>
	<script src="sessionbox.js"></script>
</head>

<body>
	<script>
    function SessionBox(cookies) {
		if ((cookies === null) || (typeof cookies !== 'object')) {
			console.error("Parameters must be an object (Example : {'cookie1':true,'cookie2':false})");
			return;
		}

		var hidden, visibilityChange;
		if (typeof document.hidden !== "undefined") {
			hidden = "hidden";
			visibilityChange = "visibilitychange";
		} else if (typeof document.msHidden !== "undefined") {
			hidden = "msHidden";
			visibilityChange = "msvisibilitychange";
		} else if (typeof document.webkitHidden !== "undefined") {
			hidden = "webkitHidden";
			visibilityChange = "webkitvisibilitychange";
		}

		if (typeof document.addEventListener === "undefined" ||
			typeof document.hidden === "undefined" ||
			typeof sessionStorage === "undefined") {
			console.error("Requires a browser that supports Session Storage and Page Visibility API.");
			return;
		}

		if (Cookies === null) {
			console.error('Javacript Cookie library dependancy (https://github.com/js-cookie/js-cookie)');
			return;
		}

		this.prefix = "sessionbox-";
		this.cookies = cookies;

		if (sessionStorage.getItem(this.prefix + 'closed')) { // a tab cannot be reused if logout
			this.restore();
			document.location.reload();
		}

		for (var cookiename in cookies) {
			if (cookies[cookiename])
				this.save(cookiename);
		}

		var _this = this;
		window.onbeforeunload = function () { // for cookies deleted or expired
			_this.restore();
		};
		document.addEventListener("visibilitychange", function () { // for ajax requests
			if (!document.hidden) {
				_this.restore();
			}
		}, false);
		this.restore(); // deleted unused cookies
	}

	SessionBox.prototype.save = function (cookiename) {
		if (!(cookiename in this.cookies)) {
			console.error(cookiename + " not exist");
			return;
		}
		var sessionid = Cookies.get(cookiename);
		if (sessionid)
			sessionStorage.setItem(this.prefix + cookiename, sessionid);
	};

	SessionBox.prototype.close = function () {
		sessionStorage.setItem(this.prefix + 'closed', 'true');
		for (var cookiename in this.cookies) {
			sessionStorage.removeItem(this.prefix + cookiename);
		};
		this.restore();
	};

	SessionBox.prototype.restore = function () {
		for (var cookiename in this.cookies) {
			var sessionid = sessionStorage.getItem(this.prefix + cookiename);
			if (sessionid) {
				Cookies.set(cookiename, sessionid);
			} else {
				Cookies.remove(cookiename);
			}
		};
	};
	var sessionbox = new SessionBox({
			'COOKIE1': true,
			'COOKIE2': false
	});
	</script>

    SessionID: ${req.session.id}

	<div id="cookie2">
	</div>
	<script>
		document.getElementById('cookie2').innerHTML = Cookies.get('COOKIE2');
	</script>

	<button id="cookie2Create">Create Cookie2</button>
	<script>
		document.getElementById("cookie2Create").onclick = function() {
			Cookies.set('COOKIE2', '_' + Math.random().toString(36).substr(2, 9));
			sessionbox.save('COOKIE2');
			document.getElementById('cookie2').innerHTML = Cookies.get('COOKIE2');
		};
	</script>

	<button id="logout">Logout</button>
	<script>
		document.getElementById("logout").onclick = function() {
			sessionbox.close();
		};
	</script>
</body>

</html>`