import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import Key from './../../../config/googleAPI.config.js';

class DogParkMap extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const style = {
      width: '70vw',
      height: '70vh'
    }

    let dogParks = this.props.location.dogParks.map((dogPark, index) => (
        <Marker name={dogPark.name} position={{lat: dogPark.geometry.location.lat, lng: dogPark.geometry.location.lng}} key={index}
        />
    ));

    return (
      <Map google={this.props.google} initialCenter={{
            lat: this.props.location.latLong.lat,
            lng: this.props.location.latLong.lng,
          }} zoom={12} style={style}>

        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />
        {dogParks}
      </Map>
    )
  }
}



export default GoogleApiWrapper({
   apiKey: Key.KEY,
   libraries: ['visualization']
 })(DogParkMap);
