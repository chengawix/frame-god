var frameRegistry = {};
const allowedOirigns = [];

const resolvedPromise = new Promise((resolve, reject) => resolve())

const postMessage = function (frameName, message, overrideReadyCheck) {
    console.log(frameName);
    let _promise = overrideReadyCheck ?
        resolvedPromise :
        frameRegistry[frameName].promise;
    _promise.then(() => {
        if (self.$w) {
            $w(frameName).postMessage(message);
        }
        else {
            document.querySelector(frameName).contentWindow.postMessage(message, "*");
        }
    })
}

if (!self.$w) {
    window.addEventListener("message", (event) => {
        var { type, frameName } = event.data;
        if (type === "setupResponse") {
            document.querySelector(frameName).dispatchEvent(new Event("ready"));
        }
    })
}


const maxAttemtps = 100;
function setupFrame(frameName) {
    if (frameRegistry[frameName].setupAttempts >= maxAttemtps) {
        console.error(`unable to complete setup on ${frameName}`)
        return
    }
    if (!frameRegistry[frameName].ready) {
        postMessage(frameName, {
            type: "setup",
            yourName: frameName
        }, true);
        setTimeout(() => {
            setupFrame(frameName);
        }, 400);
    }
}

export function registerFrame(frameName) {
    if (frameRegistry[frameName]) return;
    console.log(`${frameName} waiting ready message`);
    frameRegistry[frameName] = {
        setupAttempts: 0,
        ready: false,
        promise: self.$w ? new Promise((resolve, reject) => {
            $w(frameName).onMessage((event) => {
                let { type, frameName } = event.data;
                if (type === "setupResponse") {
                    console.log(`${frameName} ready`)
                    frameRegistry[frameName].ready = true;
                    resolve(Date.now());
                }
            })
        }) :
            new Promise((resolve, reject) => {
                console.log(`${frameName} ready`);
                document.querySelector(frameName).addEventListener("ready", ()=>{
                    frameRegistry[frameName].ready = true;
                    resolve(Date.now());
                });
            })
    }
    setupFrame(frameName);
}

export function postToReadyFrame(frameName, message) { 
    postMessage(frameName, {type : "msg", msg: message })
};

export function onMessage(handler){
    window.addEventListener("message", (event)=>{
        if (event.data.type === "msg") {
            handler(event.data.msg, event)
        }
    })
} 

export function newId() {
    const st = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array(Number(10)).join().split(',').map(function () { return st.charAt(Math.floor(Math.random() * st.length)); }).join('');
}


export function onFrameReady(callback) {
    window.addEventListener("message", (event) => {
        var { type, yourName } = event.data;
        if (type === "setup") {
            event.source.postMessage({
                type: "setupResponse",
                frameName: yourName
            },event.origin);
            callback()
        }
    })
}