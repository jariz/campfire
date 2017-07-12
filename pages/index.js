// @flow

import React, { Component } from 'react';
import Layout from '../components/Layout';
import { authUrl } from '../constants/apiUrls';
import withRedux from 'next-redux-wrapper';
import createStore from '../createStore';
import { getProfile } from '../redux/user';
import type { UserState } from '../redux/user';
import { setToken } from '../redux/user';
import isServer from '../services/isServer';
import { createRoom, RoomState } from '../redux/room';

type HomeProps = {
    user: UserState,
    room: RoomState,
    dispatch: (action: any) => void,
    setToken: (token: string) => void,
    url: {
        push: (url: string) => void
    }
};

const startAuth = () => {
    window.open(authUrl(), '', 'width=700,height=400');
};

class Home extends Component {
    props: HomeProps;
    
    componentWillMount() {
        !isServer && window.addEventListener('tokenReceived', this.onToken);
    }
    
    componentWillUnmount() {
        !isServer && window.removeEventListener('tokenReceived', this.onToken);
    }
    
    onToken = async () => {
        // dispatch action
        const { token } = window;
        this.props.dispatch(setToken(token));

        await this.props.dispatch(getProfile(token));
        const roomInfo = await this.props.dispatch(createRoom(token));
        this.props.url.push('/' + roomInfo.id);
    }
    
    render() {
        return (
            <Layout>
                <a onClick={() => startAuth()} href="#">
                    Heyo, laten we even authen!!!
                </a>
            </Layout>
        );
    }
}

export default withRedux(createStore, ({ user, room }) => ({ user, room }))(Home);