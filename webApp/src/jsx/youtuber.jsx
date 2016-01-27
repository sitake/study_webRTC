const React = require('react');
const ReactDOM = require('react-dom');
const p2pHost = require('./p2phost.js');


const Youtuber = React.createClass({


	render:function(){
		return(
			<div>
				<video id="localVideo" autoPlay={true}></video>
				<audio id="localAudio" autoPlay={true}></audio>
			</div>
		);
	},

	componentDidMount:function(){
		console.log(this.props.roomInfo);
		p2pHost(this.props.roomInfo);
	},



});

module.exports = Youtuber;
