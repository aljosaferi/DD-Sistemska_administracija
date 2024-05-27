import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

import classes from './Profile.module.css';


function Profile(){
    const userContext = useContext(UserContext); 
    const [profile, setProfile] = useState({});
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(function(){
     const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
            console.log(data);
        }
        getProfile();
    }, []);

const [file, setSelectedFile] = useState(null);

function onFileChange(event) {
    setSelectedFile(event.target.files[0]);
};

const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch("http://localhost:3001/photos/uploadProfilePhoto", {
        method: 'POST',
        body: formData,
        credentials: "include"
    });
    const data = await res.json();
    setProfile(prevProfile => ({...prevProfile, profilePicturePath: data.profilePicturePath}));
};

return (
    <div className={classes.userProfileMainDiv} style={{display: 'flex', flexDirection: 'row', marginLeft: '20%'}}>
        <div className={classes.pfpDiv} style={{marginRight: '20px'}}>
            <label htmlFor="file">
                <img src={"http://localhost:3001/" + profile.profilePicturePath} alt="Profile" style={{borderRadius: '50%', width: '100%'}} />
            </label>
            <input type="file" id="file" onChange={onFileChange} style={{display: 'none'}}/>
        </div>
        <div className={classes.userInfoDiv}>
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            <h1>User profile</h1>
            <div style={{display: 'flex', flexDirection: 'row',}}>
                <p>Username: {profile.username}</p>
                <p style={{marginLeft: '10%'}}>Email: {profile.email}</p>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <p>Number of posts: {profile.numberOfPosts}</p>
                <p>Number of comments: {profile.numberOfComments}</p>
                <p>Number of likes: {profile.totalLikes}</p>
            </div>
            <button onClick={onFileUpload} disabled={!file} className={classes.buttonStyle}>Update</button>
        </div>
    </div>
);
}

export default Profile;