const React = require('react');
const ReactDOM = require('react-dom');

const Rooms = require('./rooms.jsx');

const EnterRoom = React.createClass({

	getInitialState:function(){
		return({roomInfos:new Object()});
	},

	onClickHandler:function(e){
		return function(){
			this.props.onSubmitHandler(e);
			this.props.changeDisplay("observer");
		}
	},

	render:function(){
		
		return(
			<div>
				<Rooms 
					roomInfos={this.state.roomInfos} 
					onSubmitHandler={this.props.onSubmitHandler}
					changeDisplay={this.props.changeDisplay}
				/>
			</div>
		);
	},

	componentDidMount:function(){
		
		var ws = new WebSocket("ws:"+window.location.host+"/getRoomInfo");
		ws.onmessage = function(e){
			this.setState({roomInfos:JSON.parse(e.data)});
		}.bind(this);
	
	}

});

module.exports = EnterRoom;
