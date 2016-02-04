function p2pHost(roomInfo){

window.RTCPeerConnection = (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);
window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navitor.msGetUserMedia);

var id = roomInfo.id;
var ws = new WebSocket("ws:"+window.location.host+"/youtuber"+id);

ws.onopen = requireUserMedia;
ws.onmessage = onMessage;


var pcs = {};
var localMediaStream;

function error(e){
	console.log(e);
}

function requireUserMedia(){
	navigator.getUserMedia({
		video:true,audio:true
		},gotUserMedia,error);
}

function gotUserMedia(stream){
	localMediaStream = stream;
	document.getElementById("localVideo").src = window.URL.createObjectURL(stream);
	
	var ws_info = new WebSocket("ws:"+window.location.host+"/roominfo"+id);
	ws_info.onopen = function(){
	ws_info.send(JSON.stringify(roomInfo));
	}
}

function createPeerConnection(){
	var pc = new RTCPeerConnection({iceServers:[{url:"stun:stun.1.google.com:19302"}]});
	pc.addStream(localMediaStream);
	return pc;
}

function onMessage(message){
	message = JSON.parse(message.data);
	if(!message.to === id)return console.log("not to == id");
	if(message.from){
		if(message.type ==="offer"){
			onOffer(message);
		}
		else if(message.candidate){
			onCandidate(message);
		}
	}
}

function onOffer(message){
	var pc = createPeerConnection();
	pc.setRemoteDescription(new RTCSessionDescription(message));
	pcs[message.from] = pc;

	pc.onicecandidate = function(e){
		if(e.candidate){
			sendMessage(e.candidate,message.from);
		}else{
			console.log(e);
		}
	}

	pc.createAnswer(function(answer){
		pc.setLocalDescription(answer);
		sendMessage(answer,message.from);
	},error,{offerToReceiveAudio:false,offerToReceiveVideo:false});
}

function sendMessage(message,to){
	message = JSON.stringify(message);
	ws.send(message.slice(0,1)+"\"to\":\""+to+"\",\"from\":\""+id+"\","+message.slice(1));
}

function onCandidate(message){
	var pc = pcs[message.from];
	pc.addIceCandidate(new RTCIceCandidate(message));
}

}

module.exports = p2pHost;
