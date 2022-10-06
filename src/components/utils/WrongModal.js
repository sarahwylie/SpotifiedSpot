import React from 'react';
import './utilStylez.css'

const WrongModal = ({ onClose }) => {
    return (
        <div className="modalBackdrop">
            <div className='modalContainer'>
                <h3 className='modalTitle'>Ooh, no dice!</h3>
                <Button onClick={onClose} type='button'>
                    Try again?
                </Button>
            </div>
        </div>
    )
};

export default WrongModal;