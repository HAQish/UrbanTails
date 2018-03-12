import React from 'react';
import ListingsCarousel from './listings-carousel.jsx';
import HostListing from './hostlisting.jsx';
import Navbar from './navbar.jsx';
import $ from 'jquery';

/*
  Listings Component:
  Used when pet owners log in
  Shows all listings in the database. Also has a search (filter) function, and a link to the pet profile
  Page includes the jumbletron and the hostlisting components
*/

class Listings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: this.props.location.state,
      listings: []
    }
    // this.setResults = this.setResults.bind(this);
    // this.setListings = this.setListings.bind(this);
  }

  // setListings(list) {
  //   this.setState({
  //     listings: list
  //   });
  // }

  componentWillMount() {
    $.ajax({
      type: 'GET',
      url: '/getlistings',
      success: (data) => {
        console.log('🌴 in component will mount in listings.jsx, data returned from server, all host documents', data);
        if (data) {
          // this.setListings(data);
          this.setState({listings: data})
        }
      },
      error: (data) => {
        console.log('error get data', data);
      }
    });
  }

  // setResults(searchresults) {
  //   this.setListings(searchresults);
  // }

  render() {
    // let listings = this.state.listings.reverse();
    console.log('LISTINGS before the mapping function in listings.jsx', this.state.listings);
    // let hostList = listings.map((hostsummary) => {
    //   // console.log("host summary in mapping function in listings.jsx", hostsummary);
    //   <div><HostListing host={ hostsummary }/></div>
    // });
    // console.log('host list in listings.jsx component, after the mapping', hostList);
    return (
       <div>
        <Navbar link="My Account" linkurl="/pet-profile" user={this.state.user} setresults={this.setResults} search={true}/>
        <ListingsCarousel listings={this.state.listings}/>
        <div className="container">
          {this.state.listings.map(listItem => <div><HostListing host={listItem}/></div>)}

        </div>
      </div>
    )
  }
}

module.exports = Listings;




