import React from 'react';
import {Map, GoogleApiWrapper} from 'google-maps-react';

class DogParkMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: 1.4693,
        lng: 78.8169
      },
      places:[]
    };
  }


  render() {
    const style = {
      width: '100%',
      height: '100%',
    }
    return (
      <Map zoom={10} style={style} initialCenter={this.state.location}>

      </Map>
    )
  }
}

export default DogParkMap;