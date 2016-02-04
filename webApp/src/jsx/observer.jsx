const React = require('react');
const ReactDOM = require('react-dom');
const p2pClient = require('./p2pclient.js');


const Observer = React.createClass({

	render:function(){
		return(
			<div>
				<video id="remoteVideo" autoPlay={true}></video>
			</div>
		);
	},

	componentDidMount:function(){
		p2pClient(this.props.roomInfo);
	},



});

module.exports = Observer;
