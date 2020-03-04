import React from "react";
import { player1PawnsIndexes, player2PawnsIndexes } from "../../config";

const PromotionPawnCard = ({ promotionPawn, handlePromotionPawnOption }) => {
  const { player } = promotionPawn;
  return (
    <>
      <div className="promotionCard">
        <h3>
          Przeszedłeś pionkiem przez całą planszę, zamień swojego pionka na
          lepszą figure
        </h3>
        <div className="promoOptions">
          <div
            onClick={e => handlePromotionPawnOption(e)}
            data-index={
              player === "player1"
                ? player1PawnsIndexes["rook"]
                : player2PawnsIndexes["rook"]
            }
            className={`${player} promoOption rook`}
          ></div>
          <div
            onClick={e => handlePromotionPawnOption(e)}
            data-index={
              player === "player1"
                ? player1PawnsIndexes["queen"]
                : player2PawnsIndexes["queen"]
            }
            className={`${player} promoOption queen`}
          ></div>
          <div
            onClick={e => handlePromotionPawnOption(e)}
            data-index={
              player === "player1"
                ? player1PawnsIndexes["bishop"]
                : player2PawnsIndexes["bishop"]
            }
            className={`${player} promoOption bishop`}
          ></div>
          <div
            onClick={e => handlePromotionPawnOption(e)}
            data-index={
              player === "player1"
                ? player1PawnsIndexes["knight"]
                : player2PawnsIndexes["knight"]
            }
            className={`${player} promoOption knight`}
          ></div>
        </div>
      </div>
    </>
  );
};

export default PromotionPawnCard;
