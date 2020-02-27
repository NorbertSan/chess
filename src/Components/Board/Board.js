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

  returnSquare(nr, ...classNames) {
    const classNamesList = classNames.reduce((res, cur) => {
      if (cur) {
        return `${res} ${cur}`;
      }
    }, "square");
    return <div key={nr} id={nr} className={classNamesList}></div>;
  }

  displaySquares(squares) {
    const { board } = this.props;
    const player1PawnsValues = Object.values(player1PawnsIndexes);
    const player2PawnsValues = Object.values(player2PawnsIndexes);
    const player1PawnsKeys = Object.keys(player1PawnsIndexes);
    const player2PawnsKeys = Object.keys(player2PawnsIndexes);

    board.forEach((square, nr) => {
      let index, index2, squareHTML, figure;
      index = player1PawnsValues.findIndex(item => item === square);
      index2 = player2PawnsValues.findIndex(item => item === square);
      if (index > -1) {
        // player1 pawn
        figure = player1PawnsKeys[index];
        squareHTML = this.returnSquare(nr, figure, "player1");
      } else if (index2 > -1) {
        // player2 pawn
        figure = player2PawnsKeys[index2];
        squareHTML = this.returnSquare(nr, figure, "player2");
      } else {
        // empty space
        squareHTML = this.returnSquare(nr);
      }

      squares.push(squareHTML);
    });
  }
  displayClickedSquare(squares) {
    const { clicked } = this.props;
    if (clicked) {
      const id = squares[clicked].props.id;
      const classNames = squares[clicked].props.className.split(" ");
      classNames.push("clicked");
      const squareHTML = this.returnSquare(id, ...classNames);
      squares[clicked] = squareHTML;
    }
  }
  upgradeSquares(squares) {
    if (JSON.stringify(squares) !== JSON.stringify(this.state.squares)) {
      this.setState({
        squares
      });
    }
  }

  async componentDidUpdate() {
    let squares = [];
    await this.displaySquares(squares);
    await this.displayClickedSquare(squares);

    this.upgradeSquares(squares);
  }

  render() {
    return (
      <div className="board" onClick={this.props.onClick}>
        {this.state.squares}
      </div>
    );
  }
}

export default Board;
