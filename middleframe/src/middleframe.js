const { onFrameReady } = require("../../common/util");
import "./middleframe.scss";

//setup channel
function reloadOffspringFrameCode(srcdoc) {
  document.querySelector("iframe").removeAttribute("src");
  document.querySelector("iframe").srcdoc = srcdoc;
}

function reloadOffspringFrameSrc(src) {
  document.querySelector("iframe").removeAttribute("srcdoc");
  document.querySelector("iframe").src = src;
}

// onFrameReady(() => {
  
// });

window.addEventListener("message", event => {
    let { data, origin } = event;
    if (event.source === window.parent) {
      switch (data.type) {
        case "install":
          reloadOffspringFrameCode(data.data);
          break;
        case "wix-api":
            console.log(
                `middleFrame: Got message froms parent sending to frame ${JSON.stringify(
                data
                )}`
          );
          document.querySelector("iframe").contentWindow.postMessage(data, "*");
          break;
        default:
          break;
      }
    } else {
      console.log(
        `middleFrame: Got message from frame, sending to parent ${JSON.stringify(
          data
        )}`)
        window.parent.postMessage(JSON.stringify(data), "*");
        }
    })