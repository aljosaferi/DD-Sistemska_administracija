import styles from './PhotoDetails.module.css';
import moment from 'moment'
import { UserContext } from '../../userContext'

import {useState, useEffect, useContext} from 'react'

import Comment from '../Comment/Comment'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

function PhotoDetails(props) {
    const userContext = useContext(UserContext)
    const[photo, setPhoto] = useState()
    const[comments, setComments] = useState([])
    const[comment, setComment] = useState()
    /*const[replyingTo, setReplyingTo] = useState(null)*/

    useEffect(() => {
        const getPhoto = async function(){
            const res = await fetch("http://localhost:3001/photos/" + props.photoId)
            const data = await res.json()
            setPhoto(data)
            setComments(data.comments)
        }
        getPhoto()
    }, [])

    const handleCommentChange = (event) => {
        setComment(event.target.value)
    }

    /*const setReplyCommentId = (commentId) => {
        setReplyingTo(commentId)
    }*/

    const postComment = async (e) => {
        const newComment = {
            postedBy: userContext.user,
            content: comment,
            likedBy: []
        }
        setComments([...comments, newComment])
        e.preventDefault();

        const CSRFres = await fetch("http://localhost:3001/getCSRFToken", {
            credentials: "include",
            });
        const CSRFtoken = await CSRFres.json();

        const res = await fetch("http://localhost:3001/comments?photoId=" + props.photoId, {
            method: "POST",
            credentials: "include",
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-Token': CSRFtoken.CSRFToken
            },
            body: JSON.stringify({
                content: comment
            })
        });
        const data = await res.json();
        const commentsCopy = [...comments]
        commentsCopy[commentsCopy.length - 1] = data
        setComments(commentsCopy)
    }

    return(
        <div className={styles['container']}>
            <div className={styles['image']}>
                {photo && <img src={"http://localhost:3001/"+photo.path} alt={photo.name}/>}
            </div>
            <div className={styles['comment-section']}>

                <div className={styles['photo-description']}>
                    {photo && (<>
                        <div className={styles['user-date']}>
                            <h3>{photo.postedBy.username}</h3>
                            <h5>{moment(photo.created).fromNow()}</h5>
                        </div>
                        <div className={styles['name-description']}>
                            <h4>{photo.name}</h4>
                            <h4>{photo.description}</h4>
                        </div>
                    </>)}
                </div>

                <div className={styles['comments']}>
                    {photo && comments.map((comment) => (
                        <Comment comment={comment} /*replyingTo={replyingTo}*/ /*setReplyCommentId={setReplyCommentId}*/ key={comment._id}/>
                    ))}
                </div>

                {userContext.user && (
                <div className={styles['submit-comment']}>
                    <form onSubmit={postComment} className={styles['comment-form']}>
                        <input type="text" value={comment} onChange={handleCommentChange}/>
                        <button type="submit" disabled={!comment} style={{background: 'none', border: 'none'}}>
                            <FontAwesomeIcon icon={faPaperPlane} className={`icon ${comment ? 'icon-secondary' : ''} ${styles['like-icon']}`} title="Post comment"/>
                        </button>
                    </form>
                </div>)}

            </div>
        </div>
    );
}

export default PhotoDetails;