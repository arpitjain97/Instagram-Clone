import React, { useState, useEffect } from 'react'
import './Post.css';
import { db } from './firebase';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase';
function Post({postId, user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe =db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>{
                setComments(snapshot.docs.map((doc) =>doc.data()));
            });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) =>{
        event.preventDefault();
        db
            .collection("posts")
            .doc(postId)
            .collection("comments").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp() ,
                text: comment,
                username : user.displayName
            });
            setComment('');
    }

    return (
        <div className = "post">
        <div className = "post__header">
        <Avatar className = "post__avatar" 
        alt={username}
        src="/static/images/avatar/1.jpg" />
        <h3>{username}</h3>
        </div>
        
            {/*Header-> avatar+username  */}
            <img className = "post__image" src = {imageUrl}
                alt=""
            />
            
            <h4 className = "post__text"><strong>{username}</strong>{caption}</h4>
            <div className = "post__comments">
                {
                    comments.map((comment) =>(
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>
            { user && (
                <form className = "post__commentBox">
            <input
            className = "post__input"
            placeholder = "Add a comment..."
            type = "text"
            value = {comment}
            onChange = {(e) => setComment(e.target.value)}
          />
          <button
          className = "post__button"
          type = "submit"
          disabled = {!comment}
          onClick = {postComment}
          >
            Post
          </button>
            </form>
            )}
           
        </div>
    )
}

export default Post
