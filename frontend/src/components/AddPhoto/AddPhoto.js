import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../../userContext';

import styles from './AddPhoto.module.css'

function AddPhoto(props) {
    const userContext = useContext(UserContext); 
    const[name, setName] = useState('');
    const[description, setDescription] = useState('');
    const[file, setFile] = useState('');
    const[uploaded, setUploaded] = useState(false);

    async function onSubmit(e){
        e.preventDefault();

        if(!name){
            alert("Enter image name");
            return;
        }

        if(!description){
            alert("Enter image description");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', file);
        const CSRFres = await fetch("http://localhost:3001/getCSRFToken", {
            credentials: "include",
        });
        const CSRFtoken = await CSRFres.json();

        const res = await fetch('http://localhost:3001/photos', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRF-Token': CSRFtoken.CSRFToken
            },
            body: formData
        });
        const data = await res.json();

        setUploaded(true);
    }

    return (
        <>
            <div className={styles['top-container']}>
                <div className={styles['title']}>
                    <h2>Publish photo:</h2>
                </div>
            </div>
            <div className={styles['publish-container']}>
                <div className={styles['publish-info']}>
                    <form className={styles['form-group']} onSubmit={onSubmit}>
                        {!userContext.user ? <Navigate replace to="/login" /> : ""}
                        {uploaded ? <Navigate replace to="/" /> : ""}

                        <input type="text" className="form-control" name="name" placeholder="Image name" value={name} onChange={(e)=>{setName(e.target.value)}}/>

                        <input type="text" className="form-control" name="description" placeholder="Image description" value={description} onChange={(e)=>{setDescription(e.target.value)}}/>

                        <input type="file" id="file" onChange={(e)=>{setFile(e.target.files[0])}}/>

                        <input className="btn btn-primary" type="submit" name="submit" value="Naloži" />
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddPhoto;