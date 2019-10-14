import { RequestHook } from 'testcafe';

export default class BrowserCookieHook extends RequestHook {

    cookies = [];

    constructor (cookies) {
        super(/.*/, { includeHeaders: true, includeBody: true });
        this.cookies = cookies;
    }
    
    async onRequest (event) {
        console.log("\nHeaders: "+JSON.stringify(event.requestOptions.headers));

        if(event.requestOptions.headers['cookie'] != undefined) {
            const parsedCookies = this.parseCookies(event.requestOptions.headers['cookie']); 
            this.updateCookies(parsedCookies);
        }
    }

    async onResponse (event) {
        
    }
 
    parseCookies(cookieString) {
        let cookies = [];
        cookieString.split('; ').forEach(function(el) {
            const matcher = el.match(`([^=]+)=(.*)`);
            cookies.push({key: matcher[1], value: matcher[2]});
        })
        return cookies;
    }

    updateCookies(receivedCookies) {
        receivedCookies.forEach((receivedCookie)=>{
            this.cookies.forEach((cookie, cookieIndex)=>{
                if(receivedCookie.key == cookie.key && receivedCookie.value != cookie.value) {
                    this.cookies[cookieIndex].value = receivedCookie.value;
                }
            })
        });
    }

    getCookies() {
        return this.cookies;
    }
}