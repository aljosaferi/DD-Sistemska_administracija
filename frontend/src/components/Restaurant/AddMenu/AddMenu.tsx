import { motion } from 'framer-motion';

import styles from './AddMenu.module.scss';
import Button from '../../Button/Button';
import { useState } from 'react';
import { postApiCall } from '../../../api/apiCalls';
import axios from 'axios';

interface AddMenuProps {
    restaurantId: string | undefined;
    handleClose: () => void;
}

function AddMenu({ restaurantId, handleClose } : AddMenuProps) {
    const [dish, setDish] = useState('');
    const [sideDish1, setSideDish1] = useState('');
    const [sideDish2, setSideDish2] = useState('');
    const [tag, setTag] = useState('6644fcafd01c9038f1f3bf89');
    const [error, setError] = useState("");

    async function PostMenu(e){
        e.preventDefault();

        const menu = {
            dish: dish,
            sideDishes: [sideDish1, sideDish2].filter(sideDish => sideDish !== ""),
            restaurantId: restaurantId,
            tag: tag
        }

        try {

            const data = await postApiCall(`http://${process.env.REACT_APP_URL}:3001/menus`, menu)

            if(data._id !== undefined){
                handleClose();
            } else {
                setDish('');
                setSideDish1('');
                setSideDish2('');
                setError("Something went wrong");
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setDish('');
                setSideDish1('');
                setSideDish2('');
                setError("Something went wrong");
            }
        }
    }

    return (
        <div className={styles['container']}>
            <form onSubmit={PostMenu}>
                <div className={styles['header']}>
                    <h1>Dodaj Meni</h1>
                    <motion.div
                        whileHover={{scale: 1.05}}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                    >
                        <i className="fa-solid fa-xmark"/>
                    </motion.div>
                </div>
                <div className={styles['dish-container']}>
                    <input
                        type="text"
                        id="dish"
                        placeholder="Glavna jed"
                        value={dish}
                        onChange={(e)=>(setDish(e.target.value))}
                        required
                    />
                </div>
                <div className={styles['side-dish-container']}>
                    <input
                        type="text"
                        placeholder="Priloga 1"
                        value={sideDish1}
                        onChange={(e) => setSideDish1(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Priloga 2"
                        value={sideDish2}
                        onChange={(e) => setSideDish2(e.target.value)}
                    />
                </div>
                <label className={styles['error']}>
                    {error}
                </label>
                <div className={styles['submit']}>
                    <Button type="primary" padding={'0.7rem'} disabled={!dish}>
                        Dodaj meni
                        <i className="fa-solid fa-check"/>
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddMenu;