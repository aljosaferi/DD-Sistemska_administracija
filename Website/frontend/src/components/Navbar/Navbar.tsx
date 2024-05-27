import { useState } from 'react' 
import { Link, NavLink } from 'react-router-dom';
import Button from '../Button/Button';
import { Turn as Hamburger } from 'hamburger-react';

import './Navbar.scss'; 
import { motion, AnimatePresence } from 'framer-motion';
import Backdrop from '../Backdrop/Backdrop';


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

    return (
        <>
        <nav className="navbar">
            <div className="left">
                <div className="logo-link">
                    <Link to="/">
                        <div className="logo">
                            <img className="logo-image" src="/images/salad-white.png" alt="logo"/>    
                            <div className="logo-text">
                                <h1>Študentska</h1>
                                <h1>prehrana</h1>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <ul className="nav-buttons">
                <NavLink to="/">
                    <li>
                        <h2>
                            <i className="fa-solid fa-house"/>
                            <span className="nav-text">Domov</span>
                        </h2>
                    </li>
                </NavLink>
                <NavLink to="/restaurants">
                    <li>
                        <h2>
                            <i className="fa-solid fa-utensils"/>
                            <span className="nav-text">Restavracije</span>
                        </h2>
                    </li>
                </NavLink>
                <NavLink to="/map">
                    <li>
                        <h2>
                            <i className="fa-solid fa-map-location-dot"/>
                            <span className="nav-text">Zemljevid</span>
                        </h2>
                    </li>
                </NavLink>
            </ul>
            <div className="user">
                <Link to="/login">
                    <Button type="secondary">Prijava</Button>
                </Link>
            </div>
        </nav>

        <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
            <Hamburger 
            toggled={isMenuOpen}
            toggle={setIsMenuOpen}
            distance="md" 
            rounded/>
        </div>


        <AnimatePresence>
            {isMenuOpen ?
            <Backdrop onClick={closeMenu}>
                <motion.div 
                    className="mobile-nav"
                    variants={dropIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <div className="mobile-top-buffer">
                        <img className="mobile-logo-image" src="/images/salad.png" alt="logo"/>
                    </div>
                    <div className="mobile-buttons">
                        <div className="mobile-top">
                            <ul className="top">
                                <NavLink to="/" onClick={closeMenu}>
                                    <li>
                                        <h2>
                                            <i className="fa-solid fa-house"/>
                                            <span className="mobile-nav-text">Domov</span>
                                        </h2>
                                    </li>
                                </NavLink>
                                <NavLink to="/restaurants" onClick={closeMenu}>
                                    <li>
                                        <h2>
                                            <i className="fa-solid fa-utensils"/>
                                            <span className="mobile-nav-text">Restavracije</span>
                                        </h2>
                                    </li>
                                </NavLink>
                                <NavLink to="/map" onClick={closeMenu}>
                                    <li>
                                        <h2>
                                            <i className="fa-solid fa-map-location-dot"/>
                                            <span className="mobile-nav-text">Zemljevid</span>
                                        </h2>
                                    </li>
                                </NavLink>
                            </ul>
                        </div>
                        <div className='bottom'>
                            <Link to="/login" onClick={closeMenu}>
                                <Button type="primary" width={"200px"}>Prijava</Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </Backdrop>
            : null
            }
        </AnimatePresence>
        </>
    );
}

export default Navbar;

