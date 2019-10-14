export async function waitForAny(caseMap, timeoutInSeconds) {
    for (let i = 0; i < timeoutInSeconds * 10; i++) {
        if (await handleCases(caseMap)) {
            break;
        }
        
        await timeout(100);
    }
}

async function handleCases(caseMap) {
    for(let i = 0; i < caseMap.length; i++) {
        if (await caseMap[i].when.exists) {
            await caseMap[i].then.call();
            return true;
        }
    }
}

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}