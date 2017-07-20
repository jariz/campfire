// @flow

import React, { Component } from 'react';
import { getRoom, queueRecommendedTrack } from '../../redux/room';
import type { RoomState } from '../../redux/room';
import { connect } from 'react-redux';

type RoomProps = RoomState & {
    token: string,
    queueRecommendedTrack: () => void,
    match: {
        params: {
            room: string
        }
    }
};

class Room extends Component {
    props: RoomProps;

    static async getData({store, match: { params }}) {
        return await store.dispatch(getRoom(store.getState().user.token, params.room));
    }
    
    render() {
        return (
            <div>
                {this.props.id}
            </div>
        );
    }
    
    async componentDidMount() {
        // todo check if we're the owner
        if(!this.props.loaded) {
            // todo find a way to do route blocking??
            await getRoom(this.props.token, this.props.match.params.room);
        }
        await this.props.queueRecommendedTrack(this.props.token, this.props.match.params.room);
    }
    
    // async componentWillReceiveProps(newProps: RoomProps) {
    //     if(newProps.loaded !== this.props.loaded) {
    //         await this.props.queueRecommendedTrack(this.props.token, this.props.match.params.room);
    //     }
    // }
}

export default connect(({ room, user: { token } }) => ({
    ...room,
    token
}), dispatch => ({
    queueRecommendedTrack: (token: string, roomId: string) => dispatch(queueRecommendedTrack(token, roomId)),
    getRoom: (token: string, roomId: string) => dispatch(queueRecommendedTrack(token, roomId))
}))(Room);