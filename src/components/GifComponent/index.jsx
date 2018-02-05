import React from 'react';
import './GifComponent.css';

class GifComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    this.setState({gif: "https://media3.giphy.com/media/o5oLImoQgGsKY/giphy.gif"});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gif) {
      this.setState({gif: nextProps.gif});
    }
  }

  render() {
    return (
      <div className="GifBox">
        <div className="GifDisplay">
         <image src={this.state.gif} />
       </div>
      </div>
    );
  }
}

export default GifComponent;
