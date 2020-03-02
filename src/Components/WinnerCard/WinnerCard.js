import React from "react";
import WinnerBlackIcon from "../../assets/icons/winner-black.svg";
import WinnerWhiteIcon from "../../assets/icons/winner-white.svg";

const WinnerCard = ({ resetGameFunc, winner }) => (
  <>
    <div className="winnerCard">
      <button className="exitButton" />
      <h1 class="info">Koniec gry</h1>
      <h3>Wygrał {winner}</h3>
      <img
        className="winnerPhoto"
        src={winner === "player1" ? WinnerBlackIcon : WinnerWhiteIcon}
        alt="winner"
      />
      <button className="repeatGameButton" onClick={resetGameFunc}>
        Zagraj jeszcze raz !
      </button>
    </div>
  </>
);

export default WinnerCard;
