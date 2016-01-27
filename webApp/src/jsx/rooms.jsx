const React = require('react');
const ReactDOM = require('react-dom');


const Button = require('react-bootstrap').Button;
const Jumbotron = require('react-bootstrap').Jumbotron;

const Rooms = React.createClass({

	onClickHandler:function(e){
		return function(){
			this.props.onSubmitHandler(e);
			this.props.changeDisplay("observer");
			console.log(e);
		}.bind(this);
	},

	render:function(){

		if(this.props.roomInfos === new Object()){
			return(<h1>now loading......</h1>);
		}
		else{

			var disp = Object.keys(this.props.roomInfos).map(
				function(k){
					var info = this.props.roomInfos[k];

					return(
						<Button onClick={this.onClickHandler(info).bind(this)} >
							<Jumbotron>
								<h2>
									{info.roomName}
								</h2>
								<h4>
									{info.handleName}
								</h4>
								<h3>
									{info.description}
								</h3>
							</Jumbotron>
						</Button>
					);


				}
				,this);
			return(
				<div>
					{disp}
				</div>
			);

		}
	},

});

module.exports = Rooms;
