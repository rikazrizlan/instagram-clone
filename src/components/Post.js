import React from 'react';
import Avatar from '@material-ui/core/Avatar';

export default function Post({username, image, caption}) {
    return (
        <div className="post-container">
            <div className="post-header">
                <Avatar className="post-avatar" src={image} alt="Avatar" />
                <h3>{username}</h3>
            </div>
            <img className="post-img" src={image} alt="Mountain"/>
            <h4 className="post-text"><strong>{username}</strong>{caption}</h4>
        </div>
    )
}
