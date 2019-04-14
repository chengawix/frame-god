const uuidv4 = require('uuid/v4');

let queue = {};

window.addEventListener("message", (event)=>{
    let {data, origin} = event;
    let {type, requestId, responseBody: data, error} = data;
    if (type === "wix-api") {
        queue[requestId] = queue[requestId] || [()=>{},console.error]
        if (error) queue[requestId][1](responseBody);
        else queue[requestId][0](responseBody);
        delete queue[requestId];
    }
})

module.exports = {
    request: (data)=>{
        data.requestId = uuidv4();
        return new Promise((resolve, reject)=>{
            queue[data.requestId] = [resolve, reject];
            window.postMessage(data, "*");
        });
    }
}