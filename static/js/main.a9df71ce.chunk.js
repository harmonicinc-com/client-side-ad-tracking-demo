(this["webpackJsonpclient-side-ad-tracking-demo"]=this["webpackJsonpclient-side-ad-tracking-demo"]||[]).push([[0],{132:function(e,t,n){},133:function(e,t,n){},163:function(e,t,n){"use strict";n.r(t);var a=n(4),r=n(0),i=n.n(r),c=n(11),s=n.n(c),o=n(213),u=(n(132),n(133),n(198)),d=n(210),l=n(211),f=n(207),j=n(216),h=n(212),m=n(35),p=n(21),b=n(18),v=n(200),O=n(202),x=n(203),g=n(204),y=n(205),T=n(108),k=n.n(T),P=n(107),w=n.n(P),E=n(111),U=n.n(E),S=n(112),R=n.n(S),I=n(110),L=n.n(I),C=n(109),D=n.n(C),M=n(84),N=n.n(M),A=n(85),F=n.n(A),B=i.a.createContext(),q=Object(u.a)((function(e){return{itemText:{fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},podItem:{},podItemOnAir:{backgroundColor:"#42a5f5","&:hover":{background:"#2196f3"}},adItem:{paddingLeft:e.spacing(4)},adItemOnAir:{paddingLeft:e.spacing(4),backgroundColor:"#90caf9","&:hover":{background:"#64b5f6"}},trackingUrlItem:{paddingLeft:e.spacing(8),paddingTop:e.spacing(0),paddingBottom:e.spacing(1)},greenIcon:{color:"green"},redIcon:{color:"red"}}}));var G=function(){var e=q(),t=Object(r.useContext)(B),n=Object(r.useState)({}),i=Object(b.a)(n,2),c=i[0],s=i[1],o=Object(r.useState)({}),u=Object(b.a)(o,2),d=u[0],l=u[1],f=t.adPods?t.adPods:[],j=t.lastPlayheadTime,h=function(e){return e.id in c?c[e.id]:null!==j&&j<e.startTime+e.duration+2e3},T=function(e,t){return t.id+"/"+e.id in d?d[t.id+"/"+e.id]:null!==j&&j<e.startTime+e.duration+2e3};return Object(a.jsx)("div",{className:"ad-pod-list",children:f?Object(a.jsx)(v.a,{children:f.map((function(t){return Object(a.jsxs)("div",{children:[Object(a.jsxs)(O.a,{button:!0,onClick:function(){return function(e){var t=Object(p.a)(Object(p.a)({},c),{},Object(m.a)({},e.id,!h(e)));Object.keys(c).filter((function(e){return!f.find((function(t){return t.id===e}))})).forEach((function(e){return delete t[e]})),s(t)}(t)},className:t.startTime<j&&j<t.startTime+t.duration?e.podItemOnAir:e.podItem,children:[Object(a.jsx)(x.a,{children:Object(a.jsx)(w.a,{})}),Object(a.jsxs)(g.a,{disableTypography:!0,className:e.itemText,children:[Object(a.jsxs)("div",{children:["Ad Pod: ",t.id]}),Object(a.jsxs)("div",{children:["Time: ",new Date(t.startTime).toLocaleString(),", Duration: ",(t.duration/1e3).toFixed(1),"s"]})]}),h(t)?Object(a.jsx)(N.a,{}):Object(a.jsx)(F.a,{})]}),Object(a.jsx)(y.a,{in:h(t),timeout:"auto",unmountOnExit:!0,children:Object(a.jsx)(v.a,{children:t.ads.map((function(n){return Object(a.jsxs)("div",{children:[Object(a.jsxs)(O.a,{button:!0,onClick:function(){return function(e,t){var n=Object(p.a)(Object(p.a)({},d),{},Object(m.a)({},t.id+"/"+e.id,!T(e,t)));Object.keys(d).filter((function(e){return!f.find((function(t){return e.startsWith(t.id+"/")}))})).forEach((function(e){return delete n[e]})),l(n)}(n,t)},className:n.startTime<j&&j<n.startTime+n.duration?e.adItemOnAir:e.adItem,children:[Object(a.jsx)(x.a,{children:Object(a.jsx)(k.a,{})}),Object(a.jsxs)(g.a,{disableTypography:!0,className:e.itemText,children:[Object(a.jsxs)("div",{children:["Ad: ",n.id]}),Object(a.jsxs)("div",{children:["Time: ",new Date(n.startTime).toLocaleString(),", Duration: ",(n.duration/1e3).toFixed(1),"s"]})]}),T(n,t)?Object(a.jsx)(N.a,{}):Object(a.jsx)(F.a,{})]}),Object(a.jsx)(y.a,{in:T(n,t),timeout:"auto",unmountOnExit:!0,children:Object(a.jsx)(v.a,{children:n.trackingUrls?n.trackingUrls.map((function(t,n){return Object(a.jsxs)(O.a,{className:e.trackingUrlItem,children:[Object(a.jsxs)(x.a,{children:["IDLE"===t.reportingState?Object(a.jsx)(D.a,{}):null,"REPORTING"===t.reportingState?Object(a.jsx)(L.a,{}):null,"DONE"===t.reportingState?Object(a.jsx)(U.a,{className:e.greenIcon}):null,"ERROR"===t.reportingState?Object(a.jsx)(R.a,{className:e.redIcon}):null]}),Object(a.jsxs)(g.a,{disableTypography:!0,className:e.itemText,children:[Object(a.jsxs)("div",{children:["Event: ",t.event]}),Object(a.jsxs)("div",{children:["URL: ",t.url]}),t.startTime?Object(a.jsxs)("div",{children:["Time: ",new Date(t.startTime).toLocaleString()]}):null]})]},n)})):null})},n.id+".trackingUrls")]},n.id)}))})},t.id+".ads")]},t.id)}))}):null})},W=i.a.createContext({errors:{},reportError:function(e,t){},acknowledgeError:function(e){}});function z(e){var t=Object(r.useState)({}),n=Object(b.a)(t,2),i=n[0],c=n[1];return Object(a.jsx)(W.Provider,{value:{errors:i,reportError:function(e,t){c(Object(p.a)(Object(p.a)({},i),{},Object(m.a)({},e,{message:t,acknowledged:!1})))},acknowledgeError:function(e){var t=i[e];t&&c(Object(p.a)(Object(p.a)({},i),{},Object(m.a)({},e,Object(p.a)(Object(p.a)({},t),{},{acknowledged:!0}))))}},children:e.children})}var J=n(54),$=n(23),_=n.n($),H=n(40),V=n(12);var K=function(e,t){var n=Object(r.useRef)();Object(r.useEffect)((function(){n.current=e}),[e]),Object(r.useEffect)((function(){if(null!==t){var e=setInterval((function(){n.current()}),t);return function(){return clearInterval(e)}}}),[t])},Q=i.a.createContext(),X=n(70),Y=n(71),Z=500,ee=function(e,t){for(var n=!1,a=function(a){var r=e[a].id;t.find((function(e){return e.id===r}))||(e.splice(a,1),n=!0)},r=e.length-1;r>=0;r--)a(r);return t.forEach((function(t){var a=e.find((function(e){return e.id===t.id}));a?a.duration!==t.duration&&(a.duration=t.duration,n=!0):(a={id:t.id,startTime:t.startTime,duration:t.duration,trackingUrls:t.trackingUrls.map((function(e){return{event:e.event,startTime:e.startTime,url:e.url,reportingState:"IDLE"}}))},e.push(a),n=!0)})),n},te=function(){function e(){Object(X.a)(this,e),this.adPods=[],this.lastPlayheadTime=null,this.lastPlayheadUpdateTime=null,this.listeners=[]}return Object(Y.a)(e,[{key:"addUpdateListener",value:function(e){this.listeners.push(e)}},{key:"removeUpdateListener",value:function(e){var t=this.listeners.indexOf(e);-1!==t&&this.listeners.splice(t,1)}},{key:"updatePods",value:function(e){(function(e,t){for(var n=!1,a=function(a){var r=e[a].id;t.find((function(e){return e.id===r}))||(e.splice(a,1),n=!0)},r=e.length-1;r>=0;r--)a(r);return t.forEach((function(t){var a=e.find((function(e){return e.id===t.id}));a?a.duration!==t.duration&&(a.duration=t.duration,n=!0):(a={id:t.id,startTime:t.startTime,duration:t.duration,ads:[]},e.push(a),n=!0),n=ee(a.ads,t.ads)||n})),n})(this.adPods,e)&&this.notifyListeners()}},{key:"updatePlayheadTime",value:function(e){var t=this,n=(new Date).getTime();if(this.lastPlayheadUpdateTime){if(n===this.lastPlayheadUpdateTime)return;var a=(e-this.lastPlayheadTime)/(n-this.lastPlayheadUpdateTime);a>0&&a<=2&&this.iterateTrackingEvents((function(n){n.startTime&&"IDLE"===n.reportingState&&t.lastPlayheadTime<n.startTime&&n.startTime<=e&&t.sendBeacon(n)}),this.lastPlayheadTime,e)}this.lastPlayheadTime=e,this.lastPlayheadUpdateTime=n}},{key:"getAdPods",value:function(){return this.adPods}},{key:"pause",value:function(){var e=this;this.iterateTrackingEvents((function(t){"pause"===t.event&&e.sendBeacon(t)}))}},{key:"resume",value:function(){var e=this;this.iterateTrackingEvents((function(t){"resume"===t.event&&e.sendBeacon(t)}))}},{key:"mute",value:function(){var e=this;this.iterateTrackingEvents((function(t){"mute"===t.event&&e.sendBeacon(t)}))}},{key:"unmute",value:function(){var e=this;this.iterateTrackingEvents((function(t){"unmute"===t.event&&e.sendBeacon(t)}))}},{key:"notifyListeners",value:function(){this.listeners.forEach((function(e){e()}))}},{key:"iterateTrackingEvents",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.lastPlayheadTime,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.lastPlayheadTime;this.adPods.forEach((function(a){a.startTime<=n&&t<=a.startTime+a.duration+Z&&a.ads.forEach((function(r){r.startTime<=n&&t<=r.startTime+r.duration+Z&&r.trackingUrls.forEach((function(t){e(t,r,a)}))}))}))}},{key:"sendBeacon",value:function(){var e=Object(H.a)(_.a.mark((function e(t){var n;return _.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.reportingState="REPORTING",this.notifyListeners(),e.prev=2,e.next=5,fetch(t.url);case 5:(n=e.sent).status>=200&&n.status<=299?t.reportingState="DONE":t.reportingState="ERROR",this.notifyListeners(),e.next=14;break;case 10:e.prev=10,e.t0=e.catch(2),t.reportingState="ERROR",this.notifyListeners();case 14:case"end":return e.stop()}}),e,this,[[2,10]])})));return function(t){return e.apply(this,arguments)}}()}]),e}(),ne=function(e){var t=Object(V.e)(),n=Object(V.f)(),i=new URLSearchParams(n.search).get("url"),c=Object(r.useContext)(W),s=Object(r.useRef)(),o=Object(r.useRef)(),u=Object(r.useState)({localSessionId:null,mediaUrl:i,manifestUrl:null,adTrackingMetadataUrl:null}),d=Object(b.a)(u,2),l=d[0],f=d[1],j=Object(r.useState)(0),h=Object(b.a)(j,2),m=h[0],p=h[1],v=Object(r.useState)([]),O=Object(b.a)(v,2),x=O[0],g=O[1],y=function(e){return e.replace(/\/[^/?]+(\??[^/]*)$/,"/metadata$1")},T=Object(r.useCallback)(function(){var e=Object(H.a)(_.a.mark((function e(t){var n,a;return _.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=18;break}return e.next=3,fetch(t);case 3:if(n=e.sent,e.prev=4,!(n.status<200||n.status>299)){e.next=7;break}throw new Error("Get unexpected response code ".concat(n.status));case 7:return e.next=9,n.json();case 9:a=e.sent,o.current=a.dashAvailabilityStartTime,s.current.updatePods(a.pods||[]),e.next=18;break;case 14:e.prev=14,e.t0=e.catch(4),console.error("Failed to download metadata for ad tracking",e.t0),c.reportError("metadata.request.failed","Failed to download metadata for ad tracking: "+e.t0);case 18:case"end":return e.stop()}}),e,null,[[4,14]])})));return function(t){return e.apply(this,arguments)}}(),[c]),k=Object(r.useCallback)(function(){var e=Object(H.a)(_.a.mark((function e(t){var n,a,r;return _.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(t,{redirect:"follow",cache:"reload"});case 3:if(!((r=e.sent).status<200||r.status>299)){e.next=6;break}throw new Error("Get unexpected response code ".concat(r.status));case 6:r.redirected?(n=r.url,a=y(r.url)):(n=t,a=y(t)),e.next=13;break;case 9:return e.prev=9,e.t0=e.catch(0),c.reportError("manifest.request.failed","Failed to download manifest: "+e.t0),e.abrupt("return");case 13:if(!n.includes("index.m3u8")){e.next=16;break}return e.next=16,fetch(n.replace("index.m3u8","01.m3u8"));case 16:return g([]),s.current=new te,s.current.addUpdateListener((function(){g(Object(J.a)(s.current.getAdPods()))})),f({localSessionId:(new Date).toISOString(),mediaUrl:t,manifestUrl:n,adTrackingMetadataUrl:a}),e.next=22,T(a);case 22:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t){return e.apply(this,arguments)}}(),[T,c]);Object(r.useEffect)((function(){l.mediaUrl&&!l.localSessionId&&k(l.mediaUrl)}),[k,l]),K((function(){T(l.adTrackingMetadataUrl)}),4e3);var P={sessionInfo:l,presentationStartTime:o.current,load:function(e){t.replace("?url="+encodeURIComponent(e)),k(e)},unload:function(){g([]),s.current=new te,s.current.addUpdateListener((function(){g(Object(J.a)(s.current.getAdPods()))})),o.current=null,f({localSessionId:null,mediaUrl:null,manifestUrl:null,adTrackingMetadataUrl:null})}},w={adPods:x,lastPlayheadTime:m,updatePlayheadTime:function(e){var t;null===(t=s.current)||void 0===t||t.updatePlayheadTime(e),p(e)},pause:function(){return s.current.pause()},resume:function(){return s.current.resume()},mute:function(){return s.current.mute()},unmute:function(){return s.current.unmute()}};return Object(a.jsx)(Q.Provider,{value:P,children:Object(a.jsx)(B.Provider,{value:w,children:e.children})})},ae=n(115),re=n(114),ie=(n(140),n(88)),ce=n.n(ie),se=n(113),oe=n.n(se),ue=function(e){Object(ae.a)(n,e);var t=Object(re.a)(n);function n(){var e;return Object(X.a)(this,n),(e=t.call(this)).videoRef=Object(r.createRef)(),e.containerRef=Object(r.createRef)(),e.player=null,e.lastMuted=!1,e.paused=!1,e}return Object(Y.a)(n,[{key:"componentDidMount",value:function(){var e=this;window.muxjs=oe.a;var t=this.videoRef.current,n=this.containerRef.current;this.player=new ce.a.Player(t),this.player.configure("manifest.defaultPresentationDelay",12),this.player.configure("manifest.dash.ignoreSuggestedPresentationDelay",!0),this.lastMuted=t.muted,new ce.a.ui.Overlay(this.player,n,t).configure({controlPanelElements:["play_pause","mute","volume","fullscreen","overflow_menu"]}),t.addEventListener("timeupdate",(function(){var n,a;return null===(n=(a=e.props).onTimeUpdate)||void 0===n?void 0:n.call(a,t.currentTime)})),t.addEventListener("error",(function(t){var n,a;return null===(n=(a=e.props).onError)||void 0===n?void 0:n.call(a,t)})),t.addEventListener("playing",(function(){var t,n;e.paused&&(null===(t=(n=e.props).onResume)||void 0===t||t.call(n),e.paused=!1)})),t.addEventListener("pause",(function(){var t,n;null===(t=(n=e.props).onPaused)||void 0===t||t.call(n),e.paused=!0})),t.addEventListener("volumechange",(function(){var n,a;if(t.muted&&!e.lastMuted)null===(n=(a=e.props).onMute)||void 0===n||n.call(a);else if(!t.muted&&e.lastMuted){var r,i;null===(r=(i=e.props).onUnmute)||void 0===r||r.call(i)}e.lastMuted=t.muted}))}},{key:"load",value:function(e){this.player.load(e),this.paused=!1}},{key:"unload",value:function(){this.player.unload(),this.paused=!1}},{key:"getPlayheadTimeAsDate",value:function(){return this.player.getPlayheadTimeAsDate()}},{key:"render",value:function(){return Object(a.jsx)("div",{ref:this.containerRef,style:{maxWidth:this.props.width},children:Object(a.jsx)("video",{"data-shaka-player":!0,ref:this.videoRef,style:{width:"100%",height:"100%",backgroundColor:"black"},autoPlay:!0})})}}]),n}(r.Component);var de=function(){var e=Object(r.useContext)(Q),t=e.sessionInfo,n=Object(r.useContext)(B),i=Object(r.useRef)(),c=Object(r.useRef)(),s=Object(r.useState)(0),o=Object(b.a)(s,2),u=o[0],d=o[1],l=Object(r.useState)(null),f=Object(b.a)(l,2),j=f[0],h=f[1],m=Math.min.apply(Math,[1/0].concat(Object(J.a)(n.adPods.filter((function(e){return e.startTime>j})).map((function(e){return e.startTime})))))-j;return Object(r.useEffect)((function(){i.current&&c.current!==t.localSessionId&&(t.manifestUrl?i.current.load(t.manifestUrl):i.current.unload(),c.current=t.localSessionId)}),[i,t]),Object(a.jsxs)("div",{children:[Object(a.jsx)(ue,{ref:i,onTimeUpdate:function(a){var r,c;if(d(a),null===(r=t.manifestUrl)||void 0===r?void 0:r.includes(".m3u8")){var s,o=(null===(s=i.current.getPlayheadTimeAsDate())||void 0===s?void 0:s.getTime())||0;n.updatePlayheadTime(o),h(o)}else if(null===(c=t.manifestUrl)||void 0===c?void 0:c.includes(".mpd")){var u=e.presentationStartTime+1e3*a;n.updatePlayheadTime(u),h(u)}},onPaused:function(){console.log("playback paused"),n.pause()},onResume:function(){console.log("playback resumed from pause"),n.resume()},onMute:function(){console.log("player muted"),n.mute()},onUnmute:function(){console.log("player unmute"),n.unmute()},onError:function(e){console.error("Error from player",e)}}),Object(a.jsxs)("div",{children:["Raw currentTime from video element: ",u.toFixed(1),"s"]}),Object(a.jsxs)("div",{children:["Playhead date time: ",j?new Date(j).toLocaleString():"-"]}),Object(a.jsxs)("div",{children:["Time to next ad break: ",m!==1/0?Math.ceil(m/1e3).toFixed(0)+"s":"-"]})]})},le=n(218),fe=n(55),je=n(214),he=n(215),me=n(208),pe=n(209),be=n(217),ve=Object(u.a)((function(e){return{buttons:{"& > *":{marginRight:e.spacing(1)}}}}));var Oe=function(){var e=ve(),t=Object(r.useContext)(W),n=Object(r.useContext)(Q),i=n.sessionInfo,c=Object(r.useRef)(),s=function(e){return e.preventDefault()},o=function(){var e=Object(H.a)(_.a.mark((function e(){return _.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.load(c.current.value);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(a.jsxs)("div",{children:[Object.entries(t.errors).map((function(e){var n=Object(b.a)(e,2),r=n[0],i=n[1];return Object(a.jsx)(le.a,{anchorOrigin:{vertical:"top",horizontal:"right"},open:!i.acknowledged,children:Object(a.jsx)(be.a,{elevation:6,variant:"filled",severity:"error",onClose:function(){return e=r,void t.acknowledgeError(e);var e},children:i.message})})})),Object(a.jsx)(fe.a,{variant:"h5",gutterBottom:!0,children:"Harmonic Client Side Ad Tracking Demo"}),Object(a.jsx)(je.a,{inputRef:c,label:"Media URL",fullWidth:!0,defaultValue:i.mediaUrl||""}),Object(a.jsxs)(he.a,{className:e.buttons,width:1,paddingTop:2,display:"flex",flexDirection:"row",children:[Object(a.jsx)(me.a,{variant:"contained",color:"primary",onClick:o,children:"Load"}),Object(a.jsx)(me.a,{variant:"contained",onClick:function(){n.unload()},children:"Unload"})]}),Object(a.jsx)(he.a,{width:1,paddingTop:2,display:"flex",flexDirection:"row",children:Object(a.jsx)(pe.a,{href:"#",color:"inherit",onClick:s,children:i.manifestUrl?i.manifestUrl:""})}),Object(a.jsx)(he.a,{width:1,paddingTop:1,display:"flex",flexDirection:"row",children:Object(a.jsx)(pe.a,{href:"#",color:"inherit",onClick:s,children:i.adTrackingMetadataUrl?i.adTrackingMetadataUrl:""})})]})},xe=n(83),ge=Object(u.a)((function(e){return{paper:{padding:e.spacing(2),textAlign:"center",color:e.palette.text.secondary}}}));var ye=function(){var e=ge();return Object(a.jsx)(xe.a,{basename:".",children:Object(a.jsx)(V.a,{exact:!0,path:"/",children:Object(a.jsx)(z,{children:Object(a.jsx)(ne,{children:Object(a.jsx)(d.a,{children:Object(a.jsxs)(l.a,{container:!0,spacing:3,children:[Object(a.jsx)(l.a,{item:!0,xs:12,children:Object(a.jsx)(f.a,{square:!0,className:e.paper,children:Object(a.jsx)(Oe,{})})}),Object(a.jsx)(l.a,{item:!0,xs:12,sm:6,children:Object(a.jsx)(f.a,{square:!0,className:e.paper,children:Object(a.jsx)(de,{})})}),Object(a.jsx)(l.a,{item:!0,xs:12,sm:6,children:Object(a.jsxs)(f.a,{square:!0,className:e.paper,children:[Object(a.jsx)(j.a,{value:0,indicatorColor:"primary",textColor:"primary",children:Object(a.jsx)(h.a,{label:"Tracking Events"})}),Object(a.jsx)(G,{})]})})]})})})})})})},Te=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,220)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,i=t.getLCP,c=t.getTTFB;n(e),a(e),r(e),i(e),c(e)}))};s.a.render(Object(a.jsxs)(i.a.StrictMode,{children:[Object(a.jsx)(o.a,{}),Object(a.jsx)(ye,{})]}),document.getElementById("root")),Te()}},[[163,1,2]]]);
//# sourceMappingURL=main.a9df71ce.chunk.js.map