import { motion } from 'framer-motion';

import styles from './Button.module.scss'

interface ButtonProps {
    type: "primary" | "secondary" | "tertiary";
    children?: React.ReactNode;
    disabled?: boolean;
    width?: string | number;
    padding?: string | number;
    onClick?: () => void;
}

function Button({
    type,
    children,
    disabled,
    width,
    padding = "0.5rem",
    onClick
}: ButtonProps) {
    return (
        <motion.button
            whileHover={disabled ? {} : {scale: 1.02}}
            whileTap={disabled ? {} : {scale: 0.98}}
            className={styles[type]} 
            disabled={disabled} 
            onClick={onClick}
            style={{ width: width, padding: padding }}
        >
            {children}
            </motion.button>
    );
}

export default Button;