import { useEffect, useRef, } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

import styles from './Reveal.module.scss'

interface RevealProps {
    children: React.ReactNode;
    direction?: "left" | "right" | "top" | "bottom" | "none";
    duration?: number
    delay?: number
}

function Reveal({
    children,
    direction = "left",
    duration = 0.5,
    delay = 0
    }
    : RevealProps) {

   const ref = useRef(null)    
   const isInView = useInView(ref, { once: true });

   const mainControls = useAnimation();
   
   useEffect(() => {
        if(isInView) {
            mainControls.start("visible");
        } 
   }, [isInView])

    return (
        <motion.div
            className={styles['container']}
            ref={ref}
            variants={{
                hidden: { 
                    opacity: 0, 
                    ...(direction !== "none" && {
                        x: direction === "left" ? -75 : direction === "right" ? 75 : 0,
                        y: direction === "top" ? -75 : direction === "bottom" ? 75 : 0
                    })
                },
                visible: { 
                    opacity: 1, x: 0, y: 0
                },
            }}
            initial="hidden"
            animate={mainControls}
            transition= {{
                duration: duration,
                delay: delay
            }}
        >
            {children}
        </motion.div>
    )
}

export default Reveal