const uuidv4 = require('uuid/v4');

let queue = {};
let onValueHandlers = {};

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
    let {type,api, requestId, data:responseBody, isError} = data;
    if (type === "wix-api") {
        if (queue[requestId]) {
            let handler = queue[requestId];
            if (isError) handler[1](responseBody.error);
            else handler[0](responseBody);
            delete queue[requestId];
        }
        if (api==="setItem"){
            let {key,value} = responseBody;
            (onValueHandlers[key] || []).forEach(handler=>handler(value,key))
        }
    }
})

module.exports = {
    storage:{
        getItem:(key)=>{
            return request({
                api: "getItem",
                args: [key]
            })
        },
        setItem:(key,value)=>{
            return request({
                api: "setItem",
                args: [key,value]
            })
        },
        onValue:(key, handler) => {
            if (key && handler) {
                onValueHandlers[key] = onValueHandlers[key] || [];
                if (onValueHandlers[key].indexOf(handler)<0) onValueHandlers[key].push(handler)
            }
        }
    },
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