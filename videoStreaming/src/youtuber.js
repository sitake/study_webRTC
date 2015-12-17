//compatible to each blowser
window.RTCPeerConnection = (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);

window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);

window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navitor.msGetUserMedia);

//websocket
var ws = new WebSocket("ws:"+window.location.host+"/youtuber");
ws.onmessage=onMessage;
ws.onopen = requireUserMedia;

//parameters
var peerConnectionConfig = {"iceServers": [{"url":"stun:stun.l.google.com:19302"}]};


var mediaConstraints ={'mandatory':{'OfferToReceiveAudio':false,'OfferToReceiveVideo':false}};

var pc;
var localMediaStream;

function error(err){
	console.log(err);
}

function requireUserMedia(){
	navigator.getUserMedia({
		video:true,audio:true
	},gotUserMedia,error);
}

function gotUserMedia(stream){
	localMediaStream = stream;
	document.getElementById("localVideo").src = window.URL.createObjectURL(stream);
	document.getElementById("localVideo").src = window.URL.createObjectURL(stream);
	createPeerConnection();
}

function createPeerConnection(){
	pc = new RTCPeerConnection(peerConnectionConfig);
	pc.onicecandidate = onIceCandidate;
	pc.addStream(localMediaStream);
}

function onIceCandidate(e){
	console.log("onIceCandidate");
	if(e.candidate){
	ws.send(JSON.stringify(e.candidate));
	}
	else{
		console.log(e);
	}
}
//when message received
function onMessage(message){
	console.log("onMessage");
	message = JSON.parse(message.data);
	if(message.type ==="offer"){
		onOffer(message);
	}
	else if(message.candidate){
		onCandidate(message);
	}
}

function onOffer(message){
	console.log("offer");
	pc.setRemoteDescription(new RTCSessionDescription(message));
	pc.createAnswer(gotAnswer,error,mediaConstraints);
}

function gotAnswer(answer){
	console.log("gotAnswer");
	pc.setLocalDescription(answer);
	ws.send(JSON.stringify(answer));
}

