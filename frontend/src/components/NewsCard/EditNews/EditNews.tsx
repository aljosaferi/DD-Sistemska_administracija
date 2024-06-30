import React, { useState } from 'react';
import { motion } from 'framer-motion';

import styles from './EditNews.module.scss';
import Button from '../../Button/Button';

interface EditNewsProps {
    handleClose: () => void;
}

function EditNews({ handleClose } : EditNewsProps) {
    const [isEdited, setIsEdited] = useState(false);

    const handleChange = () => {
        setIsEdited(true);
      };

    return (
        <div className={styles['container']}>
            <div className={styles['header']}>
                <h1>Uredi novico</h1>
                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                >
                    <i className="fa-solid fa-xmark"/>
                </motion.div>
                
            </div>
            <div className={styles['title']}>
                <input type='text' placeholder='Naslov' onChange={handleChange} required/>
            </div>
            <div className={styles['content']}>
                <textarea placeholder='Vsebina' onChange={handleChange} required/>
            </div>
            <div className={styles['submit']}>
                <Button type="primary" padding={'0.7rem'} disabled={!isEdited}>
                    Shrani spremembe
                    <i className="fa-solid fa-check"/>
                </Button>
            </div>
        </div>
    )
}

export default EditNews;