import { useState, useEffect } from 'react';
import Photo from './Photo';

import classes from './Photos.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'

function Photos() {
    const [photos, setPhotos] = useState([]);
    const [hoveredPhoto, setHoveredPhoto] = useState(null);
    const [sortOption, setSortOption] = useState('time');

    useEffect(function () {
        const getPhotos = async function () {
            let url = "http://localhost:3001/photos";
            if (sortOption === 'popularity') {
                url = "http://localhost:3001/photos/topPhotos";
            }
            const res = await fetch(url);
            const data = await res.json();
            if (Array.isArray(data)) {
                setPhotos(data);
            } else {
                console.error('Error: expected array from server, got', data);
            }
        }
        getPhotos();
    }, [sortOption]);

    function updatePhotoLikes(photoId, newLikes) {
        setPhotos(prevPhotos => prevPhotos.map(photo => 
            photo._id === photoId ? { ...photo, likes: newLikes } : photo
        ));
    }

    function updatePhotoComments(photoId, newComments) {
        setPhotos(prevPhotos => prevPhotos.map(photo => 
            photo._id === photoId ? { ...photo, numberOfComments: newComments } : photo
        ));
    }

    return (
        <div className="mainPhotoDiv" style={{ width: '100%', height: '100%', /*backgroundColor: '#EDE8F5'*/backgroundColor: 'red'}}>
            <select className={classes.sortDropdown} value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="time">Sort by Time</option>
                <option value="popularity">Sort by Popularity</option>
            </select>
            <div className={classes.photoDiv}>
                {photos.map((photo, index) => (
                    <div
                        key={photo._id}
                        className={classes.photoWrapper}
                        onMouseEnter={() => setHoveredPhoto(index)}
                        onMouseLeave={() => setHoveredPhoto(null)}
                        style={hoveredPhoto === index ? { filter: 'brightness(60%)' } : {}}
                    >
                        <Photo photo={photo} updatePhotoLikes={updatePhotoLikes} updatePhotoComments={updatePhotoComments}/>
                        {hoveredPhoto === index && (
                            <div className={classes.photoInfo} style={{color: '#EDE8F5'}}>
                                <span>&#10084;</span> {photo.likes} <FontAwesomeIcon icon={faComment} /> {photo.numberOfComments}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Photos;