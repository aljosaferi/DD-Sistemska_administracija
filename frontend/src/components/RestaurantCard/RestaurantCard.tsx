import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Restaurant } from '../../pages/Restaurants/Restaurants';
import styles from './RestaurantCard.module.scss';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

function RestaurantCard({ restaurant }: RestaurantCardProps) {
    const navigate = useNavigate();

    return (
        <div className={styles['container']} onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
            <div className={styles['image-container']}>
                <img src={`http://${process.env.REACT_APP_URL}:3001${restaurant.photo.imagePath}`} alt="Restavracija"/>
            </div>
            <div className={styles['other']}>
                <div className={styles['text-container']}>
                    <div className={styles['name']}>
                        <h1>{restaurant.name}</h1>
                    </div>
                    <div className={styles['meal-price']}>
                        cena obroka: {restaurant.mealPrice} €
                    </div>
                    <div className={styles['meal-surcharge']}>
                        doplačilo: {restaurant.mealSurcharge} €
                    </div>
                </div>
                <div className={styles['bottom']}>
                    <div className={styles['stars-container']} style={{ '--partial-percentage': `${(restaurant.averageRating % 1 * 100)}%` } as React.CSSProperties}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index}>
                                {restaurant.averageRating === 0 ?
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
                    <div>
                        {restaurant.ratings.length === 0 ?
                                null
                            :
                            <div className={styles['rating-count']}>
                                {restaurant.ratings.length}x
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantCard;