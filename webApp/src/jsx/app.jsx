const React = require('react');
const ReactDOM = require('react-dom');

const Main = require('./mainFrame.jsx');
const CreateRoom = require('./createRoom.jsx');
const EnterRoom = require('./enterRoom.jsx');

const Header = require('./header.jsx');

const panels = {main:Main,createRoom:CreateRoom,enterRoom:EnterRoom};
const headers = {	main:"Welcome, this is Video Streaming Tool",
					createRoom:"Please input your room's information",
					enterRoom:"Choose room"
};

const Youtuber = require('./youtuber.jsx');
const Observer = require('./observer.jsx');

const App = React.createClass({

	getInitialState:function(){
		return({
			display:"main",
			roomInfo:{roomName:"default",handleName:"default",description:"default",id:"defid000"}
		});
	},

	changeDisplay:function(e){
		this.setState({display:e});
	},

	setRoomInfo:function(e){
		this.setState({roomInfo:e});
	},

	render:function(){
		var Display = this.props.panels[this.state.display];
		if(this.state.display === "youtuber"){
			return(<Youtuber roomInfo={this.state.roomInfo}/>);
		}
		else if(this.state.display==="observer"){
			return(<Observer roomInfo={this.state.roomInfo}/>);
		}
		else{
			return(
				<div>
					<Header title={this.props.headers[this.state.display]} />
					<Display changeDisplay={this.changeDisplay} onSubmitHandler={this.setRoomInfo} />
				</div>
			);
		}
	}
});


ReactDOM.render(<App panels={panels} headers={headers}/>,document.getElementById('app'));
