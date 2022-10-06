import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Style Sheet import
import "../utils/utilStylez.css";
import { artistsActions } from "../../store/artists-reducer";
import { quizActions } from "../../store/quiz-reducer";

const Stats = () => {
    const dispatch = useDispatch();

    const totalCorrect = useSelector((state) => state.quiz.totalCorrect);
    const totalWrong = useSelector((state) => state.quiz.totalWrong);

    const resetGame = () => {
        localStorage.clear();
        dispatch(artistsActions.resetArtists());
        dispatch(quizActions.resetQuiz());
    };

    return (
        <div className="background d-flex" style={{ height: '100vh' }}>
            <div className="cardholder">
                <div className="songcard rounded animate__animated animate__slideInDown">
                    <h1 className="stat">
                        Good game! <i className="bi bi-emoji-smile" />
                        <br />
                        See your stats below!
                    </h1>
                    <div className="cardholder">
                        <ul>
                            <li className="animate__animated animate__slideInRight totals">
                                <i className="bi bi-check-circle yay" /><br />
                                Total Correct Answers: <div className="score">{totalCorrect}</div>
                            </li>
                            <li className="animate__animated animate__slideInLeft totals">
                                <i className="bi bi-x-circle boo" /><br />
                                Total Wrong Answers: <div className="score">{totalWrong}</div>
                            </li>
                        </ul>
                    </div>
                    <h2>Well done!</h2>
                    <h3>Wanna play again?</h3>
                    <Link
                        to="/"
                        className="text-decoration-none text-light"
                        onClick={resetGame}
                    >
                        <button type="button" className="btn btn-lg btn-dark statbtn">
                            Take me home!
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Stats;
