// @flow

import React, { Component } from 'react';
// import Layout from '../../components/Layout';
import { authUrl } from '../../constants/apiUrls';
// import { connect } from 'react-redux';
import { getProfile } from '../../redux/user';
import type { UserState } from '../../redux/user';
import { setToken } from '../../redux/user';
import isServer from '../../services/isServer';
import { createRoom, RoomState } from '../../redux/room';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

type HomeProps = {
    user: UserState,
    room: RoomState,
    dispatch: (action: any) => void,
    setToken: (token: string) => void,
    history: History
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
        this.props.setToken(token);

        await this.props.getProfile(token);
        const roomInfo = await this.props.createRoom(token);
        this.props.history.push('/' + roomInfo.id);
    }
    
    render() {
        return (
            <div>
                <a onClick={() => startAuth()} href="#">
                    Heyo, laten we even authen!!!
                </a>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setToken: (token: string) => dispatch(setToken(token)),
    getProfile: (token: string) => dispatch(getProfile(token)),
    createRoom: (token: string) => dispatch(createRoom(token)),
});

export default withRouter(connect(null, mapDispatchToProps)(Home));