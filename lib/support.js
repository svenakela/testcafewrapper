import {ClientFunction} from 'testcafe';
import http from 'http';

function cached (cache, value, t) {
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

export default class Support {
  constructor(testController) {
    this.t = testController;
  }

  cacheValue(value) {
    return cached('cache', value, this.t);
  }

}




export function cache (t, value) {
    return cached('cache', value, t);
}

export function storeSession (t, value) {
    return cached('session', value, t);
}

export function restoreSession (t) {
	const cookies = getParam(t, 'session').cookies;

	cookies.forEach(function(cookie) {
		setCookie(cookie.name, cookie.value);
	});
}

const setCookie = ClientFunction((key, value) => {
	document.cookie = key + "=" + value;
});

export function getParam (t, key) {
	const data = JSON.parse(t.testRun.opts.clientScripts.values().next().value.content);
	return data[key];
}

export const getCookies = ClientFunction(() => {
	 var pairs = document.cookie.split(";");
	 var cookies = [];
	 for (var i=0; i<pairs.length; i++){
	   var pair = pairs[i].split("=");
	   cookies[i] = {name:(pair[0]+'').trim(), value:unescape(pair.slice(1).join('='))};
	 }
	 return cookies;
});