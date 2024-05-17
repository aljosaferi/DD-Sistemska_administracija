import { useContext } from "react";
import { UserContext } from "../../userContext";
import { Link } from "react-router-dom";

import styles from './Sidebar.module.css'

function Sidebar(props) {
    const userContext = useContext(UserContext)
    return (
        <div className={styles['sidebar-container']}>
            <nav>
                <div className={styles["title"]}>
                    <li><Link to='/'><h1><div className={styles["logo-title"]}><i className={`fa-regular fa-images ${styles['title-icon']}`} /><label>{props.title}</label></div></h1></Link></li>
                </div>
                <div className={styles["user"]}>
                    {userContext.user && 
                        <>
                            <li><Link to='/profile'><div className={styles["navigation"]}><i className={`fa-regular fa-user ${styles['nav-icon']}`} /><label>Profile</label></div></Link></li>
                            <li><Link to='/publish'><div className={styles["navigation"]}><i className={`fa-solid fa-upload ${styles['nav-icon']}`} /><label>Publish</label></div></Link></li>
                        </>
                    }
                </div>
                <div className={styles["login"]}>
                    {userContext.user ? 
                        <li><Link to='/logout'><div className={`${styles['navigation']} ${styles['logout']}`}><i className={`fa-solid fa-right-from-bracket ${styles['nav-icon']}`} /><label>Logout</label></div></Link></li>
                    :
                        <>
                            <li><Link to='/login'>Login</Link></li>
                            <li><Link to='/register'>Register</Link></li>
                        </>
                    }    
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;