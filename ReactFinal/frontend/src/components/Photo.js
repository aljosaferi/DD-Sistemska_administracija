import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { useEffect } from 'react';

import Comments from './Comments';
import OpenedPost from './OpenedPost';
import classes from './Photo.module.css';

import Modal from 'react-modal';
Modal.setAppElement('#root');

function Photo(props){
    const userContext = useContext(UserContext);
    
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    return (
        <div className={classes.photoDiv2}>
            <div className={classes.photoHolder} onClick={openModal}>
                <img className={classes.image} src={"http://localhost:3001/"+props.photo.path} alt={props.photo.name}/>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Photo Modal"
                style={{
                    content: {
                        width: '70%',
                        height: '70%',
                        margin: 'auto',
                        backgroundColor: '#EDE8F5',
                        borderRadius: '10px',
                        border: '1px solid #212f64'
                    },
                }}
            >   
                
                <OpenedPost photo={props.photo} updatePhotoLikes={props.updatePhotoLikes} updatePhotoComments={props.updatePhotoComments}/>
            </Modal>
        </div>
        
    );
}

export default Photo;