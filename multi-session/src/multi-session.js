import Cookies from './js.cookie';
if (!document.addEventListener || !document.hidden === "undefined" || typeof sessionStorage === "undefined") {
    console.error("Requires a browser that supports Session Storage and Page Visibility API.");
    return;
}

const prefix = "MultiSession-";

const MultiSession = (cookies = { cookie1:true,cookie2:false} ) => {

    if ((cookies === null) || (typeof cookies !== 'object')) {
        console.error("Parameters must be an object (Example : {'cookie1':true,'cookie2':false})");
        return;
    }
    
    const save = function (cookiename) {
        if (!(cookiename in cookies)) {
            console.error(cookiename + " not exist");
            return;
        }
        var sessionid = Cookies.get(cookiename);
        if (sessionid) {
            sessionStorage.setItem(prefix + cookiename, sessionid);
        }
            
    };
    
    const close = function () {
        sessionStorage.setItem(prefix + 'closed', 'true');
        for (var cookiename in cookies) {
            sessionStorage.removeItem(prefix + cookiename);
        };
        restore();
    };
    
    const restore = function () {
        for (var cookiename in cookies) {
            var sessionid = sessionStorage.getItem(prefix + cookiename);
            if (sessionid) {
                Cookies.set(cookiename, sessionid);
            } else {
                Cookies.remove(cookiename);
            }
        };
    };

    if (sessionStorage.getItem(prefix + 'closed')) { // a tab cannot be reused if logout
        restore();
        document.location.reload();
    }
    // Calls save(COOKIE1 & COOKIE 2)
    for (var cookiename in cookies) {
        if (cookies[cookiename])
            save(cookiename);
    }

    
    window.onbeforeunload = function () { // for cookies deleted or expired
        restore();
    };
    document.addEventListener("visibilitychange", function () { // for ajax requests
        if (!document.hidden) {
            restore();
        }
    }, false);
    restore(); // deleted unused cookies
    return {
        save, restore, close
    }
}

return MultiSession;