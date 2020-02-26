import React from "react";
import {
  size,
  player1PawnsIndexes,
  player2PawnsIndexes,
  freeSpace
} from "../../config";

class Board extends React.Component {
  state = {
    squares: []
  };

  componentDidUpdate() {
    const { board } = this.props;
    let squares = [];
    const returnSquare = (figure = "", player = "") => (
      <div className={`square ${figure} ${player}`}></div>
    );
    const player1PawnsValues = Object.values(player1PawnsIndexes);
    const player2PawnsValues = Object.values(player2PawnsIndexes);
    const player1PawnsKeys = Object.keys(player1PawnsIndexes);
    const player2PawnsKeys = Object.keys(player2PawnsIndexes);

    board.forEach(square => {
      let index, index2, squareHTML, figure;
      index = player1PawnsValues.findIndex(item => item === square);
      index2 = player2PawnsValues.findIndex(item => item === square);
      if (index > -1) {
        // player1 pawn
        figure = player1PawnsKeys[index];
        squareHTML = returnSquare(figure, "player1");
        //   squareHTML = returnSquare();
      } else if (index2 > -1) {
        // player2 pawn
        figure = player2PawnsKeys[index2];
        squareHTML = returnSquare(figure, "player2");
      } else {
        // empty space
        squareHTML = returnSquare();
      }
      squares.push(squareHTML);
    });

    if (JSON.stringify(squares) !== JSON.stringify(this.state.squares)) {
      this.setState({
        squares
      });
    }
  }

  render() {
    return <div className="board">{this.state.squares}</div>;
  }
}

export default Board;
