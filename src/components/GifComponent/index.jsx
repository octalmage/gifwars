import React from 'react';
import './GifComponent.css';

class GifComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    this.setState({gif: "https://media.giphy.com/media/ltbKep9Ce8dBS/giphy.gif"});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gif) {
      console.log(nextProps);
      this.setState({gif: nextProps.gif});
    }
  }

  render() {
    return (
      <div className="gif-box">
        <div className="gif-display">
          <div className="center"> Current Image </div>
          <img src={this.state.gif} />
        </div>
      </div>
    );
  }
}

export default GifComponent;
