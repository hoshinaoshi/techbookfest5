import 'babel-polyfill';
import React, { Component } from 'react';
import axios from 'axios'
import Link from 'next/link' 

export default class Index extends Component {
  static async getInitialProps({ req }) {
    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json'
      }
    };
    const res = await axios.get('http://mockbin.com/headers', options)
    return { statusCode: res.status, statusText: res.statusText, isServer: !!req };
  }

  constructor(props) {
    super(props);
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
        API status code: {this.props.statusCode}<br />
        API status text: {this.props.statusText}<br />
        isServer: {String(this.props.isServer)}
      </div>
    );
  }
}
