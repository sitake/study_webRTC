const React = require('react');
const ReactDOM = require('react-dom');

const Jumbotron = require('react-bootstrap').Jumbotron;
const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const Button = require('react-bootstrap').Button;

const MainFrame = React.createClass({

	clickHandler:function(e){
		return function(){
			this.props.changeDisplay(e);
		};
	},

	render:function(){
		return(
			<div>
				<h1>
					test
				</h1>

				<Grid>
					<Row>
						<Col md={6}>
							<Button onClick={this.clickHandler("createRoom").bind(this)}>
								<Jumbotron>
									<h1>
										Create Room
									</h1>
								</Jumbotron>
							</Button>
						</Col>
						<Col md={6}>
							<Button onClick={this.clickHandler("enterRoom").bind(this)}>
								<Jumbotron>
									<h1>
										Enter Room
									</h1>
								</Jumbotron>
							</Button>
						</Col>
					</Row>
				</Grid>



				<video id="localVideo" autoPlay="true" control></video>
				<audio id="localAudio"></audio>
			</div>
		);
	}
});

module.exports = MainFrame;
ReactDOM.render(<MainFrame />,document.getElementById('app'));

