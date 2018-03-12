import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { RaisedButton } from 'material-ui';

/*
  HostListing Component:
  Used on listings page
  Individual listings that show a profile image, name, location,
  description, and contact button
  When contact button is clicked, the contact email is displayed
*/

class HostListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContact: false,
      style: {backgroundColor: 'white'}
    };
    this.handleClick = this.handleClick.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
  }

  handleClick(e) {
    console.log(this.props);
    this.setState({
      showContact: !this.state.showContact
    });
  }

  componentDidMount() {
    console.log('🇺🇸', this.props.host);
  }

  mouseOut() {
    this.setState({style: {backgroundColor: 'white'}});
  }

  mouseOver() {
    this.setState({style: {backgroundColor: '#f7f7f7'}});
  }

  render() {
    let contact = 'Contact ' + this.props.host.username;
    let condition = this.props.host.host.yard === "true" ? "does not have" : "has"
    return (
      <Row className="host-listing" style={this.state.style} onMouseLeave={this.mouseOut} onMouseEnter={this.mouseOver} >

        <Col md={5} className="host-content" >
          <h2>{this.props.host.username}</h2>
          <h5>{this.props.host.location.address}, {this.props.host.location.city}, {this.props.host.location.state}</h5>
          Description: <h3>{this.props.host.host.description}</h3>
          <h2>Type of home: {this.props.host.host.homeType}</h2>
          This house {condition} a front yard.
          <div>
            <i className="material-icons md-24 ratings">pets</i>
            <i className="material-icons md-24 ratings">pets</i>
            <i className="material-icons md-24 ratings">pets</i>
            <i className="material-icons md-24 ratings">pets</i>
            <i className="material-icons md-24 ratings">pets</i>
          </div>
          <p></p>
          <div className="contact-btn-container">
            <RaisedButton className="contact-btn" backgroundColor="#008080" labelColor="#fff" type="submit" label={ this.state.showContact ? this.props.host.email : contact } onClick={this.handleClick}/>
          </div>
        </Col>
      </Row>
    )
  }
}

module.exports = HostListing;