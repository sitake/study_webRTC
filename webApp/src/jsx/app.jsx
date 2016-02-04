const React = require('react');
const ReactDOM = require('react-dom');

const Main = require('./mainFrame.jsx');
const CreateRoom = require('./createRoom.jsx');
const EnterRoom = require('./enterRoom.jsx');

const Header = require('./header.jsx');

const Youtuber = require('./youtuber.jsx');
const Observer = require('./observer.jsx');

const panels = {	main:Main,
					createRoom:CreateRoom,
					enterRoom:EnterRoom,
					youtuber:Youtuber,
					observer:Observer
};
const headers = {	main:"Welcome",
					createRoom:"Please enter the information of your room",
					enterRoom:"Please select a room",
					youtuber:"",
					observer:""
};


const App = React.createClass({

	getInitialState:function(){
		return({
			display:"main",
			roomInfo:new Object()
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
			return(
				<div>
					<Header title={this.props.headers[this.state.display]} />
					<Display changeDisplay={this.changeDisplay} onSubmitHandler={this.setRoomInfo} roomInfo={this.state.roomInfo}/>
				</div>
			);
		
	}
});


ReactDOM.render(<App panels={panels} headers={headers}/>,document.getElementById('app'));
