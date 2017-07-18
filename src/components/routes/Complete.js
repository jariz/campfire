// @flow

import React, { Component } from 'react';
import querystring from 'query-string';

type CompleteProps = {
    token: string,
    location: {
        key: string,
        pathname: string,
        search: string,
        hash: string,
        state: any
    }
};

class Complete extends Component {
    props: CompleteProps;
    
    componentDidMount() {
        if(window && window.opener) {
            const { token } = querystring.parse(this.props.location.search);
            window.opener.token = token;
            window.opener.dispatchEvent(new Event('tokenReceived'));
            window.close();
        }
    }
    
    render() {
        return <h1>Please wait...</h1>;
    }
}

export default Complete;