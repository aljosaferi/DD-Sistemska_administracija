import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../userContext';
import { Restaurant } from '../Restaurants/Restaurants';

import styles from './Profile.module.scss';
import { getApiCall, putApiCall } from '../../api/apiCalls';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import {motion } from 'framer-motion';
import Button from '../../components/Button/Button';
import axios from 'axios';

function Profile() {
    const navigate = useNavigate();
    const userContext = useContext(UserContext);

    const [username, setUsername] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isEdited, setIsEdited] = useState(false);


    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    
    useEffect(() => {
        if (!userContext.user) {
            navigate('/');
        }
        
        setUsername(userContext.user?.username)
        setEmail(userContext.user?.email)

        getApiCall(`http://${process.env.REACT_APP_URL}:3001/restaurants/from/${userContext.user?._id}`)
        .then(data =>  { setRestaurants(data) })
        .catch(error => console.log(error))

    }, [userContext.user, navigate]);

    const toggleEdit = () => {
        if(isOpenEdit) {
            setIsOpenEdit(false)
        } else {
            setIsOpenEdit(true)
        }
        setError("");
    }

    const handleChange = () => {
        setIsEdited(true);
    };

    async function Update(){
        const user = {
            username: username,
            email: email,
            ...(newPassword !== "" && { password: newPassword }),
        }

        try {

            const data = await putApiCall(`http://${process.env.REACT_APP_URL}:3001/users/${userContext.user?._id}`, user)

            if(data._id !== undefined){
                userContext.setUserContext(data);
                toggleEdit();
            } else {
                setUsername(userContext.user?.username);
                setEmail(userContext.user?.email);
                setNewPassword("");
                setIsEdited(false);
                setError("Something went wrong");
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setUsername(userContext.user?.username);
                setEmail(userContext.user?.email);
                setNewPassword("");
                setIsEdited(false);
                setError("Something went wrong");
            }
        }
    }

    return (
        <>
            <div className={styles['container']}>
                {userContext.user &&
                <div className={styles['card']}>
                    <div className={styles['card__img']}><svg xmlns="http://www.w3.org/2000/svg" width="100%"><rect fill="#ffffff" width="540" height="450"></rect><defs><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="100%" gradientTransform="rotate(222,648,379)"><stop offset="0" stop-color="#ffffff"></stop><stop offset="1" stop-color={userContext.user.pendingApproval === true ? "#808080" : "#FC726E"}></stop></linearGradient><pattern patternUnits="userSpaceOnUse" id="b" width="300" height="250" x="0" y="0" viewBox="0 0 1080 900"><g fill-opacity="0.5"><polygon fill="#444" points="90 150 0 300 180 300"></polygon><polygon points="90 150 180 0 0 0"></polygon><polygon fill="#AAA" points="270 150 360 0 180 0"></polygon><polygon fill="#DDD" points="450 150 360 300 540 300"></polygon><polygon fill="#999" points="450 150 540 0 360 0"></polygon><polygon points="630 150 540 300 720 300"></polygon><polygon fill="#DDD" points="630 150 720 0 540 0"></polygon><polygon fill="#444" points="810 150 720 300 900 300"></polygon><polygon fill="#FFF" points="810 150 900 0 720 0"></polygon><polygon fill="#DDD" points="990 150 900 300 1080 300"></polygon><polygon fill="#444" points="990 150 1080 0 900 0"></polygon><polygon fill="#DDD" points="90 450 0 600 180 600"></polygon><polygon points="90 450 180 300 0 300"></polygon><polygon fill="#666" points="270 450 180 600 360 600"></polygon><polygon fill="#AAA" points="270 450 360 300 180 300"></polygon><polygon fill="#DDD" points="450 450 360 600 540 600"></polygon><polygon fill="#999" points="450 450 540 300 360 300"></polygon><polygon fill="#999" points="630 450 540 600 720 600"></polygon><polygon fill="#FFF" points="630 450 720 300 540 300"></polygon><polygon points="810 450 720 600 900 600"></polygon><polygon fill="#DDD" points="810 450 900 300 720 300"></polygon><polygon fill="#AAA" points="990 450 900 600 1080 600"></polygon><polygon fill="#444" points="990 450 1080 300 900 300"></polygon><polygon fill="#222" points="90 750 0 900 180 900"></polygon><polygon points="270 750 180 900 360 900"></polygon><polygon fill="#DDD" points="270 750 360 600 180 600"></polygon><polygon points="450 750 540 600 360 600"></polygon><polygon points="630 750 540 900 720 900"></polygon><polygon fill="#444" points="630 750 720 600 540 600"></polygon><polygon fill="#AAA" points="810 750 720 900 900 900"></polygon><polygon fill="#666" points="810 750 900 600 720 600"></polygon><polygon fill="#999" points="990 750 900 900 1080 900"></polygon><polygon fill="#999" points="180 0 90 150 270 150"></polygon><polygon fill="#444" points="360 0 270 150 450 150"></polygon><polygon fill="#FFF" points="540 0 450 150 630 150"></polygon><polygon points="900 0 810 150 990 150"></polygon><polygon fill="#222" points="0 300 -90 450 90 450"></polygon><polygon fill="#FFF" points="0 300 90 150 -90 150"></polygon><polygon fill="#FFF" points="180 300 90 450 270 450"></polygon><polygon fill="#666" points="180 300 270 150 90 150"></polygon><polygon fill="#222" points="360 300 270 450 450 450"></polygon><polygon fill="#FFF" points="360 300 450 150 270 150"></polygon><polygon fill="#444" points="540 300 450 450 630 450"></polygon><polygon fill="#222" points="540 300 630 150 450 150"></polygon><polygon fill="#AAA" points="720 300 630 450 810 450"></polygon><polygon fill="#666" points="720 300 810 150 630 150"></polygon><polygon fill="#FFF" points="900 300 810 450 990 450"></polygon><polygon fill="#999" points="900 300 990 150 810 150"></polygon><polygon points="0 600 -90 750 90 750"></polygon><polygon fill="#666" points="0 600 90 450 -90 450"></polygon><polygon fill="#AAA" points="180 600 90 750 270 750"></polygon><polygon fill="#444" points="180 600 270 450 90 450"></polygon><polygon fill="#444" points="360 600 270 750 450 750"></polygon><polygon fill="#999" points="360 600 450 450 270 450"></polygon><polygon fill="#666" points="540 600 630 450 450 450"></polygon><polygon fill="#222" points="720 600 630 750 810 750"></polygon><polygon fill="#FFF" points="900 600 810 750 990 750"></polygon><polygon fill="#222" points="900 600 990 450 810 450"></polygon><polygon fill="#DDD" points="0 900 90 750 -90 750"></polygon><polygon fill="#444" points="180 900 270 750 90 750"></polygon><polygon fill="#FFF" points="360 900 450 750 270 750"></polygon><polygon fill="#AAA" points="540 900 630 750 450 750"></polygon><polygon fill="#FFF" points="720 900 810 750 630 750"></polygon><polygon fill="#222" points="900 900 990 750 810 750"></polygon><polygon fill="#222" points="1080 300 990 450 1170 450"></polygon><polygon fill="#FFF" points="1080 300 1170 150 990 150"></polygon><polygon points="1080 600 990 750 1170 750"></polygon><polygon fill="#666" points="1080 600 1170 450 990 450"></polygon><polygon fill="#DDD" points="1080 900 1170 750 990 750"></polygon></g></pattern></defs><rect x="0" y="0" fill="url(#a)" width="100%" height="100%"></rect><rect x="0" y="0" fill="url(#b)" width="100%" height="100%"></rect></svg></div>
                    <div className={styles['card__avatar']}>
                        <img className={styles['avatar-image']} src={`http://${process.env.REACT_APP_URL}:3001${userContext.user.profilePhoto.imagePath}`} alt="Avatar"/>
                    </div>
                    <div className={styles['card__title']}>
                        {isOpenEdit ?
                        <>
                            <div className={styles['username-input']}>
                                <input type='text' placeholder='Uporabniško ime' value={username} onChange={(e) => { setUsername(e.target.value); handleChange(); }} required/>
                            </div>
                            <div className={styles['email-input']}>
                                <input type='email' placeholder='E-pošta' value={email} onChange={(e) => { setEmail(e.target.value); handleChange(); }} required/>
                            </div>
                            <div className={styles['email-input']}>
                                <input type='password' placeholder='Novo geslo' onChange={(e) => { setNewPassword(e.target.value); handleChange(); }} required/>
                            </div>
                        </>
                        :
                            <>{userContext.user.username}</>
                        }
                    </div>
                    <div className={styles['card__subtitle']}>
                        {!isOpenEdit && (
                            userContext.user.userType === "admin" ? 
                                "Administrator" 
                            :
                                userContext.user.userType === "restaurantOwner" ?
                                    userContext.user.pendingApproval ? "Čaka na odobritev"  : "Lastnik restavracij" 
                                :
                                    "Uporabnik"
                            )
                        }
                    </div>
                    <label className={styles['error']}>
                        {error}
                    </label>

                    {isOpenEdit &&
                        <div className={styles['save-changes-button']}>
                            <Button type="primary" padding={"0.7rem"} disabled={!isEdited || !username} onClick={Update}>Shrani spremembe</Button>
                        </div>
                    }

                    {(userContext.user.userType === "restaurantOwner" && userContext.user.pendingApproval === false) || (userContext.user.userType === "admin" && restaurants.length > 0) ?
                        <div className={styles['restaurants-container']}>
                            <div className={styles['my-restaurants-top']}> 
                                <h1>Moje restavracije:</h1>
                                <Button type="primary" padding={"0.7rem"} onClick={() => navigate('/addRestaurant')}>Dodaj restavracijo</Button>
                            </div>
                            {restaurants && restaurants.map((restaurant) => (
                                <RestaurantCard restaurant={restaurant} key={restaurant.id}/>
                            ))}
                        </div>
                    :
                        null
                    }

                    <motion.div
                        className={styles['edit-profile-buttton']}
                        whileHover={{scale: 1.05}}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleEdit}
                    >
                        {isOpenEdit ?
                            <i className={`fa-solid fa-xmark ${styles['exit-edit-button']}`}></i>
                        :
                            <i className="fa-solid fa-pen"></i>
                        }
                    </motion.div>
                </div>
                }
            </div>
        </>
    )
}

export default Profile