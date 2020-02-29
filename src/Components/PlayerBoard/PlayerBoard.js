import React from "react";
import BeatenPawn from "../BeatenPawn/BeatenPawn";

const PlayerBoard = ({ player, beatenPawns }) => (
  <>
    <div className="playerBoard">
      <h1>{player}</h1>
      <div className="beatenPawnArray">
        {beatenPawns.map(pawn => (
          <BeatenPawn player={player} pawn={pawn} />
        ))}
      </div>
    </div>
  </>
);
export default PlayerBoard;
