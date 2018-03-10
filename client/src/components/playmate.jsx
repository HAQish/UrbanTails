import React from 'react';
import { Card } from 'material-ui';
import PlaymateMap from './playmateMap.jsx';

class Playmate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playmates: []
    };
  }

  render() {

    const playmates = this.state.playmates.map(function(playmate) {
      return (
        <Card>
        </Card>
      )
    });

    return (
      <div>
        <Navbar />
        <Card className="container playmate">
          <PlaymateMap />
        </Card>
      </div>
    )
  }
}

export default Playmate;