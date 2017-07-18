// @flow

import React, { Component } from 'react';
import { getRoom, queueRecommendedTrack } from '../../redux/room';
import type { RoomState } from '../../redux/room';
import { connect } from 'react-redux';
import isServer from '../../services/isServer';

type RoomProps = {
    room: RoomState,
    token: string,
    queueRecommendedTrack: () => void
};

class Room extends Component {
    props: RoomProps;

    static async getData({store, match: { params }}) {
        return await store.dispatch(getRoom(store.getState().user.token, params.room));
    }
    
    render() {
        return (
            <div>
                {this.props.room.id}
            </div>
        );
    }
    
    componentDidMount() {
        if(!isServer) {
            this.props.queueRecommendedTrack(this.props.token);
        }
    }
}

export default connect(({ room, user: { token } }) => ({ room, token }), dispatch => ({ queueRecommendedTrack: (token: string) => dispatch(queueRecommendedTrack(token)) }))(Room);