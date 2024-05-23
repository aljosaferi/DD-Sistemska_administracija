import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../userContext';
import { Navigate } from 'react-router-dom';

import styles from './Profile.module.css'

function Profile(){
    const userContext = useContext(UserContext); 
    const [profile, setProfile] = useState({});

    useEffect(function(){
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    return (
        <>
            <div className={styles['top-container']}>
                <div className={styles['title']}>
                    <h2>Profile:</h2>
                </div>
            </div>
            <div className={styles['profile-container']}>
                <div className={styles['profile-info']}>
                    {!userContext.user ? <Navigate replace to="/login" /> : ""}
                    <div className={styles['avatar']}>
                        <img src={"http://localhost:3001/images/defaultAvatar"} alt="Avatar"/>
                    </div>
                    <div className={styles['other']}>
                        <div className={styles['profile-info-line']}>
                            <h3>Username: </h3><h4>{profile && profile.username}</h4>
                        </div>
                        <div className={styles['profile-info-line']}>
                            <h3>Posts: </h3><h4>{profile && profile.photos && profile.photos.length}</h4>
                        </div>
                        <div className={styles['profile-info-line']}>
                            <h3>Comments: </h3><h4>{profile && profile.comments &&  profile.comments.length}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;