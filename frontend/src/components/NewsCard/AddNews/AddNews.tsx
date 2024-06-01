import { motion } from 'framer-motion';

import styles from './AddNews.module.scss';
import Button from '../../Button/Button';

interface AddNewsProps {
    handleClose: () => void;
}

function AddNews({ handleClose } : AddNewsProps) {

    return (
        <div className={styles['container']}>
            <div className={styles['header']}>
                <h1>Dodaj novico</h1>
                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                >
                    <i className="fa-solid fa-xmark"/>
                </motion.div>
                
            </div>
            <div className={styles['title']}>
                <input type='text' placeholder='Naslov' required/>
            </div>
            <div className={styles['content']}>
                <textarea placeholder='Vsebina' required/>
            </div>
            <div className={styles['submit']}>
                <Button type="primary" padding={'0.7rem'}>
                    Dodaj
                    <i className="fa-solid fa-paper-plane"></i>
                </Button>
            </div>
        </div>
    )
}

export default AddNews;