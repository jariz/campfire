import React, { Component } from 'react';
import Layout from '../components/Layout';
import withRedux from 'next-redux-wrapper';
import createStore from '../createStore';
import { roomUrl } from '../constants/apiUrls';
import throwIfNotOK from '../services/throwIfNotOK';

class Room extends Component {
    static async getInitialProps({store, req}) {
        // console.log(Object.keys(breh));
        const resp = await fetch(roomUrl(req.params.roomName));
        throwIfNotOK(resp);
        const body = await resp.json();
        store.dispatch({
            type: 'BLAHBLAH',
            payload: body
        });
        return {
            body
        };
    }
    
    render() {
        return (
            <Layout>RooM!</Layout>
        );
    }
}

export default withRedux(createStore, ({ user }) => ({ user }))(Room);