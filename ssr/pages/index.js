import 'babel-polyfill';
import React, { Component } from 'react';
import axios from 'axios'
import Link from 'next/link' 

export default class Index extends Component {
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
        <div>
          <Link href="/about">
            <a>About Page</a>
          </Link>
          <p>Hello Next.js</p>
        </div> 
        API status code: {this.state.statusCode}<br />
        API status text: {this.state.statusText}
      </div>
    );
  }
}
