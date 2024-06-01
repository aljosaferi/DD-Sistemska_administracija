import { motion } from 'framer-motion';

import styles from './DeletePrompt.module.scss';
import Button from '../Button/Button';

interface DeletePromptProps {
    handleClose: () => void;
    heading: string;
    content: string;
}

function DeletePrompt({ handleClose, heading, content } :  DeletePromptProps) {

    return (
        <div className={styles['container']}>
            <div className={styles['header']}>
                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                >
                    <i className="fa-solid fa-xmark"/>
                </motion.div>
            </div>

            <div className={styles['heading']}>
                <h1>{heading}</h1>
            </div>
            <div className={styles['content']}>
                {content}
            </div>
            <div className={styles['submit']}>
                <Button type="primary" padding={'0.7rem'}>
                    Izbriši
                    <i className="fa-solid fa-trash-can"/>
                </Button>
                <Button type="tertiary" padding={'0.7rem'}>
                    Prekliči
                    <i className="fa-solid fa-xmark"/>
                </Button>
            </div>
        </div>
    )
}

export default DeletePrompt;