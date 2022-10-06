import React from 'react';
import './utilStylez.css'
import { Redirect } from 'react-router-dom';

const LoseModal = () => {
    const [redirectNow, setRedirectNow] = useState(false);
    setTimeout(() => setRedirectNow(true), 5000);

    return redirectNow ? (
        <Redirect to="/stats" />
    ) : (
        <div className="modalBackdrop">
            <div className='modalContainer'>
                <h3 className='modalTitle'>Oh no! You've used up all your guesses!</h3>
                <h4>Please play again!</h4>
            </div>
        </div>
    );

};

export default LoseModal;