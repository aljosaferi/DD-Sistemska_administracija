import { useState } from 'react';

import Login from './Login/Login'
import Register from './Register/Register';
import Modal from '../Modal/Modal';

import styles from './Authenticate.module.scss';

interface AuthenticateProps {
    handleClose: () => void;
}

function Authenticate({ handleClose } : AuthenticateProps) {
    const [currentState, setCurrentState] = useState<'login' | 'register'>('login')
    const setStateLogin = () => setCurrentState('login');
    const setStateRegister = () => setCurrentState('register');

  return (
    <Modal handleClose={handleClose}>
        <div className={styles['container']}>
            <div className={styles['header']}>
                <div 
                    className={`${styles['login']} ${currentState === 'login' ? styles['current'] : ''}`}
                    onClick={setStateLogin}    
                >
                    Prijava
                </div>
                <div 
                    className={`${styles['register']} ${currentState === 'register' ? styles['current'] : ''}`}
                    onClick={setStateRegister}    
                >
                    Registracija
                </div>
            </div>
            {currentState === 'login' ? <Login handleClose={handleClose}/> : <Register switchToLogin={setStateLogin}/>}
        </div>
    </Modal>
  );
};

export default Authenticate;
