//compatible to each blowser
window.RTCPeerConnection = (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);

window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);

window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navitor.msGetUserMedia);

var localMediaStream;
var mediaConstraints ={"mandatory":{"OfferToReceiveAudio":true,"OfferToReceiveVideo":true}};

function error(err){
	console.log(err);
}

function requireUserMedia(){
	navigator.getUserMedia({
		video:true,audio:false
	},gotUserMedia,error);
}

function gotUserMedia(stream){
	localMediaStream = stream
	document.getElementById("localVideo").src = window.URL.createObjectURL(stream);
	document.getElementById("localAudio").src = window.URL.createObjectURL(stream);
	createPeerConnection();
}

var pc1;
var pc2;

function createPeerConnection(){
	pc1 = new RTCPeerConnection();
	pc1.onicecandidate = onIceCandidate1;

	pc2 = new RTCPeerConnection();
	pc2.onicecandidate = onIceCandidate2;
	pc2.onaddstream = onRemoteStreamAdded;

	pc1.addStream(localMediaStream);
	console.log("check");
	pc1.createOffer(gotOffer,error,mediaConstraints);
}

function onIceCandidate1(e){
	console.log("candidate1:"+e);
	if(e.candidate){
		
		console.log(JSON.stringify(e.candidate));
		pc2.addIceCandidate(new RTCIceCandidate(e.candidate));
	}
}

function onIceCandidate2(e){
	console.log("candidate2:"+e);
	if(e.candidate){

		console.log(JSON.stringify(e.candidate));
		pc1.addIceCandidate(new RTCIceCandidate(e.candidate));
	}
}

function onRemoteStreamAdded(e){
	console.log("remoteStreamadded");
	document.getElementById("remoteAudio").src = window.URL.createObjectURL(e.stream);
	document.getElementById("remoteVideo").src = window.URL.createObjectURL(e.stream);
}

function gotOffer(offer){
	console.log("gotOffer"+offer);
	console.log(JSON.stringify(offer));
	pc1.setLocalDescription(offer);
	pc2.setRemoteDescription(offer);
	pc2.createAnswer(gotAnswer,error,mediaConstraints);
}

function gotAnswer(answer){
	console.log("gotAnswer:"+answer);
	console.log(JSON.stringify(answer));
	pc2.setLocalDescription(answer);
	pc1.setRemoteDescription(answer);
}

requireUserMedia();



