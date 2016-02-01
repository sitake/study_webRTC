const React = require('react');
const ReactDOM = require('react-dom');

const Rooms = require('./rooms.jsx');

const Panel = require('react-bootstrap').Panel; 
const Button = require('react-bootstrap').Button;

const EnterRoom = React.createClass({

	getInitialState:function(){
		return({
			roomInfos:new Object(),
			ws:new WebSocket("ws:"+window.location.host+"/getRoomInfo")
		});
	},

	onClickHandler:function(e){
		return function(){
			this.props.onSubmitHandler(e);
			this.props.changeDisplay("observer");
		}
	},

	reload:function(){
		this.state.ws.send("r");
	},

	back:function(){
		this.state.ws.close();
		this.props.changeDisplay("main");
	},

	render:function(){
		
		return(
			<Panel>
				<Rooms 
					roomInfos={this.state.roomInfos} 
					onSubmitHandler={this.props.onSubmitHandler}
					changeDisplay={this.props.changeDisplay}
				/>
				<Button bsStyle="primary" onClick={this.reload}>
					reload
				</Button>
				<Button bsStyle="primary" onClick={this.back}>
					back
				</Button>
			</Panel>
		);
	},

	componentDidMount:function(){

		this.state.ws.onmessage = function(e){
			this.setState({roomInfos:JSON.parse(e.data)});
		}.bind(this);
		this.state.ws.onopen=function(e){e.target.send("t");};
	}

});

module.exports = EnterRoom;
