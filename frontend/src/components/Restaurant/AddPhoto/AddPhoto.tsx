import { motion } from 'framer-motion';
import styles from './AddPhoto.module.scss';
import Button from '../../Button/Button';
import { useState, useEffect } from 'react';
import { postApiCall } from '../../../api/apiCalls';
import axios from 'axios';

interface AddMenuProps {
    restaurantId: string | undefined;
    handleClose: () => void;
    toggleTrigger: () => void;
}

function AddPhoto({ restaurantId, handleClose, toggleTrigger } : AddMenuProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Cleanup function to revoke the object URL
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    async function onSubmit(e){
        e.preventDefault();

        const formData = new FormData();
        if (file !== null) {
            formData.append('image', file);
        }

        try {
            const data = await postApiCall(`http://${process.env.REACT_APP_URL}:3001/photos/restaurantPhoto/${restaurantId}`, formData)

            if(data._id !== undefined){
                toggleTrigger()
                handleClose()
            } else {
                setFile(null);
                setError("Something went wrong");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    }

    return (
        <div className={styles['container']}>
            <form onSubmit={onSubmit}>
                <div className={styles['header']}>
                    <h1>Dodaj Sliko</h1>
                    <motion.div
                        whileHover={{scale: 1.05}}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                    >
                        <i className="fa-solid fa-xmark"/>
                    </motion.div>
                </div>
                <div className={styles['file-container']}>
                {previewUrl && <img src={previewUrl} alt="Preview" className={styles['preview']} />}
                <input type="file" id="file" onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                    }
                }}/>
                </div>
                <label className={styles['error']}>
                    {error}
                </label>
                <div className={styles['submit']}>
                    <Button type="primary" padding={'0.7rem'} disabled={!file}>
                        Dodaj sliko
                        <i className="fa-solid fa-check"/>
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddPhoto;