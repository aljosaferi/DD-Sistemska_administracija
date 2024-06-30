import React, { useState, useEffect, useContext } from 'react';
import styles from './Restaurant.module.scss'
import { useParams, useNavigate } from 'react-router-dom';


import { getApiCall, deleteApiCall, postApiCall } from '../../api/apiCalls';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from '../Modal/Modal';
import { UserContext } from '../../userContext';
import AddMenu from './AddMenu/AddMenu';
import axios from 'axios';
import DeletePrompt from '../DeletePrompt/DeletePrompt';
import AddPhoto from './AddPhoto/AddPhoto';


interface WorkingHours {
    day: string;
    open: string;
    close: string;
    _id: string;
    id: string;
}

interface Photo {
    _id: string;
    imagePath: string;
    __v: number;
}

interface Tag {
    name: string;
}

interface Menu {
    dish: string;
    sideDishes: string[];
    restaurant: string;
    tag: Tag[];
    _id: string;
    id: string;
}

interface Restaurant {
    _id: string;
    name: string;
    address: string;
    description: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    owner: string;
    photo: Photo;
    mealPrice: number;
    mealSurcharge: number;
    workingHours: WorkingHours[];
    menus: Menu[];
    tags: Tag[];
    ratings: any[];
    __v: number;
    averageRating: number;
    id: string;
}

function Restaurant() {
    const [restaurant, setRestaurant] = useState<Restaurant>();
    const [myRating, setMyRating] = useState(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [triggerEffect, setTriggerEffect] = useState(false);
    const navigate = useNavigate();

    const getStarStyle = (index) => {
        if (hoverRating !== null) {
            return index < hoverRating ? styles['checked'] : styles['un-checked'];
        } else if (myRating !== null) {
            return index < myRating ? styles['checked'] : styles['un-checked'];
        }

        return '';
    };

    const[isOpenDelete, setIsOpenDelete] = useState(false);
    const openDelete = () => setIsOpenDelete(true);
    const closeDelete = () => setIsOpenDelete(false);

    const [isOpenAddMenu, setIsOpenAddMenu] = useState(false);
    const closeAddMenu = () => {
        setIsOpenAddMenu(false);
    }

    const [isOpenAddPhoto, setIsOpenAddPhoto] = useState(false);
    const closeAddPhoto = () => {
        setIsOpenAddPhoto(false);
    }

    const { id } = useParams();

    const countRatings = (ratings: any[], rating: number) => {
        return ratings.filter(r => r.score === rating).length;
    }

    const userContext = useContext(UserContext);

    useEffect(() => {
        getApiCall(`http://${process.env.REACT_APP_URL}:3001/restaurants/${id}`)
        .then(data => {
            const userRating = data.ratings.find(rating => rating.user === userContext.user?.id);
            if (userRating) {
                setMyRating(userRating.score);
            }
            setRestaurant(data);
        })
        .catch(error => console.log(error))
    }, [triggerEffect]);

    const toggleTriggerEffect = () => {
        if(triggerEffect) {
            setTriggerEffect(false);
        } else {
            setTriggerEffect(true);
        }
    }

    async function deleteMenu(id) {
        const data = await deleteApiCall(`http://${process.env.REACT_APP_URL}:3001/menus/${id}`);
    
        if (restaurant?.menus) {
            const newMenus = restaurant.menus.filter(menu => menu._id !== id);
            setRestaurant((prev): Restaurant | undefined => {
                if (!prev) return undefined;
                return {
                    ...prev,
                    menus: newMenus
                };
            });
        }
    }

    
    async function deleteRestaurant() {
        const data = await deleteApiCall(`http://${process.env.REACT_APP_URL}:3001/restaurants/${restaurant?._id}`);
    
        navigate('/')
    }

    async function Rate(rating){
        try {

            const data = await postApiCall(`http://${process.env.REACT_APP_URL}:3001/restaurants/${restaurant?._id}/rate?score=${rating}`)

            if(data._id !== undefined){
                setMyRating(rating);
                toggleTriggerEffect();
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
               console.log("Error with axios")
            }
        }
    }

    return (
        <>
        <div className={styles["container"]}>
            {restaurant &&
            <div className={styles["restaurant"]}>
                <div className={styles["top"]}>
                    <div className={`${styles["image-container"]} ${restaurant.owner === userContext.user?._id ? styles["editable-image-container"] : ""}`} onClick={() => {
                        if (restaurant.owner === userContext.user?._id) {
                            setIsOpenAddPhoto(true);
                        }
                    }}>
                        <img src={`http://${process.env.REACT_APP_URL}:3001/${restaurant?.photo.imagePath}`} alt="Restavracija"/>
                        {/* <img src={`http://${process.env.REACT_APP_URL}:3001/images/defaultRestaurantPhoto`} alt="Restavracija"/> */}
                    </div>
                    <div className={styles["right"]}>
                        <div className={styles["text-container"]}>
                        <h1 style={{ fontSize: restaurant.name.length > 30 ? '2.5vw': '' }}>{restaurant.name}</h1>
                            <h2>{restaurant.address}</h2>
                        </div>
                        <div className={styles['rating-container']}>
                            <div className={styles['stars-container']} style={{ '--partial-percentage': `${(restaurant.averageRating % 1 * 100)}%` } as React.CSSProperties}>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index}>
                                        {restaurant?.averageRating === 0 ?
                                            <i className='fa-solid fa-star'/>
                                        :
                                            <i
                                                className={`fa-solid fa-star ${restaurant.averageRating >= (index + 1) ? styles['checked'] : ( (((index + 1) - restaurant.averageRating) >= 1 ) ? styles['un-checked'] : styles['partialy-checked'] )}`}
                                            />
                                        }
                                    </div>
                                ))}
                                <span className={styles['tooltip-text']}>
                                    {restaurant.ratings.length === 0 ?
                                        'Neocenjeno'
                                    :
                                        <>{restaurant.averageRating.toFixed(1)}<i className='fa-solid fa-star'/></>
                                    }
                                </span>
                            </div>
                                {restaurant.ratings.length === 0 ?
                                        null
                                    :
                                    <div className={styles['rating-count']}>
                                        {restaurant.ratings.length}x
                                    </div>
                                }
                        </div>
                        {restaurant.owner === userContext.user?._id &&
                            <div className={styles['delete-restaurant']}>
                                <motion.div
                                    className={styles['delete-container']}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={openDelete}
                                >
                                    <i className="fa-solid fa-trash-can"/> 
                                </motion.div>
                            </div>
                        }
                    </div>
                </div>
                <div className={styles['bottom']}>
                    <div className={styles['left']}>
                        <div className={styles['working-hours-container']}>
                            <h1>Delovni čas</h1>
                            <div className={styles['working-hours']}>
                                {restaurant.workingHours.map(({day, open, close, _id}) => (
                                    <div key={_id}>
                                        <strong>{day}:</strong> {open === 'Zaprto' ? 'Zaprto' : `${open} - ${close}`}
                                    </div>
                                ))}
                            </div>    
                        </div>
                        <div className={styles['rating-all']}>
                            <h1>Ocene</h1>
                            <div className={styles['rating-and-stars']}>
                                <div className={styles['rating-top']}>
                                    <div className={styles['rating-score']}>
                                        {restaurant.averageRating.toFixed(1)}
                                    </div>
                                    <div className={styles['rating-stars']}>
                                        {[5, 4, 3, 2, 1].map((n) => (
                                            <div key={n}>
                                                {Array.from({ length: n }, (_, i) => i + 1).map((i) => (
                                                    <span key={i}><i className='fa-solid fa-star'/></span>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles['rating-bars']}>
                                        {[5, 4, 3, 2, 1].map((n) => {
                                            const count = countRatings(restaurant.ratings, n);
                                            const percentage = restaurant.ratings.length ? (count / restaurant.ratings.length) * 100 : 0;
                                            return (
                                                <div key={n} className={styles['rating-bar']} style={{ '--percentage': `${percentage}%` } as React.CSSProperties}/>
                                            )
                                        })}
                                        <span className={styles['tooltip-text']}>
                                            {[5, 4, 3, 2, 1].map((n) => {
                                                const count = countRatings(restaurant.ratings, n);
                                                return (
                                                    <div key={n}>
                                                        <div className={styles['tooltip-stars']}>
                                                            <label>{n}</label>
                                                            <span><i className='fa-solid fa-star'/></span>
                                                        </div>
                                                        <div className={styles['tooltip-number']}>
                                                            {count}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles['rating-bottom']}>
                                    <div className={styles['rating-of']}>
                                        od 5
                                    </div>
                                    <div className={styles['total-ratings']}>
                                        {restaurant.ratings.length} ocen{restaurant.ratings.length === 1 ? 'a' : restaurant.ratings.length === 2 ? 'i' : ''}
                                    </div>
                                </div>
                            </div>
                            {userContext.user &&
                                <div className={styles['user-rate']}>
                                Oceni:
                                <div className={styles['user-rate-stars']}
                                    onMouseLeave={() => setHoverRating(null)}> {/* Reset hover state when not hovering */}
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <div key={index}
                                            onClick={() => Rate(index + 1)} 
                                            onMouseEnter={() => setHoverRating(index + 1)}> {/* Set hover state */}
                                            <i
                                                className={`fa-solid fa-star ${getStarStyle(index)}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            }   
                        </div>
                    </div>
                    <div className={styles["menus-container"]}>
                        <div className={styles["menus-title-container"]}>
                            <h1>Meniji</h1>
                            {restaurant.owner === userContext.user?._id &&
                                <motion.div
                                    className={styles['add-menu-button']}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpenAddMenu(true)}
                                >
                                    <i className={`fa-solid fa-plus ${styles['exit-edit-button']}`}></i>
                                </motion.div>
                            }
                        </div>
                        <div className={styles["menus"]}>
                            {restaurant.menus.length > 0 ?
                            <>
                                {restaurant.menus.map(({dish, sideDishes, tag, _id}) => (
                                    <div className={styles["menu"]} key={_id}>
                                        <strong>{dish}</strong>
                                        <div className={styles['side-dishes']}>
                                        {sideDishes.map((sideDish) => (
                                            <div>{sideDish}</div>
                                        ))}

                                    {restaurant.owner === userContext.user?._id &&
                                        <motion.div
                                            className={styles['remove-menu-button']}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => deleteMenu(_id)}
                                        >
                                            <i className={`fa-solid fa-trash ${styles['trash-button']}`}></i>
                                        </motion.div>
                                    }
                                    </div>
                                    <div className="tag">

                                    </div>
                                    </div>
                                ))}
                            </>
                            :
                                'Ta restavracija nima vpisanih menijev'
                            }
                        </div>    
                    </div>
                </div>
            </div>
            }
        </div>

        <AnimatePresence>
            {isOpenAddMenu ?
                <Modal handleClose={closeAddMenu}>
                    <AddMenu restaurantId={restaurant?._id} handleClose={closeAddMenu}/>
                </Modal>
            :
                null
            }
        </AnimatePresence>

        <AnimatePresence>
            {isOpenAddPhoto ?
                <Modal handleClose={closeAddPhoto}>
                    <AddPhoto restaurantId={restaurant?._id} handleClose={closeAddPhoto} toggleTrigger={toggleTriggerEffect}/>
                </Modal>
            :
                null
            }
        </AnimatePresence>

        <AnimatePresence>
            {isOpenDelete ?
            <Modal handleClose={closeDelete}>
                <DeletePrompt handleClose={closeDelete} handleConfirm={deleteRestaurant} heading="Ali ste prepričani, da želite izbrisati to restavracijo?" content="Tega dejanja ni mogoče razveljaviti. "/>
            </Modal>
            :
            null
            }
        </AnimatePresence>
</>
    )
}

export default Restaurant;