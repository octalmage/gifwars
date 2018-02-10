import React from 'react';
import './MoveDisplay.css';

const MoveDisplay = ({ votes, player, gif }) => (
  <React.Fragment>
    <center>
      <img className='gif' src={gif.og_src} alt="" />
      <h2>{player}</h2>
    </center>
    Votes: {votes && Object.values(votes).map(vote => <span>{vote}{' '}</span>)}
  </React.Fragment>
);

export default MoveDisplay;
