import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import styles from './NewsCard.module.scss';
import Modal from '../Modal/Modal';
import EditNews from './EditNews/EditNews';
import DeletePrompt from '../DeletePrompt/DeletePrompt';
import { UserContext } from '../../userContext';

function NewsCard() {
    const[isOpenEdit, setIsOpenEdit] = useState(false);
    const[isOpenDelete, setIsOpenDelete] = useState(false);
    const userContext = useContext(UserContext);

    const openEdit = () => setIsOpenEdit(true);
    const closeEdit = () => setIsOpenEdit(false);
    const openDelete = () => setIsOpenDelete(true);
    const closeDelete = () => setIsOpenDelete(false);

    return (
        <>
            <div className={styles['container']}>
                {/* if date less than 1 day old */}
                <div className={styles['new-tag']}>
                    Novo
                </div>

                {userContext.user?.userType === "admin" &&
                    <div className={styles['edit']}>
                        <motion.div
                            whileHover={{scale: 1.05}}
                            whileTap={{ scale: 0.9 }}
                            onClick={openEdit}
                        >
                            <i className="fa-solid fa-pen"/>
                        </motion.div>
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

                <div className={styles['title']}>
                    <h1>Lorem Ipsum</h1>
                </div>
                <div className={styles['content']}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                </div>
                <div className={styles['footer']}>
                    <div className={styles['author']}>
                        <img src="/images/profilna.JPG" alt="Profilna"/>
                        <h2>Jan Vališer</h2>
                    </div>
                    <div className={styles['date']}>
                        24.5
                    </div>
                    
                </div>
            </div>

            <AnimatePresence>
                {isOpenEdit ?
                <Modal handleClose={closeEdit}>
                    <EditNews handleClose={closeEdit}/>
                </Modal>
                :
                null
                }
            </AnimatePresence>

            <AnimatePresence>
                {isOpenDelete ?
                <Modal handleClose={closeDelete}>
                    <DeletePrompt handleClose={closeDelete} handleConfirm={closeDelete} heading="Ali ste prepričani, da želite izbrisati novico?" content="Tega dejanja ni mogoče razveljaviti. "/>
                </Modal>
                :
                null
                }
            </AnimatePresence>
        </>
    )
}

export default NewsCard;