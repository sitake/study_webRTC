function p2pClient(roomInfo){

window.RTCPeerConnection = (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);
window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navitor.msGetUserMedia);
var id = Math.random().toString().slice(-8);
var to = roomInfo.id;
var ws = new WebSocket("ws:"+window.location.host+"/observer"+id);
ws.onopen = createPeerConnection;
ws.onmessage = onMessage;

var pc;

function error(e){
	console.log(e);
}

function createPeerConnection(){
	pc = new RTCPeerConnection({iceServers:[{url:"stun:stun.1.google.com:19302"}]});
	pc.onicecandidate = onIceCandidate;
	pc.onaddstream = onRemoteStreamAdded;

	pc.createOffer(gotOffer,error,{offerToReceiveAudio:true,offerToReceiveVideo:true});
}

function onIceCandidate(e){
	if(e.candidate){
		sendMessage(e.candidate);
	}
}

function onRemoteStreamAdded(e){
	document.getElementById("remoteVideo").src = window.URL.createObjectURL(e.stream);
	document.getElementById("remoteAudio").src = window.URL.createObjectURL(e.stream);
}

function onMessage(message){
	message = JSON.parse(message.data);
	if(!message.from === to)return;
	if(message.from){
		if(message.type ==="answer"){
			onAnswer(message);
		}
		else if(message.candidate){
			onCandidate(message);
		}
	}
}

function gotOffer(offer){
	pc.setLocalDescription(offer);
	sendMessage(offer);
}

function onAnswer(message){
	pc.setRemoteDescription(new RTCSessionDescription(message));
}

function onCandidate(message){
	pc.addIceCandidate(new RTCIceCandidate(message));
}

function sendMessage(message){
	message = JSON.stringify(message);	
	ws.send(message.slice(0,1)+"\"to\":\""+to+"\",\"from\":\""+id+"\","+message.slice(1));
}


}

module.exports = p2pClient;
