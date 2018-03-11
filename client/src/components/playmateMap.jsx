import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import Key from './../../../config/googleAPI.config.js';

class PlaymateMap extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const style = {
      width: '70vw',
      height: '70vh'
    }

    return (
      <Map google={this.props.google} initialCenter={{
            lat: this.props.location.latLong.lat,
            lng: this.props.location.latLong.lng,
          }} zoom={14} style={style}>

        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />
      </Map>
    )
  }
}

export default GoogleApiWrapper({
   apiKey: Key.KEY,
   libraries: ['visualization']
 })(PlaymateMap);

