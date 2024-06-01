import React, { useState, useEffect, useRef } from 'react';
import styles from './Restaurant.module.scss'
import { useParams } from 'react-router-dom';


import { getApiCall } from '../../api/apiCalls';


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
    photo: Photo; // Updated photo interface
    mealPrice: number;
    mealSurcharge: number;
    workingHours: WorkingHours[];
    tags: string[];
    ratings: any[];
    __v: number;
    averageRating: number;
    id: string;
}

function Restaurant() {
    const [restaurant, setRestaurant] = useState<Restaurant>();
    const { id } = useParams();

    console.log(id);

    useEffect(() => {
        getApiCall(`http://${process.env.REACT_APP_URL}:3001/restaurants/${id}`)
        .then(data =>  { setRestaurant(data)})
        .catch(error => console.log(error))
    }, []);

    console.log(restaurant)


    return (
        <div className={styles["restaurant-main"]}>
            <div className={styles["restaurant-holder"]}>
                <div className={styles["picture-holder"]}>
                <img src={`http://${process.env.REACT_APP_URL}:3001${restaurant?.photo.imagePath}`} alt="Restavracija"/>
                </div>
                <div className={styles["content-holder"]}>
                    <div className={styles["restaurant-title"]}>
                        {restaurant?.name}
                    </div>
                    <div className={styles["restaurant-content"]}>
                        Lokacija: {restaurant?.address} 
                    </div>
                    <div className={styles["restaurant-content"]}>
                        Subvencija: {restaurant?.mealSurcharge} eur
                    </div>
                    <div className={styles["restaurant-content"]}>
                        Cena: {restaurant?.mealPrice} eur
                    </div>
                    <div className={styles["restaurant-content"]} style={{paddingTop: '40px'}}>
                        Delovnik
                    </div>
                    <div className={styles["restaurant-content"]}>
                    {restaurant?.workingHours.map((hour, index) => (
                        <div key={index}>
                            {hour.day} {hour.open} - {hour.close}
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Restaurant;