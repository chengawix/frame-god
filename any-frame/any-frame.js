var frameRegistry = {};
const allowedOirigns = [];
const maxAttemtps = 100;
import wixData from "wix-data";

var runTimeDataStore = {};

const wixDataApi = {
  wixDataGet: function([collection, id]) {
    return wixData.get(collection, id);
  },
  getItem:function([key]) {
    return new Promise((resolve, reject)=>{
      resolve(runTimeDataStore[key])
    })
  },
  setItem: function([key,value]) {
    runTimeDataStore[key] = value;
    return new Promise((resolve, reject)=>{
      resolve(runTimeDataStore[key])
    })
  }
};

const noSuchApiPromise = function() {
  return new Promise((resolve, reject) => {
    reject("this api does not exist");
  });
};

function processWixApiCall(eventData) {
  // console.log("new wix api request");
  let { data, requestId } = eventData;
  let apiPromise = wixDataApi[data.api]
    ? wixDataApi[data.api](data.args)
    : noSuchApiPromise();
  apiPromise
    .then(results => {
      // console.log("done: exec once");
      postMessage({
        type: "wix-api",
        requestId: requestId,
        data: results
      });
    })
    .catch(error => {
      // console.log("error: exec once!", error);
      postMessage({
        type: "wix-api",
        requestId: requestId,
        data: { request: data, error: error.message },
        isError: true
      });
    });
}

var handlers = { "wix-api": processWixApiCall };

const resolvedPromise = new Promise((resolve, reject) => resolve());

const postMessage = function( message, overrideReadyCheck) {
  let _promise = overrideReadyCheck
    ? resolvedPromise
    : frameRegistry["#childFrame"].promise;
  _promise.then(() => {
    $w("#childFrame").postMessage(message);
  });
};

function setupFrame() {
  if (frameRegistry["#childFrame"].setupAttempts >= maxAttemtps) {
    console.error(`unable to complete setup on #childFrame`);
    return;
  }
  if (!frameRegistry["#childFrame"].ready) {
    postMessage(
      {
        type: "setup",
        yourName: "#childFrame"
      },
      true
    );
    setTimeout(() => {
      setupFrame();
    }, 400);
  }
}


let isWixApiBinded = false
const bindApi = function (){
  if (isWixApiBinded) {
    // console.log("I only bind wixApi once");
    return
  }
  isWixApiBinded = true;
  $w("#childFrame").onMessage(event => {
    let eventData = event.data;
    try {
      eventData = JSON.parse(eventData);
    } catch (error) {}
    let { type } = eventData;
    let handler = handlers[type] || function() {};
    handler(eventData);
  });
}

export function registerFrame() {
  if (frameRegistry["#childFrame"]) return;
  // console.log(`#Frame waiting ready message`);
  frameRegistry["#childFrame"] = {
    setupAttempts: 0,
    ready: false,
    promise: new Promise((resolve, reject) => {
      handlers["setupResponse"] = () => {
        frameRegistry["#childFrame"].ready = true;
        resolve(Date.now());
      };
      $w("#childFrame").onMessage(event => {
        let { type } = event.data;
        if (type === "setupResponse") {
          // console.log(`${"#childFrame"} ready`);
          frameRegistry["#childFrame"].ready = true;
          bindApi();
          resolve(Date.now());
        }
      });
    })
  };
  setupFrame("#childFrame");
}

/*
 *	##################################
 */

$w.onReady(function() {
  const { appName, devServerPort, gitHubHomePage } = $widget.props;
  registerFrame("#childFrame");
  if (origin.endsWith(".dev.wix-code.com")) {
    postMessage( {
      type: "install",
      data: "Plase wahit a moment"
    });
    const socket = new WebSocket(`ws://localhost:${devServerPort}`);
    socket.onmessage = event => {
      let { data } = event;
      try {
        let { type, html } = JSON.parse(data);
        switch (type) {
          case "new-view":
            postMessage( { type: "install", data: html });
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error);
        console.log(data);
      }
    };
    $w("#publish").show();
    $w("#publish").onClick(() => {
      socket.send(
        JSON.stringify({
          type: "publish",
          homepage: gitHubHomePage,
          frameName: appName
        })
      );
    });
  } else {
    $w("#childFrame").src = `${gitHubHomePage}/${appName}/`;
  }
});

$widget.onPropsChanged((oldProps, newProps) => {
  // If your widget has properties, onPropsChanged is where you should handle changes to their values.
  // Property values can change at runtime by code written on the site, or when you preview your widget here in the App Builder.
});


/**
*@function
*@description Get a value that was set by your guest app using wix-api/storage/setItem(key,value)
*@param {string} key - key
*@returns {Any} value by key
*/
export function getItem(key){
  return runTimeDataStore[key]
	//This function is part of my public API
}

/**
*@function
*@description Set a value, and then access it from your guest app using wix-api/storage/getItem(key)
*@param {string} key
*@param {Any} newValue
*@returns {Any} new value
*/
export function setItem(key, newValue){
  runTimeDataStore[key] = newValue;
  postMessage({
    "type": "wix-api",
    "api": "setItem",
    data: {key:key,value:newValue}
  });
  return runTimeDataStore[key]
}