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
    possibilityMoves: [],
    clickedIndex: null
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

  resetPossibilityMoves() {
    this.setState({
      possibilityMoves: []
    });
  }
  isThereOnlyYourPawn(ind, player) {
    // this function return boolean of that is your pawn there
    // its simple because of value of pawns
    // empty - 0, player1 - << 1 << 6, player2 - << 11 << 16
    const { board } = this.state;
    if (player === "player1") {
      if (board[ind] >= 1 && board[ind] <= 6) {
        // for player1 on ind is there another his pawn
        return false;
      } else return true;
    } else if (player === "player2") {
      if (board[ind] >= 11 && board[ind] <= 16) {
        // for player1 on ind is there another his pawn
        return false;
      } else return true;
    }
  }

  resetClicked() {
    this.setState({
      clickedIndex: null
    });
  }
  setClicked(clickedIndex) {
    this.setState({
      clickedIndex
    });
  }

  async handleClickBoard(e) {
    // 0. reset possibility moves
    // 1. get pawn and index on board
    // 2 change state clicked to index
    // 3. check out possibilities moves
    // 4. display possibilites moves
    // 5. handleNextClick, if has been clicked on prohibited place, unclick pawn
    e.persist();
    await this.resetPossibilityMoves();
    const pawn = e.target.classList[1];

    if (this.possibilityMovesFunc[pawn]) {
      const clickedIndex = parseInt(e.target.id);
      this.setClicked(clickedIndex);
      const possibilityMoves = this.possibilityMovesFunc[pawn](clickedIndex);
      this.setPossibilityMoves(possibilityMoves);
    } else {
      // empty square
      this.resetClicked();
    }
  }

  possibilityMovesFunc = {
    // these function return array of possibility moves
    pawn: clickedIndex => this.movePawn(clickedIndex),
    king: clickedIndex => this.moveKing(clickedIndex)
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
      this.isThereOnlyYourPawn(index + 8, turn) &&
        possibilityMoves.push(index + 8);
      return possibilityMoves;
    }
  }

  moveKing(index) {
    // king can move to 1 pool to every direciton

    const kingMoveLeft = (ind, possibilityMovesArr) => {
      let couldMove = false;
      const possibilityIndex = ind - 1;
      for (let i = 0; i < 64; i += 8) {
        if (
          possibilityIndex >= i &&
          this.isThereOnlyYourPawn(possibilityIndex, turn)
        ) {
          couldMove = true;
        }
      }
      couldMove && possibilityMovesArr.push(possibilityIndex);
    };
    const kingMoveRight = (ind, possibilityMovesArr) => {
      let couldMove = false;
      const possibilityIndex = ind + 1;
      for (let i = 7; i < 64; i += 8) {
        if (
          possibilityIndex <= i &&
          this.isThereOnlyYourPawn(possibilityIndex, turn)
        ) {
          couldMove = true;
        }
      }
      couldMove && possibilityMovesArr.push(possibilityIndex);
    };
    const kingMoveUp = (ind, possibilityMovesArr) => {
      const possibilityIndex = ind - 8;
      if (
        possibilityIndex >= 0 &&
        this.isThereOnlyYourPawn(possibilityIndex, turn)
      ) {
        possibilityMovesArr.push(possibilityIndex);
      }
    };
    const kingMoveDown = (ind, possibilityMovesArr) => {
      const possibilityIndex = ind + 8;
      if (
        possibilityIndex < 64 &&
        this.isThereOnlyYourPawn(possibilityIndex, turn)
      ) {
        possibilityMovesArr.push(possibilityIndex);
      }
    };

    const kingMoveTopLeft = (ind, possibilityMovesArr) => {
      let couldMove = false;
      const possibilityIndex = ind - 9;
      if (
        possibilityIndex >= 0 &&
        this.isThereOnlyYourPawn(possibilityIndex, turn)
      ) {
        // then i have to check if king is not on left edge
        for (let i = 0; i < 64; i += 8) {
          if (ind !== i) couldMove = true;
        }
        couldMove && possibilityMovesArr.push(possibilityIndex);
      }
    };

    const kingMoveBottomLeft = (ind, possibilityMovesArr) => {
      let couldMove = false;
      const possibilityIndex = ind + 7;
      if (
        possibilityIndex < 64 &&
        this.isThereOnlyYourPawn(possibilityIndex, turn)
      ) {
        // then i have to check if king is not on left edge
        for (let i = 0; i < 64; i += 8) {
          if (ind !== i) couldMove = true;
        }
        couldMove && possibilityMovesArr.push(possibilityIndex);
      }
    };

    const kingMoveTopRight = (ind, possibilityMovesArr) => {
      let couldMove = false;
      const possibilityIndex = ind - 7;
      if (
        possibilityIndex >= 0 &&
        this.isThereOnlyYourPawn(possibilityIndex, turn)
      ) {
        for (let i = 7; i < 64; i += 8) {
          // then i have to check if king is on the right edge
          if (ind !== i) couldMove = true;
        }
        couldMove && possibilityMovesArr.push(possibilityIndex);
      }
    };

    const kingMoveBottomRight = (ind, possibilityMovesArr) => {
      let couldMove = false;
      const possibilityIndex = ind + 9;
      if (
        possibilityIndex < 64 &&
        this.isThereOnlyYourPawn(possibilityIndex, turn)
      ) {
        for (let i = 7; i < 64; i += 8) {
          if (ind !== i) couldMove = true;
        }
        couldMove && possibilityMovesArr.push(possibilityIndex);
      }
    };

    const { turn, board } = this.state;
    let possibilityMoves = [];

    // these functions are checking if kinng can move, if it can it push possibility index to array

    kingMoveLeft(index, possibilityMoves);
    kingMoveRight(index, possibilityMoves);
    kingMoveUp(index, possibilityMoves);
    kingMoveDown(index, possibilityMoves);
    kingMoveBottomLeft(index, possibilityMoves);
    kingMoveBottomRight(index, possibilityMoves);
    kingMoveTopRight(index, possibilityMoves);
    kingMoveTopLeft(index, possibilityMoves);

    console.log(possibilityMoves);
    return possibilityMoves;
  }

  setPossibilityMoves(moves) {
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
          possibilityMoves={this.state.possibilityMoves}
          clicked={this.state.clickedIndex}
        />
      </>
    );
  }
}

export default App;
