import { useState, useEffect } from 'react';

import styles from './Restaurants.module.scss';
import { getApiCall } from '../../api/apiCalls';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';

import { debounce } from 'lodash';
import Reveal from '../../components/Reveal/Reveal';

type WorkingHour = {
    day: string;
    open: string;
    close: string;
    /* _id: string;
    id: string; */
};

type Photo = {
    _id: string;
    imagePath: string;
    __v: number;
};

type Location = {
    type: string;
    coordinates: number[];
};

export type Restaurant = {
    location: Location;
    _id: string;
    name: string;
    address: string;
    owner: string;
    photo: Photo;
    mealPrice: number;
    mealSurcharge: number;
    workingHours: WorkingHour[];
    tags: string[];
    ratings: any[]; 
    __v: number;
    averageRating: number;
    id: string;
};
function Restaurants() {
    const [restaurants, setRetaurants] = useState<Restaurant[] | null>(null);

    const [sortBy, setSortBy] = useState<'lowest-price-first' |
                                         'highest-price-first' | 
                                         'lowest-rated-first' | 
                                         'highest-rated-first' |
                                         null >(null);
    
    const [searchBy, setSearchBy] = useState('');
    const debouncedSetSearchBy = debounce((value) => setSearchBy(value), 250);                                     

    useEffect(() => {
        let params = {};
        if (sortBy) {
            params = {
                ...params,
                sortBy: sortBy
            };
        }
        if (searchBy) {
            params = {
                ...params,
                name: searchBy
            };
        }
        getApiCall(`http://${process.env.REACT_APP_URL}:3001/restaurants`, params)
        .then(data =>  { setRetaurants(data) })
        .catch(error => console.log(error))
    }, [sortBy, searchBy]);


    return (
        <div className={styles['container']}>
            <div className={styles['search-bar']}>
                <div className={styles['filter-button']}>
                    <i className="fa-solid fa-filter"/>
                    <div className={styles['filters']}>
                        <h2>Sortiraj:</h2>
                        <div>
                            Najcenejše najprej:
                            <div className={styles['switch-container']}>
                                <label className={styles['switch']}>
                                    <input 
                                        type="checkbox" 
                                        checked={sortBy === 'lowest-price-first'}
                                        onChange={(e) => { e.target.checked ? setSortBy('lowest-price-first') : setSortBy(null)}} 
                                    />
                                    <span className={`${styles['slider']} ${styles['round']}`}/>
                                </label>
                            </div>
                        </div>
                        <div>
                            Najdražje najprej:
                            <div className={styles['switch-container']}>
                                <label className={styles['switch']}>
                                    <input 
                                        type="checkbox" 
                                        checked={sortBy === 'highest-price-first'}
                                        onChange={(e) => { e.target.checked ? setSortBy('highest-price-first') : setSortBy(null)}} 
                                    />
                                    <span className={`${styles['slider']} ${styles['round']}`}/>
                                </label>
                            </div>
                        </div>
                        <div>
                            Najboljša ocena najprej:
                            <div className={styles['switch-container']}>
                                <label className={styles['switch']}>
                                    <input 
                                        type="checkbox" 
                                        checked={sortBy === 'highest-rated-first'}
                                        onChange={(e) => { e.target.checked ? setSortBy('highest-rated-first') : setSortBy(null)}} 
                                    />
                                    <span className={`${styles['slider']} ${styles['round']}`}/>
                                </label>
                            </div>
                        </div>
                        <div>
                            Najslabša ocena najprej:
                            <div className={styles['switch-container']}>
                                <label className={styles['switch']}>
                                    <input 
                                        type="checkbox" 
                                        checked={sortBy === 'lowest-rated-first'}
                                        onChange={(e) => { e.target.checked ? setSortBy('lowest-rated-first') : setSortBy(null)}} 
                                    />
                                    <span className={`${styles['slider']} ${styles['round']}`}/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <input 
                    type='text' 
                    placeholder='Išči po imenu'
                    onKeyUp={(event) => {
                        debouncedSetSearchBy(event.currentTarget.value);
                }}/>
            </div>
            <div className={styles['main-content']}>
                <div className={styles['filter-container']}>
                    <div className={styles['filters']}>
                        <h2>Sortiraj:</h2>
                        <div>
                            Najcenejše najprej:
                            <div className={styles['switch-container']}>
                                <label className={styles['switch']}>
                                    <input 
                                        type="checkbox" 
                                        checked={sortBy === 'lowest-price-first'}
                                        onChange={(e) => { e.target.checked ? setSortBy('lowest-price-first') : setSortBy(null)}} 
                                    />
                                    <span className={`${styles['slider']} ${styles['round']}`}/>
                                </label>
                            </div>
                        </div>
                        <div>
                            Najdražje najprej:
                            <div className={styles['switch-container']}>
                                <label className={styles['switch']}>
                                    <input 
                                        type="checkbox" 
                                        checked={sortBy === 'highest-price-first'}
                                        onChange={(e) => { e.target.checked ? setSortBy('highest-price-first') : setSortBy(null)}} 
                                    />
                                    <span className={`${styles['slider']} ${styles['round']}`}/>
                                </label>
                            </div>
                        </div>
                        <div>
                            Najboljša ocena najprej:
                            <div className={styles['switch-container']}>
                                <label className={styles['switch']}>
                                    <input 
                                        type="checkbox" 
                                        checked={sortBy === 'highest-rated-first'}
                                        onChange={(e) => { e.target.checked ? setSortBy('highest-rated-first') : setSortBy(null)}} 
                                    />
                                    <span className={`${styles['slider']} ${styles['round']}`}/>
                                </label>
                            </div>
                        </div>
                        <div>
                            Najslabša ocena najprej:
                            <div className={styles['switch-container']}>
                                <label className={styles['switch']}>
                                    <input 
                                        type="checkbox" 
                                        checked={sortBy === 'lowest-rated-first'}
                                        onChange={(e) => { e.target.checked ? setSortBy('lowest-rated-first') : setSortBy(null)}} 
                                    />
                                    <span className={`${styles['slider']} ${styles['round']}`}/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['restaurants']}>
                    {restaurants && restaurants.map((restaurant, index) => (
                        <>
                            {index < 4 ?
                                <Reveal direction='none' delay={index * 0.1}>
                                    <RestaurantCard restaurant={restaurant} key={restaurant.id}/>
                                </Reveal>
                            :
                                <RestaurantCard restaurant={restaurant} key={restaurant.id}/>
                            }
                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Restaurants;