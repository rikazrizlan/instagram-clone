import React, {useState, useEffect} from 'react';
import firebase from 'firebase/app';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../Firebase';

export default function Post({postId, user, username, image, caption}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId).collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId])

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");        
    }

    return (
        <div className="post-container">
            <div className="post-header">
                <Avatar className="post-avatar" src={image} alt="Avatar" />
                <h3>{username}</h3>
            </div>
            <img className="post-img" src={image} alt="Mountain"/>
            <h4 className="post-text"><strong>{username}</strong>{caption}</h4>

            <div className="post-comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>  
            
            {user && (
                <form className="comment-form">
                <input
                    className="post-input"
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button className="post-btn" disabled={!comment} type="submit" onClick={postComment}>
                    Post
                </button>
            </form>
            )
            }
        </div>
    )
}
