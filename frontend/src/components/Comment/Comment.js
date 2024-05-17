import styles from './Comment.module.css';
import {useState, useContext} from 'react'
import { UserContext } from '../../userContext'

function Comment(props) {
    const userContext = useContext(UserContext)
    const [likes, setLikes] = useState(props.comment.likes)
    const [isLiked, setIsLiked] = useState(userContext.user && props.comment.likedBy.includes(userContext.user._id))

    const likeComment = async () => {
        console.log(props.comment.likedBy)
        if(isLiked) {
            setLikes(likes - 1)
            setIsLiked(false)
        } else {
            setLikes(likes + 1)
            setIsLiked(true)
        }
        try {
            const CSRFres = await fetch("http://" + process.env.REACT_APP_IP_ADDY + ":3001/getCSRFToken", {
            credentials: "include",
            });
            const CSRFtoken = await CSRFres.json();

            const response = await fetch(`http://${process.env.REACT_APP_IP_ADDY}:3001/comments/${props.comment._id}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': CSRFtoken.CSRFToken
                }
            });

            if (!response.ok) {
                throw new Error('Response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <div className={styles['comment']}>
            <div className={styles['comment-content']}>
                <h3>{props.comment.postedBy.username}</h3>
                <h4>{props.comment.content}</h4>
            </div>
                            
            {userContext.user && (
                <div className={styles['likes']}>
                    <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart icon ${isLiked ? 'icon-secondary' : ''} ${styles['like-icon']}`} onClick={likeComment} title="Like"/>
                    <label>{likes} {likes === 1 ? 'like' : 'likes'}</label>
                </div>
            )}        
                    {/* {props.replyingTo === props.comment._id ? (
                        <div>
                            <input type="text"/><button onClick={() => props.setReplyCommentId(null)}>Cancel</button>
                        </div>    
                        ) : (
                        <button onClick={() => props.setReplyCommentId(props.comment.id)}>Reply</button>
                    )} */}
        </div>
    )
}

export default Comment;