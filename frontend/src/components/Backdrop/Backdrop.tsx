import { useEffect } from 'react';
import { motion } from "framer-motion";
import ReactDOM from 'react-dom';

import styles from './Backdrop.module.scss';

interface BackdropProps {
    children: React.ReactNode;
    onClick?: () => void;
}

function Backdrop({children, onClick}: BackdropProps) {
    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    return ReactDOM.createPortal(
        <motion.div 
            className={styles['backdrop']}
            onClick={onClick}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            {children}
        </motion.div>,
        document.body // This is where the backdrop will be rendered
    );
}

export default Backdrop;