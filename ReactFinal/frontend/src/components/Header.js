import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';

import classes from "./Header.module.css";

function Header(props) {
    const [activeLink, setActiveLink] = useState('/');
    const [profile, setProfile] = useState({});

    useEffect(function(){
     const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
            console.log(data);
        }
        getProfile();
    }, []);

    const handleClick = (path) => {
        setActiveLink(path);

    }

    return (
        <div className={classes.sidebar}>
            <div className={classes.fixedElement}>
                <UserContext.Consumer>
                    {context => (
                        context.user ?
                        <div className={classes.profilePic}>
                            <img src={"http://localhost:3001/" + profile.profilePicturePath} />
                            {context.user.username}
                        </div>
                            :
                            null
                    )}
                </UserContext.Consumer>
                <nav style={{width: '100%'}}>
                    <Link to='/'>
                        <div className={classes.buttonDiv}><button className={activeLink === '/' ? classes.active : ''} onClick={() => handleClick('/')}>Home</button></div>
                    </Link>
                    <UserContext.Consumer>
                        {context => (
                            context.user ?
                                <>
                                    <Link to='/publish'>
                                        <div className={classes.buttonDiv}><button className={activeLink === '/publish' ? classes.active : ''} onClick={() => handleClick('/publish')}>Publish</button></div>
                                    </Link>
                                    <Link to='/profile'>
                                        <div className={classes.buttonDiv}><button className={activeLink === '/profile' ? classes.active : ''} onClick={() => handleClick('/profile')}>Profile</button></div>
                                    </Link>
                                    <Link to='/logout'>
                                        <div className={classes.buttonDiv}><button className={activeLink === '/logout' ? classes.active : ''} onClick={() => handleClick('/logout')}>Logout</button></div>
                                    </Link>
                                </>
                            :
                                <>
                                    <Link to='/login'>
                                        <div className={classes.buttonDiv}><button className={activeLink === '/login' ? classes.active : ''} onClick={() => handleClick('/login')}>Login</button></div>
                                    </Link>
                                    <Link to='/register'>
                                        <div className={classes.buttonDiv}><button className={activeLink === '/register' ? classes.active : ''} onClick={() => handleClick('/register')}>Register</button></div>
                                    </Link>
                                </>
                        )}
                    </UserContext.Consumer>
                </nav>
            </div>
        </div >
    );
}

export default Header;