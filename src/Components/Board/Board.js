import React from "react";
import {
  player1PawnsIndexes,
  player2PawnsIndexes,
  freeSpace
} from "../../config";

class Board extends React.Component {
  state = {
    squares: []
  };

  returnSquare(nr, ...classNames) {
    let color;
    if (Math.floor(nr / 8) % 2 === 0) {
      //2n row
      nr % 2 === 0 ? (color = "lighter") : (color = "darker");
    } else {
      //2n+1 row
      nr % 2 === 0 ? (color = "darker") : (color = "lighter");
    }

    const classNamesList = classNames.reduce((res, cur) => {
      if (cur) {
        return `${res} ${cur}`;
      }
    }, `square ${color}`);
    return <div key={nr} id={nr} data-id={nr} className={classNamesList}></div>;
  }

  addClassName(squares, index, className) {
    const id = squares[index].props.id;
    const classNames = squares[index].props.className.split(" ");
    classNames.push(className);
    classNames.shift();
    // remove first class, its always 'square', prevent for multiple classNamesquare
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
    if (typeof clicked === "number") {
      this.addClassName(squares, clicked, "clicked");
    }
  }
  displayPossibilityMoves(squares) {
    if (this.props.showPossibilityMoves) {
      const { possibilityMoves } = this.props;
      if (possibilityMoves) {
        possibilityMoves.forEach((item, index) => {
          this.addClassName(
            squares,
            possibilityMoves[index],
            "posibbilityMove"
          );
        });
      }
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
    const { clickBoard } = this.props;
    return (
      <div className="board" onClick={clickBoard}>
        {this.state.squares}
      </div>
    );
  }
}

export default Board;
