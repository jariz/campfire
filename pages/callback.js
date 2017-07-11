// @flow

import React, { Component } from 'react';
import createStore from '../createStore';
import withRedux from 'next-redux-wrapper';

type CallbackProps = {
    token: string
};

class Callback extends Component {
    props: CallbackProps;
    
    componentDidMount() {
        if(window && window.opener) {
            const { token } = this.props.url.query;
            window.opener.token = token;
            window.opener.dispatchEvent(new Event('tokenReceived'));
            window.close();
        }
    }
    
    render() {
        return <h1>Please wait...</h1>;
    }
}

export default withRedux(createStore)(Callback);