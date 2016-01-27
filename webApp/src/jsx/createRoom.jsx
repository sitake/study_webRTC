const React = require('react');
const ReactDOM = require('react-dom');

const Input = require('react-bootstrap').Input;
const ButtonInput = require('react-bootstrap').ButtonInput;

const CreateRoom = React.createClass({

	render:function(){
		return(

			<form onSubmit={this.handleSubmit}>
				<Input type="text" label="Room name" placeholder="Enter room's name" ref="roomName"/>
				<Input type="text" label="Handle name" placeholder="Enter your handle name" ref="handleName"/>
				<Input type="text" label="Description" placeholder="Enter your room's description" ref="description" />
				<ButtonInput type="submit" value="CreateRoom!" bsSize="large" />
			</form>

		);
	},

	handleSubmit:function(e){
		this.props.onSubmitHandler({
			roomName:this.refs.roomName.getValue(),
			handleName:this.refs.handleName.getValue(),
			description:this.refs.description.getValue(),
			id:Math.random().toString().slice(-8)
		});
		this.props.changeDisplay("youtuber");
		return e.preventDefault();
	}
});

module.exports = CreateRoom;
ReactDOM.render(<CreateRoom />,document.getElementById('app'));

