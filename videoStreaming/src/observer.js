//compatible to each blowser
window.RTCPeerConnection = (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);

window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);

window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);

//websocket
var ws = new WebSocket("ws:"+window.location.host+"/observer");
ws.onmessage = onMessage;
ws.onopen = createPeerConnection;

//parameters
var peerConnectionConfig = {"iceServers": [{"url":"stun:stun.l.google.com:19302"}]};

var mediaConstraints ={'mandatory':{'OfferToReceiveAudio':true,'OfferToReceiveVideo':true}};

//variables
var pc;

function error(err){console.log(err)};

function createPeerConnection(){
	
	pc = new RTCPeerConnection(peerConnectionConfig);
	pc.oniceCandidate = onIceCandidate;
	pc.onaddstream = onRemoteStreamAdded;

	pc.createOffer(gotOffer,error,mediaConstraints);
}

function onIceCandidate(e){
	if(e.candidate){
		console.log("candidate"+e.candidate);
		ws.send(JSON.stringify(e.candidate));
	}else{
		console.log(e);
	}
}

function onRemoteStreamAdded(e){
	console.log("remoteStream was added");
	document.getElementById("remoteVideo").src = window.URL.createObjectURL(e.stream);
	document.getElementById("remoteAudio").src = window.URL.createObjectURL(e.stream);
}

function gotOffer(offer){
	console.log("gotOffer");
	pc.setLocalDescription(offer);
	ws.send(JSON.stringify(offer));
}


//when messsage received
function onMessage(message){
	console.log("onMessage");
	message = JSON.parse(message.data);

	if(message.type === "answer"){
		onAnswer(message);
	}
	else if(message.candidate){
		onCandidate(message);
	}
}

function onAnswer(answer){
	console.log("onAnswer");
	pc.setRemoteDescription(new RTCSessionDescription(answer));
	console.log("SDP finished");
}

function onCandidate(message){
	console.log("onCandidate");
	pc.addIceCandidate(new RTCIceCandidate(message));
}
