import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../userContext'
import Photo from '../Photo/Photo';

import styles from './Photos.module.css'

function Photos(){
    const userContext = useContext(UserContext)
    const [photos, setPhotos] = useState([]);
    const [sortBy, setSortBy] = useState('newest-first')
    useEffect(function(){
        const getPhotos = async function(){
            const fetchOptions = {
                method: 'GET'
            }
            if(userContext.user && userContext.user._id) {
                fetchOptions.credentials = 'include';
            }
            const res = await fetch(`http://${process.env.REACT_APP_IP_ADDY}:3001/photos?sortBy=${sortBy}`, fetchOptions);
            const data = await res.json();
            setPhotos(data);
        }
        getPhotos();
    }, [sortBy]);

    const newestFirst = 'newest-first';
    const hotness = 'hotness'

    return(
        <>
            <div className={styles['top-container']}>
                <div className={styles['title']}>
                    <h2>Photos:</h2>
                </div>
                <div className={styles['sort']}>
                    <h5>sort:</h5>
                    <div className={styles['sort-buttons']}>
                        <button onClick={() => {setSortBy(newestFirst)}} disabled={sortBy === newestFirst}><i className="fa-regular fa-calendar-days"/><label>fresh</label></button>
                        <button onClick={() => {setSortBy(hotness)}} disabled={sortBy === hotness}><i className="fa-solid fa-fire" /><label>hot</label></button>
                    </div>
                </div>
            </div>
            <div className={styles['photos-container']}>
                {photos.map(photo=>(<Photo photo={photo} key={photo._id} setPhotos={setPhotos}></Photo>))}
            </div>
        </>
    );
}

export default Photos;