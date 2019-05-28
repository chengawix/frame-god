const uuidv4 = require('uuid/v4');

let queue = {};

function request(data){
    let requestId = uuidv4();
    return new Promise((resolve, reject)=>{
        queue[requestId] = [resolve, reject];
        let message = {
            src: "descendant",
            type: "wix-api",
            requestId: requestId,
            data: data
        };
        window.parent.postMessage(message, "*");
    });
}

window.addEventListener("message", (event)=>{
    let {data, origin} = event;
    let {type, requestId, data:responseBody, isError} = data;
    if (type === "wix-api") {
        if (queue[requestId]) {
            let handler = queue[requestId];
            if (isError) handler[1](responseBody.error);
            else handler[0](responseBody);
        }
        
        
        delete queue[requestId];
    }
})

module.exports = {
    wixData: {
        get: (collection, id) =>{
            return request({
                api: "wixDataGet",
                args: [collection, id]
            })
        }
        // ,query(collection, )
    }
}