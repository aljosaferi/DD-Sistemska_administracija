import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './AddRestaurant.module.scss';
import Button from '../../components/Button/Button';
import { postApiCall } from '../../api/apiCalls';
import axios from 'axios';



function AddRestaurant() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [mealPrice, setMealPrice] = useState(0);
    const [surchargePrice, setSurchargePrice] = useState(0);
    const [timeSlots, setTimeSlots] = useState([
        { day: 'Ponedeljek', open: 'Zaprto', close: 'Zaprto' },
        { day: 'Torek', open: 'Zaprto', close: 'Zaprto' },
        { day: 'Sreda', open: 'Zaprto', close: 'Zaprto' },
        { day: 'Četrtek', open: 'Zaprto', close: 'Zaprto' },
        { day: 'Petek', open: 'Zaprto', close: 'Zaprto' },
        { day: 'Sobota', open: 'Zaprto', close: 'Zaprto' },
        { day: 'Nedelja', open: 'Zaprto', close: 'Zaprto' },
      ]);
    const [error, setError] = useState("");

      const navigate = useNavigate();

      async function PostRestaurant(e){
        e.preventDefault();

        const restaurant = {
            name: name,
            address: address,
            mealPrice: mealPrice,
            mealSurcharge: surchargePrice,
            workingHours: timeSlots
        }

        try {

            const data = await postApiCall(`http://${process.env.REACT_APP_URL}:3001/restaurants`, restaurant)

            if(data._id !== undefined){
                navigate('/restaurant/' + data._id)
            } else {
                setName("");
                setAddress("");
                setMealPrice(0);
                setSurchargePrice(0);
                setError("Nekje je prišlo do napake");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError("Nekje je prišlo do napake");
            }
        }
    }

    return (
        <div className={styles['container']}>
            <form onSubmit={PostRestaurant}>
                <div className={styles['header']}>
                    <h1>Dodaj Restavracijo</h1>
                </div>
                <div className={styles['username-container']}>
                    <input
                        type="text"
                        id="name"
                        placeholder="Ime restavracije"
                        onChange={(e)=>(setName(e.target.value))}
                        required
                    />
                </div>
                <div className={styles['address-container']}>
                    <input
                        type="text"
                        id="address"
                        placeholder="Naslov"
                        onChange={(e)=>(setAddress(e.target.value))}
                        required
                    />
                </div>
                <div className={styles['prices-container']}>
                    <div className={styles['meal-price-container']}>
                        <input
                            type="number"
                            id="meal-price"
                            placeholder="Cena obroka"
                            step="0.01"
                            min="0"
                            onChange={(e) => setMealPrice(parseFloat(e.target.value))}
                            required
                        />
                    </div>
                    <div className={styles['meal-surcharge-container']}>
                        <input
                            type="number"
                            id="price"
                            placeholder="Doplačilo"
                            step="0.01"
                            min="0"
                            onChange={(e) => setSurchargePrice(parseFloat(e.target.value))}
                            required
                        />
                    </div>
                </div>
                <div className={styles['schedule']}>
                {timeSlots.map((slot, index) => (
                    <div className={styles['schedule-day']} key={index}>
                        <div className={styles['day-and-closed']}>
                        <label>{slot.day}</label>
                        <div className={styles['closed']}>
                            Zaprto
                            <input
                            type="checkbox"
                            checked={slot.open === 'Zaprto' && slot.close === 'Zaprto'}
                            onChange={(e) => {
                                const newTimeSlots = [...timeSlots];
                                if (e.target.checked) {
                                newTimeSlots[index] = { ...slot, open: 'Zaprto', close: 'Zaprto' };
                                } else {
                                newTimeSlots[index] = { ...slot, open: '08:00', close: '20:00' };
                                }
                                setTimeSlots(newTimeSlots);
                            }}
                            />
                        </div>
                        </div>
                        <div className={styles['from-to']}>
                        <input
                            type="time"
                            value={slot.open !== 'Zaprto' ? slot.open : ''}
                            disabled={slot.open === 'Zaprto' && slot.close === 'Zaprto'}
                            onChange={(e) => {
                            const newTimeSlots = [...timeSlots];
                            newTimeSlots[index] = { ...slot, open: e.target.value };
                            setTimeSlots(newTimeSlots);
                            }}
                            required={slot.open !== 'Zaprto' && slot.close !== 'Zaprto'}
                        />
                        <span> - </span>
                        <input
                            type="time"
                            value={slot.close !== 'Zaprto' ? slot.close : ''}
                            disabled={slot.open === 'Zaprto' && slot.close === 'Zaprto'}
                            onChange={(e) => {
                            const newTimeSlots = [...timeSlots];
                            newTimeSlots[index] = { ...slot, close: e.target.value };
                            setTimeSlots(newTimeSlots);
                            }}
                            required={slot.open !== 'Zaprto' && slot.close !== 'Zaprto'}
                        />
                        </div>
                    </div>
                    ))}
                </div>
                <label className={styles['error']}>
                    {error}
                </label>
                <div className={styles['submit']}>
                    <Button type="primary" padding={'0.7rem'} disabled={!name || !address || mealPrice===0}>
                        Dodaj restavracijo
                        <i className="fa-solid fa-check"/>
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddRestaurant;