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

  addClassName(squares, index, className) {
    const id = squares[index].props.id;
    const classNames = squares[index].props.className.split(" ");
    classNames.push(className);
    const squareHTML = this.returnSquare(id, ...classNames);
    squares[index] = squareHTML;
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
      this.addClassName(squares, clicked, "clicked");
    }
  }
  displayPossibilityMoves(squares) {
    const { possibilityMoves } = this.props;
    if (possibilityMoves.length > 0) {
      possibilityMoves.forEach((item, index) => {
        this.addClassName(squares, possibilityMoves[index], "posibbilityMove");
      });
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
    await this.displayPossibilityMoves(squares);

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
