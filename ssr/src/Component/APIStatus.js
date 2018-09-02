import 'babel-polyfill'; 
import React, { Component } from 'react';
import axios from 'axios'

export default class APIStatus extends Component {
  constructor() {
    super();
    this.state = { 
      statusCode: "",
      statusText: ""
    };  
  }
  async componentDidMount() {
    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json'
      }
    };
    await axios.get('http://mockbin.com/headers', options)
      .then(response => {
        this.setState(
          { 
            statusCode: response.status,
            statusText: response.statusText
          }
        )
      })
  }
  render() {
    return (
      <div>
        API status code: {this.state.statusCode}<br />
        API status text: {this.state.statusText}
      </div>
    );  
  }
}
