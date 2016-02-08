const React = require('react');
const ReactDOM = require('react-dom');


const Button = require('react-bootstrap').Button;
const Jumbotron = require('react-bootstrap').Jumbotron;

const Rooms = React.createClass({

	onClickHandler:function(e){
		return function(){
			this.props.clickHandler(e);
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
							<Jumbotron key={k}>
								<h2 className="container">
									{"Room Name:"+info.roomName}
								</h2>
								<h4 className="container">
									{"host:"+info.handleName}
								</h4>
								<h3 className="container">
									{"description:"+info.description}
								</h3>

								<Button className="container" onClick={this.onClickHandler(info).bind(this)} bsStyle="primary">
									Enter
								</Button>
							</Jumbotron>
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
