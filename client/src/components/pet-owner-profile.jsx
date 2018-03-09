import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Navbar from './navbar.jsx';
import PlaymateMap from './playmateMap.jsx';
import { Card } from 'material-ui';
import $ from 'jquery';


/*
  PetProfile Component:
  Used by login redirect and by clicking 'My Account' on listings page
  Displays currently logged in user information.
*/

class PetProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: this.props.location.state.username,
      profileUrl: this.props.location.state.profileUrl,
      description: this.props.location.state.pet.description, //CHANGED!! BL
      location: this.props.location.state.location,
      email: this.props.location.state.email
    }
  }

  putFunction(e) {
    $.ajax({
      type: "PUT",
      url: "/pet-profile",
      data: {
      username: this.props.location.state.username + "d",
      profileUrl: this.props.location.state.profileUrl,
      description: this.props.location.state.description + "sd",
      location: this.props.location.state.location,
      email: this.props.location.state.email
      },
      success: function() {
        console.log("Successful put.");
      },
      error: function() {
        console.log("Unsuccessful put.");
      }
    })
  }

  componentDidMount() {
    $.ajax({
      type: "GET",
      url: "/pet-profile"
    })
  }

  render() {

    const style = {
      margin: 'auto',
      width: '70vw',
      height: '70vh',
    }

    return (
      <div>
        <Navbar link="Logout" linkurl="/" />
        <div className="well"></div>
        <Row>
          <Col style={{ paddingLeft: '10%' }} md={4}>
              <div className="profileimg"><img src={this.state.profileUrl} /></div>
          </Col>
          <Col style={{ paddingLeft: '10%' }} md={5}>
              <h3>{this.state.username}</h3>
              <p>
                <b>Guest Rating: </b>
                <i className="material-icons md-24 ratings">pets</i>
                <i className="material-icons md-24 ratings">pets</i>
                <i className="material-icons md-24 ratings">pets</i>
                <i className="material-icons md-24 ratings">pets</i>
                <i className="material-icons md-24 ratings">pets</i>
              </p>
              <p><b>Email: </b>{this.state.email}</p>
              <p><b>Location: </b>{this.state.location.city}</p>
              <p><b>Description: </b></p>
              <p className="description">{this.state.description}</p>
              <br /> <br />
              <form onSubmit={this.putFunction.bind(this)}>
              <button>Put request to update</button>
              </form>
          </Col>
        </Row>
        <Row><Card style={style}>
          <PlaymateMap location={this.props.location.state}/>
        </Card>
        </Row>
      </div>
    )
  }
}

module.exports = PetProfile;
