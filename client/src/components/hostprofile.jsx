import React from 'react';
import Calendar from 'react-calendar';
import Navbar from './navbar.jsx';
import DogParkMap from './dogParkMap.jsx';
import { Card, Row, Col, TextField, RaisedButton } from 'material-ui';

/*
  HostProfile Component:
  Used after logging in or signing up as a host, it displays all the information about the host.
  Currently this is a private profile, but it can potentially be public, have more functions
  such as ratings and messaging, and can be shown by clicking on an individual listing on the listings page.
*/

class HostProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.location.state.username,
      imageUrl: this.props.location.state.profileUrl,
      location: this.props.location.state.location,
      host: this.props.location.state.host, //CHANGED!! BL
      email: this.props.location.state.email,
      dogParks: this.props.location.state.dogParks,
      latLong: this.props.location.state.latLong
    };
  }

  render () {

    const style = {
      margin: 'auto',
      width: '70vw',
      height: '70vh',
    }

    return (
      <div>
        <Navbar link="Logout" linkurl="/" />
        <div className="well"></div>
        <div className='row'>
          <div style={{ paddingLeft: '10%' }} className='col-md-4'>
            <div className="profileimg"><img src={this.state.imageUrl} /></div>
          </div>
          <div style={{ paddingLeft: '10%' }} className='col-md-5'>
            <h3>{this.state.username}</h3>
            <p>
              <b>Host Rating: </b>
              <i className="material-icons md-24 ratings">pets</i>
              <i className="material-icons md-24 ratings">pets</i>
              <i className="material-icons md-24 ratings">pets</i>
              <i className="material-icons md-24 ratings">pets</i>
              <i className="material-icons md-24 ratings">pets</i>
            </p>
            <p><b>Email: </b>{this.state.email}</p>
            <p><b>Location: </b>{this.state.location.address}, {this.state.location.city} {this.state.location.state}</p>
            <p><b>Description: </b></p>
            <p className="description">{this.state.host.description}</p>
          </div>
        </div><br/>
        <div><h2 className="col-sm-6 col-sm-offset-3">DOG PARKS NEAR ME</h2></div>
        <br />
        <br />
        <br />
        <div>
          <Card style={style}>
            <DogParkMap location={this.props.location.state}/>
          </Card>
        </div>
        {/* <div className='row'>
          <div style={{ paddingLeft: '10%' }} className='col-md-4' className="host-content">
            <div style= {{ maxWidth: '300px' }}>
              <Calendar className="react-calendar" />
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}

module.exports = HostProfile;