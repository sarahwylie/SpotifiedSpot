import React from 'react';
import './utilStylez.css'

const ResultModal = (props) => {
    return (
        <div className="modalBackdrop">
            <div className='modalContainer'>
                <h3 className='modalTitle'>{props.title}</h3>
                <button className='btn btn-info' onClick={props.onClose} type='button'>
                    Try another artist
                </button>
            </div>
        </div>
    )
};
// That is correct! Way to go!
export default ResultModal;