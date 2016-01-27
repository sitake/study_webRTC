const React = require('react');
const ReactDOM = require('react-dom');

const PageHeader = React.createClass({

	render:function(){
		return(
			<div className = "bs-docs-header">
				<div className ="container">
					<h1>{this.props.title}</h1>
				</div>
			</div>
		);
	}
});

module.exports = PageHeader;

