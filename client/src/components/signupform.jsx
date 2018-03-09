import React from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import Navbar from './navbar.jsx';
import { Card, TextField, RadioButton, RadioButtonGroup, RaisedButton, Checkbox, Divider } from 'material-ui';

/*
  SignupForm Component:
  Used by signup component.
  Validates all fields (server side).
  On submit, user data is posted to database.
  Redirects to appropriate user profile and passes all user data to profile.
*/

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.location.state.username,
      password: this.props.location.state.password,
      type: 'petOwner',
      email: '',
      location: '',
      profileUrl: '',
      description: '',
      errors: {},
      redirectToProfile: false,
      location: {
        address: '',
        city: '',
        state: '',
      },
      pet: {
        animal: '',
        friendly: null,
        description: '',
        needs: '',
      },
      host: {
        homeType: '',
        yard: '',
        otherAnimals: true,
        description: '',
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.handlePetChange = this.handlePetChange.bind(this);
    this.handleHostChange = this.handleHostChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleFriendlyChange = this.handleFriendlyChange.bind(this);
    this.handleOtherAnimalsChange = this.handleOtherAnimalsChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    let clearedState = {}
    $.ajax({
      type: 'POST',
      url: '/signup',
      data: {
        username: this.state.username,
        password: this.state.password,
        type: this.state.type,
        email: this.state.email,
        location: this.state.location,
        profileUrl: this.state.profileUrl,
        location: this.state.location,
        pet: this.state.pet,
        host: this.state.host,
      },
      success: (data) => {
        this.setState({
          redirectToProfile: true,
          user: data,
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

  handleChange(e) {
    const target = e.target.name;
    this.setState({
      [ target ]: e.target.value
    });
  }

  handleLocationChange(e) {
    const target = e.target.name;
    let currentLocation = this.state.location;
    currentLocation[target] = e.target.value;
    this.setState({
      location: currentLocation,
    });
  }

  handleHostChange(e) {
    const target = e.target.name;
    let currentHost = this.state.host;
    currentHost[target] = e.target.value;
    this.setState({
      host: currentHost,
    });
  }

  handlePetChange(e) {
    const target = e.target.name;
    let currentPet = this.state.pet;
    currentPet[target] = e.target.value;
    this.setState({
      pet: currentPet,
    })
  }

  handleFriendlyChange(e) {
    let currentPet = this.state.pet;
    currentPet.friendly = Boolean(e.target.value);
    this.setState({
      pet: currentPet,
    });
  }

  handleOtherAnimalsChange(e) {
    let currentHost = this.state.host;
    currentHost.otherAnimals = Boolean(e.target.value);
    this.setState({
      host: currentHost,
    });
  }

  onSelect(e) {
    this.setState({
      type: e.target.value
    });
  }

  render () {
    const redirectToProfile = this.state.redirectToProfile;
    if (redirectToProfile) {
      if (this.state.type === 'host') {
        return(<Redirect to={{ pathname: '/host-profile', state: this.state }}/>)
      } else {
        return (<Redirect to={{ pathname: '/listings', state: this.state }}/>)
      }
    }

    const formFields = this.state.type === 'petOwner' ?
      (<div>
        <div className="field-line">
          <TextField floatingLabelText="Type of Pet" name="animal" onChange={this.handlePetChange} value={this.state.pet.animal}/>
        </div>

        <div className="field-line">
          <TextField floatingLabelText="Pet Description" name="description" onChange={this.handlePetChange} value={this.state.pet.description}/>
        </div>
        <div className="field-line">
          <TextField floatingLabelText="Does your pet have any special needs?" name="needs" onChange={this.handlePetChange} value={this.state.pet.needs}/>
        </div>
        Is your pet friendly or unfriendly with other animals?

        <RadioButtonGroup name="friendly" defaultSelected="none" onChange={this.handleFriendlyChange}>
              <RadioButton value="true" label="Friendly"/>
              <RadioButton value="" label="Unfriendly"/>
        </RadioButtonGroup>
      </div>)
      :
      (<div>
        Is your living space a house or an apartment?
        <RadioButtonGroup name="homeType" defaultSelected={this.state.host.homeType} onChange={this.handleHostChange}>
          <RadioButton value="house" label="House"/>
          <RadioButton value="apt" label="Apartment"/>
        </RadioButtonGroup>
        Does your living space include a yard or outdoor area?
<<<<<<< HEAD
        <RadioButtonGroup name="yard" defaultSelected="none" onChange={this.handleHostChange}>
=======
        <RadioButtonGroup name="yard" defaultSelected="true" onChange={this.handleHostChange}>
>>>>>>> modified forms to accomodate new data and refactored state calls to reflect data changes
          <RadioButton value="true" label="Yes"/>
          <RadioButton value="false" label="No"/>
        </RadioButtonGroup>
        Is your living space home to other animals?
        <RadioButtonGroup name="otherAnimals" defaultSelected="none" onChange={this.handleOtherAnimalsChange}>
          <RadioButton value="true" label="Yes"/>
          <RadioButton value="" label="No"/>
        </RadioButtonGroup>
        <div className="field-line">
          <TextField name="description" hintText="Describe yourself or your home to others" multiLine={true} rows={1} rowsMax={4} fullWidth={true} onChange={this.handleHostChange} value={this.state.host.description} />
        </div>
      </div>);

    return (
      <div>
        <Navbar link="Login" linkurl="/login"/>
        <Card className="container signupform">
          <form action="/" onSubmit={this.handleSubmit.bind(this)} >
            <h2>Create Your Profile</h2>
            <RadioButtonGroup name="Usertype" defaultSelected="petOwner" onChange={this.onSelect}>
              <RadioButton value="host" label="Host"/>
              <RadioButton value="petOwner" label="Pet Owner"/>
            </RadioButtonGroup>
            <div className="field-line">
              <TextField floatingLabelText="Username" name="username" onChange={this.handleChange} value={this.state.username} errorText={ this.state.errors.username }/>
            </div>
            <div className="field-line">
                <TextField floatingLabelText="Password" name="password" type="password" value={this.state.password} onChange={this.handleChange} errorText={ this.state.errors.password } />
            </div>
            <div className="field-line">
              <TextField floatingLabelText="Email" name="email" onChange={this.handleChange} value={this.state.email} errorText={ this.state.errors.email }/>
            </div>
            <div className="field-line">
              <TextField floatingLabelText="Street Address" name="address" onChange={this.handleLocationChange} value={this.state.location.address} errorText={ this.state.errors.location }/>
            </div>
            <div className="field-line">
              <TextField floatingLabelText="City" name="city" onChange={this.handleLocationChange} value={this.state.location.city} errorText={ this.state.errors.location }/>
            </div>
            <div className="field-line">
              <TextField floatingLabelText="State" name="state" onChange={this.handleLocationChange} value={this.state.location.state} errorText={ this.state.errors.location }/>
            </div>
            <div className="field-line">
              <TextField floatingLabelText="ImageUrl" name="profileUrl" onChange={this.handleChange} value={this.state.profileUrl} errorText={ this.state.errors.profileUrl }/>
            </div>
            <div>
              {formFields}
            </div>
            <RaisedButton type="submit" label="Submit" primary={true} fullWidth={true} />
          </form>
        </Card>
      </div>
    )
  }
}

module.exports = SignupForm;