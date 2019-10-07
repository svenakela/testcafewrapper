import { RequestHook } from 'testcafe';

export default class SimpleRequestHook extends RequestHook {

    constructor () {
        super(/.*/, { includeHeaders: true, includeBody: true });
    }
    
    async onRequest (event) {
        event.requestOptions.headers['referer'] = event.requestOptions.url;
    }

    async onResponse (event) {

    }
}