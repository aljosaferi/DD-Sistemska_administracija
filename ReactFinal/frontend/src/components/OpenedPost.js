import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { useEffect } from 'react';

import classes from './OpenedPost.module.css';
import Comments from './Comments';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';

function OpenedPost({photo, updatePhotoLikes, updatePhotoComments}) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            const res = await fetch(`http://localhost:3001/comments/photo/${photo._id}`);
            const data = await res.json();
            setComments(data);
        };
    
        fetchComments();
    }, [photo._id]);

    const[comment, setComment] = useState('');
    const userContext = useContext(UserContext);

    async function onSubmit(e){
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('comment', comment);
        formData.append('userId', userContext.user._id);
        formData.append('photoId', photo._id);
        formData.append('dateCreated', new Date());
        const res = await fetch('http://localhost:3001/comments', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        const data = await res.json();
        setComments(prevComments => [...prevComments, data]);
        updatePhotoComments(photo._id, comments.length + 1);
        setComment('');
    }

    const [score, setScore] = useState(photo.likes);
    const [likeDislike, setLikeDislike] = useState("");

    useEffect(() => {
        likeDislikePhoto();
    }, [likeDislike]);

    async function likeDislikePhoto(){
        
        try {
            const res = await fetch("http://localhost:3001/photos/likeDislike", {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    likeDislikeValue: likeDislike,
                    photoId: photo._id,
                    userId: userContext.user._id
                })
            });

            const data = await res.json();
            setScore(data.likes);
            updatePhotoLikes(photo._id, data.likes);
            setLikeDislike('');
        }
        catch (error) {
            console.error('There was a problem with the request:', error);
        }
    }

    async function reportPhoto() {
        try {
            const res = await fetch("http://localhost:3001/photos/report", {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    photoId: photo._id,
                    userId: userContext.user._id
                })
            });

            const data = await res.json();
            console.log(data);
        }
        catch (error) {
            console.error('There was a problem with the request:', error);
        }
    } 


    return (
        <div className={classes.mainDisplayPhotoDiv}>
            <div className={classes.photoDiv}>
                <img src={`http://localhost:3001/${photo.path}`} alt={photo.name} />
            </div>
            <div className={classes.commentsDiv}>
                <div className={classes.authorDiv}>
                    <div className={classes.author}>
                        Author: {photo.postedBy.username}
                    </div>
                    <UserContext.Consumer>
                    {context => (
                        context.user ?
                            <div className={classes.reportDiv}>
                                <button onClick={() => reportPhoto()}>Report</button>
                            </div>
                            : 
                            null
                        )}
                    </UserContext.Consumer>
                </div>
                <div className={classes.descriptionDiv}>
                    {photo.description}
                </div>
                <div className={classes.displayCommentsDiv}>
                    <Comments comments={comments} />
                </div>
                <UserContext.Consumer>
                    {context => (
                        context.user ?
                            <div className={classes.footer}>
                                <div className='buttonHolder' style={{color: '#2b3e80', fontWeight: '600'}}>
                                    <button className={classes.likeButton} onClick={() => setLikeDislike('like')}>
                                        <FontAwesomeIcon icon={faHeart} />
                                    </button>
                                    Score: {score}
                                    <button className={classes.dislikeButton} onClick={() => setLikeDislike('dislike')}>
                                        <FontAwesomeIcon icon={faHeartBroken} />
                                    </button>
                                </div>
                                <div className={classes.commentForm}>
                                    <form className={classes.formClass} onSubmit={onSubmit}>
                                        <input className={classes.commentBox} type='text' placeholder='Comment' value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
                                        <input className={classes.submitButton} type="submit" name="submit" value="Submit" />
                                    </form>
                                </div>
                            </div>
                            : 
                        null
                    )}
                </UserContext.Consumer>
            </div>
        </div>
    );
}




export default OpenedPost;