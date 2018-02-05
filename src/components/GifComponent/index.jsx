import React from 'react';
import './GifComponent.css';

class GifComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    console.log(this.props);
  }

  componentDidMount() {
    this.setState({gif: "https://media.giphy.com/media/ltbKep9Ce8dBS/giphy.gif"});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.gif) {
      this.setState({gif: nextProps.user.gif});
    }
  }

  render() {
    return (
      <div className="gif-box">
        <div className="gif-display">
          <div className="center"> Current Image </div>
          <img src={this.state.gif} />
          <div className="center"> {this.props.user.id} </div>
        </div>
      </div>
    );
  }
}

export default GifComponent;
