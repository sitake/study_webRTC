const React = require('react');
const ReactDOM = require('react-dom');
const p2pHost = require('./p2phost.js');


const Youtuber = React.createClass({


	render:function(){
		return(
			<div>
				<video id="localVideo" autoPlay={true} muted={true}></video>
			</div>
		);
	},

	componentDidMount:function(){
		p2pHost(this.props.roomInfo);
	},



});

module.exports = Youtuber;
