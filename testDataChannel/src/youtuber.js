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

//members
var isStreamEnable = false;
var pcs = {};
var localMediaStream;
var dataChannels = {};

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
	isStreamEnable = true;
}

function createPeerConnection(){
	var pc = new RTCPeerConnection(peerConnectionConfig);
	pc.addStream(localMediaStream);
	pc.ondatachannel = function(e){
		console.log("ondatachannel:"+e);
		var channel = e.channel;
		channel.onmessage = function(e){
			console.log(e.data);
			channel.send("world!");
			};
		channel.onerror = error;
		console.log(channel);
	};
	return pc;
}

	

//when message received
function onMessage(message){
	console.log("onMessage");
	message = JSON.parse(message.data);
	if(message.id){
		if(message.type ==="offer"){
			onOffer(message);
			console.log(message.id);
		}
		else if(message.candidate){
			onCandidate(message);
		}
	}
}

function onOffer(message){
	console.log("offer");
	var pc = createPeerConnection();
	pc.setRemoteDescription(new RTCSessionDescription(message));
	pcs[message.id] = pc;

	pc.onicecandidate = function(e){
		console.log("onIceCandidate");
		if(e.candidate){
			sendMessage(e.candidate,message.id);
		}
		else{
			console.log(e);
		}
	}

	pc.createAnswer(function(answer){
		console.log("gotAnswer");
		pc.setLocalDescription(answer);
		sendMessage(answer,message.id);
		},
		error,mediaConstraints);
}

function sendMessage(message,id){
	message = JSON.stringify(message);
	ws.send(message.slice(0,1)+"\"id\":\""+id+"\","+message.slice(1))
}

function onCandidate(message){
	var pc = pcs[message.id];
	pc.addIceCandidate(new RTCIceCandidate(message));
}
