import { motion } from 'framer-motion';
import Backdrop from '../Backdrop/Backdrop';

import styles from './Modal.module.scss'

interface ModaLProps {
    children?: React.ReactNode
    handleClose: () => void;
}

const dropIn = {
    hidden: {
        y: -75,
        opacity: 0,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.2,
        }
    },
    exit: {
        opacity: 0,
    }
}

function Modal({children, handleClose}: ModaLProps) {
    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className={styles['modal']}
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            > 
                {children}
            </motion.div>
         </Backdrop>
    )
}

export default Modal