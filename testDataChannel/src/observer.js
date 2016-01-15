//compatible to each blowser
window.RTCPeerConnection = (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);

window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);

window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);

var id = Math.random().toString(32).slice(-8);
//websocket
var ws = new WebSocket("ws:"+window.location.host+"/observer"+id);
ws.onmessage = onMessage;
ws.onopen = createPeerConnection;

//parameters
var peerConnectionConfig = {"iceServers": [{"url":"stun:stun.l.google.com:19302"}]};

var mediaConstraints = {
	offerToReceiveAudio:true,
	offerToReceiveVideo:true
};

//variables
var pc;
var dataChannel;

function error(err){console.log(err)};

function createPeerConnection(){
	
	pc = new RTCPeerConnection(peerConnectionConfig);
	pc.oniceCandidate = onIceCandidate;
	pc.onaddstream = onRemoteStreamAdded;
	
	dataChannel = pc.createDataChannel('MyChannel');
	dataChannel.onmessage = function(e){
		console.log("Got message:",e.data);
	};
	dataChannel.onerror = error;
	dataChannel.onopen = function(e){
		console.log("datachannel is open!:"+e);
		dataChannel.send("hello");
		};

	pc.createOffer(gotOffer,error,mediaConstraints);

}

function onIceCandidate(e){
	if(e.candidate){
		console.log("candidate"+e.candidate);
		sendMessage(JSON.stringify(e.candidate));
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
	console.log(offer);
	pc.setLocalDescription(offer);
	sendMessage((offer));
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

function sendMessage(message){
	message = JSON.stringify(message)
	ws.send(message.slice(0,1)+"\"id\":\""+id+"\","+message.slice(1))
}

