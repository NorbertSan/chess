import React from "react";
import { player1PawnsIndexes, player2PawnsIndexes } from "../../config";

class BeatenPawn extends React.Component {
  state = {
    pawnName: null
  };
  componentDidMount() {
    const { player, pawn } = this.props;
    let color;
    player === "player1" ? (color = "white") : (color = "black");
    let pawnName;
    if (pawn <= 6) {
      for (let key in player1PawnsIndexes) {
        if (player1PawnsIndexes[key] === pawn) pawnName = `${key}-${color}`;
      }
    } else if (pawn >= 11) {
      for (let key in player2PawnsIndexes) {
        if (player2PawnsIndexes[key] === pawn) pawnName = `${key}-${color}`;
      }
    }
    this.setState({
      pawnName
    });
  }
  render() {
    return (
      <img
        src={
          this.state.pawnName &&
          require(`../../assets/icons/${this.state.pawnName}.svg`)
        }
        className="beatenPawn"
        alt={1}
      />
    );
  }
}

export default BeatenPawn;
