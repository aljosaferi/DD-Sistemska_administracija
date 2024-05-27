import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';

import classes from './Addphoto.module.css';

function AddPhoto(props) {
    const userContext = useContext(UserContext); 
    const[name, setName] = useState('');
    const[description, setDescription] = useState('');
    const[file, setFile] = useState('');
    const[uploaded, setUploaded] = useState(false);
    const[preview, setPreview] = useState(null);

    async function onSubmit(e){
        e.preventDefault();

        if(!name){
            alert("Vnesite ime!");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', file);
        const res = await fetch('http://localhost:3001/photos', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await res.json();

        setUploaded(true);
    }

    function onFileChange(e) {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <div className={classes.addPhotoContainer}>
            <div className={classes.photoSelection} style={preview ? {border: 'none'} : {}}>
                <label htmlFor="file">
                    {preview ? <img src={preview} alt="Selected" /> : <div className={classes.photoPlaceholder}>Click to select a photo</div>}
                </label>
                <input type="file" id="file" onChange={onFileChange} style={{display: 'none'}}/>
            </div>
            <div className={classes.photoDetails}>
                <form className={classes.formGroup} onSubmit={onSubmit}>
                    {!userContext.user ? <Navigate replace to="/login" /> : ""}
                    {uploaded ? <Navigate replace to="/login" /> : ""}
                    <input type="text" className={classes.formControl} name="ime" placeholder="Image name" value={name} onChange={(e)=>{setName(e.target.value)}}/>
                    <input type="text" className={classes.formControl} name="description" placeholder="Image description" value={description} onChange={(e)=>{setDescription(e.target.value)}}/>
                    <input className={classes.btnPrimary} type="submit" name="submit" value="Upload" />
                </form>
            </div>
        </div>
    )
}

export default AddPhoto;