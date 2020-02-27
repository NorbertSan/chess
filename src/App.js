import React from "react";
import "./style.css";
import {
  player1,
  player2,
  player1Pawns,
  player2Pawns,
  player1PawnsIndexes,
  player2PawnsIndexes,
  freeSpace
} from "./config";
import Board from "./Components/Board/Board";

class App extends React.Component {
  state = {
    turn: player1,
    board: [],
    player1Pawns: {},
    player2Pawns: {},
    clicked: null,
    possibilityMoves: []
  };

  componentDidMount() {
    this.start();
  }

  async start() {
    const board = await this.setBoard();
    this.setState({
      board,
      player1Pawns,
      player2Pawns
    });
  }

  setBoard() {
    const board = [];
    let indexes;
    const firstLine = player => {
      if (player === "player1") {
        indexes = player1PawnsIndexes;
      } else if (player === "player2") {
        indexes = player2PawnsIndexes;
      }
      board.push(indexes.rook);
      board.push(indexes.bishop);
      board.push(indexes.knight);
      board.push(indexes.queen);
      board.push(indexes.king);
      board.push(indexes.knight);
      board.push(indexes.bishop);
      board.push(indexes.rook);
    };
    const secondLine = player => {
      if (player === "player1") {
        indexes = player1PawnsIndexes;
      } else if (player === "player2") {
        indexes = player2PawnsIndexes;
      }
      for (let i = 0; i < 8; i++) {
        board.push(indexes.pawn);
      }
    };
    const freePlaces = () => {
      for (let i = 0; i < 32; i++) {
        board.push(freeSpace);
      }
    };

    firstLine("player1");
    secondLine("player1");
    freePlaces();
    secondLine("player2");
    firstLine("player2");

    return board;
  }

  async handleClickBoard(e) {
    // 1. get pawn and index on board
    // 2 change state clicked to index
    // 3. check out possibilities moves
    // 4. display possibilites moves
    // 5. handleNextClick, if has been clicked on prohibited place, unclick pawn
    const pawn = e.target.classList[1];
    const clickedIndex = parseInt(e.target.id);
    this.setState({
      clickedIndex
    });
    await this.possibilityMovesFunc[pawn](clickedIndex);
  }

  possibilityMovesFunc = {
    pawn: clickedIndex => this.movePawn(clickedIndex)
  };

  movePawn(index) {
    const checkIfOutOfBoard = (ind, player) => {
      // checking if pawn is on first/last line of board
      let boolean;
      if (player === "player1") {
        index >= 56 && index <= 63 ? (boolean = false) : (boolean = true);
      } else if (player === "player2") {
        index >= 0 && index <= 7 ? (boolean = false) : (boolean = true);
      }
      return boolean;
    };
    const checkIfFirstMove = (ind, player) => {
      let moveTwoPlacesIndex;
      if (player === "player1") {
        if (ind >= 8 && ind <= 15) {
          // can move 2 turn
          moveTwoPlacesIndex = ind + 16;
        }
      } else {
        // range of places 48-63
        if (ind >= 48 && ind <= 63) {
          // can move 2 turn
          moveTwoPlacesIndex = ind - 16;
        }
      }
      moveTwoPlacesIndex && possibilityMoves.push(moveTwoPlacesIndex);
    };
    const checkIfEmptyPlace = (ind, board, player) => {
      let possibilityMoveUp, valuesOfPawns, boolean;
      if (player === "player1") {
        // indexes of player1 pawns : 1-6
        possibilityMoveUp = ind + 8;
        valuesOfPawns = Object.values(player1PawnsIndexes);
        boolean = valuesOfPawns.includes(board[possibilityMoveUp]);
        !boolean && possibilityMoves.push(index + 8);
      } else if (player === "player2") {
        // indexes of player1 pawns : 11-16
        possibilityMoveUp = ind - 8;
        valuesOfPawns = Object.values(player2PawnsIndexes);
        boolean = valuesOfPawns.includes(board[possibilityMoveUp]);
        !boolean && possibilityMoves.push(index - 8);
      }
    };

    // pawn can move only 1 up
    // when its first move, it can move 2 up

    // 0. check out if next move go out of board
    // 1. check out if its first move and push move if its true
    // 2. check out if your other pawn isnt there, only look out on YOUR PAWN, NOT ENEMY PLAYER and push move if its true
    // 3. set possibility moves to state
    const { turn, board } = this.state;
    const possibilityMoves = [];
    if (checkIfOutOfBoard(index, turn)) {
      checkIfFirstMove(index, turn);
      checkIfEmptyPlace(index, board, turn);
      this.setPossibilityMovesFunc(possibilityMoves);
    }
  }

  setPossibilityMovesFunc(moves) {
    this.setState({
      possibilityMoves: moves
    });
  }

  render() {
    return (
      <>
        <Board
          onClick={e => this.handleClickBoard(e)}
          board={this.state.board}
        />
      </>
    );
  }
}

export default App;
