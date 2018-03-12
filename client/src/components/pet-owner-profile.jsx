import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { TextField, RaisedButton } from 'material-ui';
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
      email: this.props.location.state.email,
      edit: false,
      editing: {
        editImg: false,
        editInfo: ''
      },
      updated: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleImgClick = this.handleImgClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImgSubmit = this.handleImgSubmit.bind(this);
  }

  handleImgChange(e) {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      profileUrl: value
    });
  }

  handleChange(e) {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value
    });
  }

  handleClick(e) {
    e.preventDefault();
    let name = e.target.name;
    console.log('✋', e.target);
    console.log('❓', name);
    this.setState({
      edit: true,
      editing: {
        editInfo: name
      }
    });
  }

  handleImgClick(e) {
    e.preventDefault();
    this.setState({
      edit: true,
      editing: {
        editImg: true
      }
    });
  }

  handleSubmit(e) {
    let name = e.target.name;
    console.log('🤡', name);
    let val = this.state[name];
    console.log('🤡', val);
    // Send info that was changed to db

    $.ajax({
      type: 'POST',
      url: '/petowner',
      data: {
        name: name,
        val: val
      },
      success: (data) => {
        this.setState({
          updated: true
        });
      },
      error: (data) => {
        this.setState({
          errors: data.responseJSON.errors
        })
      }
    });

    this.setState(clearedState);
  }

  handleImgSubmit(e) {
    console.log('🏞', e.target);
    console.log('🏞', this.state.profileUrl);
    // send profileUrl to the db
  }

  // putFunction(e) {
  //   $.ajax({
  //     type: "PUT",
  //     url: "/pet-profile",
  //     data: {
  //     username: this.props.location.state.username + "d",
  //     profileUrl: this.props.location.state.profileUrl,
  //     description: this.props.location.state.description + "sd",
  //     location: this.props.location.state.location,
  //     email: this.props.location.state.email
  //     },
  //     success: function() {
  //       console.log("Successful put.");
  //     },
  //     error: function() {
  //       console.log("Unsuccessful put.");
  //     }
  //   })
  // }

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
    const editStyles = {
      margin: 'auto'
    }

    let editForm = null; 
    if (this.state.edit) {
      if (this.state.editing.editImg) {
        editForm = (
          <form className="col-sm-6 col-sm-offset-1">
            <TextField style={editStyles} floatingLabelText="Edit ImageUrl" name="profileUrl" onChange={this.handleImgChange} value={this.state.profileUrl} />
            <button type="button" className="btn btn-large btn-primary" name="profileUrl" onClick={this.handleImgSubmit}>Confirm</button>
          </form>
        )
      } else if (this.state.editing.editInfo) {
        editForm = (
          <form>
            <TextField className="col-sm-6 col-sm-offset-5" floatingLabelText={this.state.editing.editInfo} name={this.state.editing.editInfo} onChange={this.handleChange} value={this.state[this.state.editing.editInfo]} />
            <button type="button" className="btn btn-large btn-primary" name={this.state.editing.editInfo} onClick={this.handleSubmit}>Confirm</button>
          </form>
        )
      }
    }

    return (
      <div>
        <Navbar link="Logout" linkurl="/" />
        <div className="well"></div>
        <Row>
          <Col style={{ paddingLeft: '10%' }} md={4}>
              <div className="profileimg"><img src={this.state.profileUrl} /></div>
              {/* <RaisedButton type="button" label="Edit Image" primary={true} fullWidth={true} onClick={this.handleImgClick} /> */}
              <button type="button" className="btn btn-large btn-primary" name="profileUrl" onClick={this.handleImgClick}>Edit Image</button>
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
            <p><b>Email: </b>{this.state.email} </p><button type="button" className="btn btn-large btn-primary" name="email" onClick={this.handleClick}>Edit Email</button>
            <p><b>Location: </b>{this.state.location.city} </p>
            <p><b>Description: </b>{this.state.description}</p><button type="button" className="btn btn-large btn-primary" name="description" onClick={this.handleClick}>Edit Description</button>
              {/* <p className="description">{this.state.description} </p> */}
          </Col>
        </Row>
        <div>
          <Row>
            {editForm}
          </Row>
        </div>
        <div>
          <Row>
            <Card style={style}>
              <PlaymateMap location={this.props.location.state} />
            </Card>
          </Row>
        </div>
      </div>
    )
  }
}

module.exports = PetProfile;
