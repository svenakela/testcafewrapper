import { RequestHook } from 'testcafe';

export default class SimpleRequestHook extends RequestHook {

    cookies = [];
    domain = '';

    constructor () {
        super(/.*/, { includeHeaders: true, includeBody: true });
    }
    
    async onRequest (event) {
        delete event.requestOptions.headers['referer'];
    }

    async onResponse (event) {

    }
}