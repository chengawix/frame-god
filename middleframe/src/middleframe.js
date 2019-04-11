const {onMessage,onFrameReady} = require("../common/util");
import './middleframe.scss';

//setup channel
function reloadOffspringFrame(srcdoc){
    document.querySelector('iframe').srcdoc = srcdoc;
}

onFrameReady(()=>{
    onMessage((data,event)=>reloadOffspringFrame(data))
})


//postmesssge bridge channel