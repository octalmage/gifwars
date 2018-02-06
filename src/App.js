import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Home from './containers/Home';
import Join from './containers/Join';
import Start from './containers/Start';
import Game from './containers/Game';
import Stage from './containers/Stage';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/join" component={Join}/>
          <Route path="/start" component={Start}/>
          <Route path="/game/:id" component={Game}/>
          <Route path="/stage/:id" component={Stage}/>
        </div>
      </Router>
    );
  }
}

export default App;
