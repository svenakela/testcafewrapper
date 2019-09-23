import {ClientFunction} from 'testcafe';

const http = require('http');

const cached = (cache, value, t) => {
  let options = {
    url: 'http://localhost',
    port: getParam(t, 'port'),
    path: '/cache/v1/' + cache + '/' + getParam(t, 'uuid'),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let request = http.request(options);
  request.write(value);
  request.end();
  return options;
}

module.exports.cache = function(t, value) {
    return cached('cache', value, t);
}

module.exports.storeSession = function(t, value) {
    return cached('session', value, t);
}

module.exports.restoreSession = function(t) {
	const cookies = getParam(t, 'session').cookies;

	cookies.forEach(function(cookie) {
		setCookie(cookie.name, cookie.value);
	});
}

const setCookie = ClientFunction((key, value) => {
	document.cookie = key + "=" + value;
});

function getParam(t, key) {
	const data = JSON.parse(t.testRun.opts.clientScripts.values().next().value.content);
	return data[key];
}

module.exports.getParam = function (t, key) {
	return getParam(t, key);
}

module.exports.getCookies = ClientFunction(() => {
	 var pairs = document.cookie.split(";");
	 var cookies = [];
	 for (var i=0; i<pairs.length; i++){
	   var pair = pairs[i].split("=");
	   cookies[i] = {name:(pair[0]+'').trim(), value:unescape(pair.slice(1).join('='))};
	 }
	 return cookies;
});