import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import Key from './../../../config/googleAPI.config.js';
import Navbar from './navbar.jsx';
import $ from 'jquery';

class PlaymateMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playmates: []
    }
  }

  componentWillMount() {
    $.ajax({
      type: "GET",
      url: "/playmates",
      success: (data) => {
        console.log("success in playmateMap", data);
        this.setState({playmates: data});
      },
      error: (error) => {
        console.log("error in ajax call playmateMap", error);
      }
    })
  }

  render() {
    const style = {
      width: '70vw',
      height: '70vh'
    }

   let playmates = this.state.playmates.map((playmate, index) => (
        <Marker position={{lat: playmate.latLong.lat, lng: playmate.latLong.lng}} key={index}
        />
    ));

    return (
      <Map google={this.props.google} initialCenter={{
            lat: this.props.location.latLong.lat,
            lng: this.props.location.latLong.lng,
          }} zoom={14} style={style}>

        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />
          {playmates}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
   apiKey: Key.KEY,
   libraries: ['visualization']
 })(PlaymateMap);

