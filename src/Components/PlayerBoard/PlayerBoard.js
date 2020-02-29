import React from "react";
import BeatenPawn from "../BeatenPawn/BeatenPawn";
import { render } from "react-dom";

const PlayerBoard = ({ timer, player, beatenPawns }) => {
  // TIMER FORMAT
  const minutes = Math.floor(timer / 60);
  let seconds = timer % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  const formatedTimer = `${minutes} : ${seconds}`;

  return (
    <>
      <div className="playerBoard">
        <h1>{player}</h1>
        <span className="timer">{formatedTimer}</span>
        <div className="beatenPawnArray">
          {beatenPawns.map(pawn => (
            <BeatenPawn player={player} pawn={pawn} />
          ))}
        </div>
      </div>
    </>
  );
};
export default PlayerBoard;
