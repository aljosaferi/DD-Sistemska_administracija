import { useState, useContext } from 'react' 
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import { Turn as Hamburger } from 'hamburger-react';

import styles from './Navbar.module.scss'; 
import { motion, AnimatePresence } from 'framer-motion';
import Backdrop from '../Backdrop/Backdrop';
import Authenticate from '../Authenticate/Authenticate';
import { UserContext } from '../../userContext';


const dropIn = {
    hidden: {
        x: "100vw",
    },
    visible: {
        x: "0",
        transition: {
            duration: 0.2
        }
    },
    exit: {
        x: "100vw",
    }
}

function Navbar() {
    const[isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    const[isAuthenticateOpen, setIsAuthenticateOpen] = useState(false);
    const openAuthenticate = () => setIsAuthenticateOpen(true);
    const closeAuthenticate = () => setIsAuthenticateOpen(false);

    const userContext = useContext(UserContext);
    const navigate = useNavigate(); 

    return (
        <>
        <nav className={styles['navbar']}>
            <div className={styles['left']}>
                <div className={styles['logo-link']}>
                    <Link to="/">
                        <div className={styles['logo']}>
                            <img className={styles['logo-image']} src="/images/salad-white.png" alt="logo"/>    
                            <div className={styles['logo-text']}>
                                <h1>Študentska</h1>
                                <h1>prehrana</h1>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <ul className={styles['nav-buttons']}>
                <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? styles['active'] : ''}
                >
                    <li>
                        <h2>
                            <i className="fa-solid fa-house"/>
                            <span className={styles['nav-text']}>Domov</span>
                        </h2>
                    </li>
                </NavLink>
                <NavLink 
                    to="/restaurants" 
                    className={({ isActive }) => isActive ? styles['active'] : ''}
                >
                    <li>
                        <h2>
                            <i className="fa-solid fa-utensils"/>
                            <span className={styles['nav-text']}>Restavracije</span>
                        </h2>
                    </li>
                </NavLink>
                <NavLink 
                    to="/map" 
                    className={({ isActive }) => isActive ? styles['active'] : ''}
                >
                    <li>
                        <h2>
                            <i className="fa-solid fa-map-location-dot"/>
                            <span className={styles['nav-text']}>Zemljevid</span>
                        </h2>
                    </li>
                </NavLink>
            </ul>
            <div className={styles['user']}>
                {userContext.user ?
                    <div className={styles['user-profile']}>
                        <div className={styles['image-username']} onClick={() => navigate('/myProfile')}>
                            <img src={`http://${process.env.REACT_APP_URL}:3001${userContext.user.profilePhoto.imagePath}`} alt="Avatar"/>
                            <h2>{userContext.user.username}</h2>
                        </div>
                        <motion.div
                            whileHover={{scale: 1.05}}
                            whileTap={{ scale: 0.9 }}
                            className={styles['logout-container-top']}
                            onClick={() => {userContext.setUserContext(null); navigate('/')}}
                        >
                            <i className="fa-solid fa-right-from-bracket"/>
                        </motion.div>    
                    </div>
                :
                    <Button type="secondary" onClick={openAuthenticate}>Prijava</Button>
                }
            </div>
        </nav>
        <motion.div
            whileHover={{scale: 1.05}}
            whileTap={{ scale: 0.9 }}
            className={`${styles['menu']} ${isMenuOpen ? styles['open'] : ''}`}
        >
            <Hamburger 
                toggled={isMenuOpen}
                toggle={setIsMenuOpen}
                distance="md" 
                rounded
            />
        </motion.div>

        {/* Slide-out menu */}
        <AnimatePresence>
            {isMenuOpen ?
            <Backdrop onClick={closeMenu}>
                <motion.div 
                    className={styles['mobile-nav']}
                    variants={dropIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                >
                <div className={styles['mobile-top-buffer']}>
                    <img className={styles['mobile-logo-image']} src="/images/salad.png" alt="logo"/>
                </div>
                <div className={styles['mobile-buttons']}>
                    <div className={styles['mobile-top']}>
                        <ul className={styles['top']}>
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => isActive ? styles['active'] : ''}
                                onClick={closeMenu}
                            >
                                <li>
                                    <h2>
                                    <i className="fa-solid fa-house"/>
                                    <span className={styles['mobile-nav-text']}>Domov</span>
                                    </h2>
                                </li>
                            </NavLink>
                            <NavLink 
                                to="/restaurants" 
                                className={({ isActive }) => isActive ? styles['active'] : ''}
                                onClick={closeMenu}
                            >
                                <li>
                                    <h2>
                                    <i className="fa-solid fa-utensils"/>
                                    <span className={styles['mobile-nav-text']}>Restavracije</span>
                                    </h2>
                                </li>
                            </NavLink>
                            <NavLink 
                                to="/map" 
                                className={({ isActive }) => isActive ? styles['active'] : ''}
                                onClick={closeMenu}
                            >
                                <li>
                                    <h2>
                                    <i className="fa-solid fa-map-location-dot"/>
                                    <span className={styles['mobile-nav-text']}>Zemljevid</span>
                                    </h2>
                                </li>
                            </NavLink>
                        </ul>
                    </div>
                    <div className={styles['bottom']}>
                        {userContext.user ?
                            <div className={styles['user-profile']}>
                                <div className={styles['username-photo']} onClick={() => {navigate('/myProfile'); closeMenu();}}>
                                    <img src={`http://${process.env.REACT_APP_URL}:3001${userContext.user.profilePhoto.imagePath}`} alt="Avatar"/>
                                    <h2>{userContext.user.username}</h2>    
                                </div>
                                <motion.div
                                    whileHover={{scale: 1.05}}
                                    whileTap={{ scale: 0.9 }}
                                    className={styles['logout-container']}
                                    onClick={() => {userContext.setUserContext(null); ; navigate('/'); }}
                                >
                                    <i className="fa-solid fa-right-from-bracket"/>
                                </motion.div>
                            </div>
                        :
                        <Link to="/login" onClick={closeMenu}>
                            <Button type="primary" width={"200px"} onClick={openAuthenticate}>Prijava</Button>
                        </Link>
                        }
                    </div>
                </div>
                </motion.div>
            </Backdrop>
            : null
            }
        </AnimatePresence>

        {/* Authenticate modal */}    
        <AnimatePresence>
            {isAuthenticateOpen ?
                <Authenticate handleClose={closeAuthenticate}/>
            :
                null
            }
        </AnimatePresence>
        </>
    );
}

export default Navbar;

