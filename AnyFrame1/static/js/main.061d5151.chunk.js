(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,a){e.exports=a(21)},16:function(e,t,a){},17:function(e,t,a){},21:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(2),i=a.n(o),c=(a(16),a(3)),s=a(4),l=a(8),p=a(5),u=a(9),d=a(6),f=a.n(d),m=(a(17),a(7)),g=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(l.a)(this,Object(p.a)(t).call(this))).state={data:"This is React In Wix 111"},e}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement("img",{src:f.a,className:"App-logo",alt:"logo"}),r.a.createElement("p",null,this.state.data),r.a.createElement("button",{onClick:function(){return m.wixData.get("apps","sampleApp").then(function(t){e.setState({data:JSON.stringify(t)}),console.log("res in app ".concat(JSON.stringify(t)))}).catch(function(e){console.log("error in app ".concat(JSON.stringify(e)))})}},"Load Data From WixData"),r.a.createElement("a",{className:"App-link",href:"https://reactjs.org",target:"_blank",rel:"noopener noreferrer"},"Learn React 111")))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(g,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},6:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},7:function(e,t,a){var n=a(18),r={};window.addEventListener("message",function(e){var t=e.data,a=(e.origin,t.type),n=t.requestId,o=t.data,i=t.isError;if("wix-api"===a){if(r[n]){var c=r[n];i?c[1](o.error):c[0](o)}delete r[n]}}),e.exports={wixData:{get:function(e,t){return function(e){var t=n();return new Promise(function(a,n){r[t]=[a,n];var o={src:"descendant",type:"wix-api",requestId:t,data:e};window.parent.postMessage(o,"*")})}({api:"wixDataGet",args:[e,t]})}}}}},[[10,1,2]]]);
//# sourceMappingURL=main.061d5151.chunk.js.map