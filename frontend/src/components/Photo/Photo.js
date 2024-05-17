import styles from './Photo.module.css';
import moment from 'moment';
import { useContext, useState } from 'react';
import { UserContext } from '../../userContext';

import PhotoDetails from '../PhotoDetails/PhotoDetails';

moment.updateLocale('en', {
    relativeTime: {
        past: '%s ago',
        s: '%ds',
        ss: '%ds',
        m: '%dm',
        mm: '%dm',
        h: '%dh',
        hh: '%dh',
        d: '%dd',
        dd: '%dd',
        w: '%dw',
        ww: '%dw',
        M: '%dM',
        MM: '%dM',
        y: '%dy',
        yy: '%dy'
    }
});


function Photo(props){
    const userContext = useContext(UserContext);

    const [likes, setLikes] = useState(props.photo.likes);
    const [hasLiked, setHasLiked] = useState(userContext.user && props.photo.likedBy.includes(userContext.user._id));
    const [hasReported, setHasReported] = useState(false)
    const [modalState, setModalState] = useState('modal-closed');

    const likePhoto = async () => {
        if(!userContext.user) return 

        if(hasLiked){
            setLikes(likes - 1);
            setHasLiked(false);
        }else{
            setLikes(likes + 1);
            setHasLiked(true);
        }
        try {
            const CSRFres = await fetch("http://" + process.env.REACT_APP_IP_ADDY + ":3001/getCSRFToken", {
            credentials: "include",
            });
            const CSRFtoken = await CSRFres.json();

            const response = await fetch(`http://${process.env.REACT_APP_IP_ADDY}:3001/photos/${props.photo._id}/like`, {
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
    };

    const reportPhoto = async () => {
        setHasReported(true);

        const CSRFres = await fetch("http://" + process.env.REACT_APP_IP_ADDY + ":3001/getCSRFToken", {
            credentials: "include",
            });
            const CSRFtoken = await CSRFres.json();

        fetch(`http://${process.env.REACT_APP_IP_ADDY}:3001/photos/${props.photo._id}/flag`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': CSRFtoken.CSRFToken
                }
        });
    }

    const toggleModal = () => {
        if(modalState === 'modal-closed') {
            setModalState('modal-opened')
        } else {
            setModalState('modal-closed')
        }
    }

    if(hasReported) {
        return null
    }

    return (
        <div className={styles['photo-container']}>
            <div className={styles['info']}>
                <div className={styles['user-info']}>
                    <div className={styles['avatar']}>
                        <img src={"http://" + process.env.REACT_APP_IP_ADDY + ":3001/images/defaultAvatar"} alt="Avatar"/>
                    </div>
                    <h3>{props.photo.postedBy.username}</h3><label>•</label><h4>{props.photo.name}</h4>
                </div>
                <h5>{moment(props.photo.created).fromNow()}</h5>
            </div>
            <div className={styles['image']}>
                <img src={"http://" + process.env.REACT_APP_IP_ADDY + ":3001"+props.photo.path} alt={props.photo.name}/>
            </div>
            <div className={styles['interactions']}>
                <div className={styles['like-comment-report']}>
                    <div className={styles['like-comment']}>
                        <i className={`${hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart icon ${hasLiked ? 'icon-secondary' : ''} ${styles['like-icon']}`} onClick={likePhoto} title="Like"/>

                        <input type="checkbox" id={`modal-${props.photo._id}`} />    
                        <label htmlFor={`modal-${props.photo._id}`} className="example-label">
                            <i className={`fa-regular fa-comments icon ${styles['comments-icon']}`} onClick={toggleModal} title="Comments"/>
                        </label>
                        <label htmlFor={`modal-${props.photo._id}`} className="modal-background"/>
                        <div className="modal">
                            <PhotoDetails photoId={props.photo._id}/>
                        </div>
                    
                    </div>
                    <i className={`fa-regular fa-flag icon ${styles['report-icon']}`} onClick={reportPhoto} title="Report"/>
                </div>
                <label>{likes} {likes === 1 ? 'like' : 'likes'}</label>
            </div>
        </div>
    );
}

export default Photo;