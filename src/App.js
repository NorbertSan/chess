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
    clickedIndex: null,
    player1BeatenPawns: [],
    player2BeatenPawns: []
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
      board.push(indexes.knight);
      board.push(indexes.bishop);
      board.push(indexes.queen);
      board.push(indexes.king);
      board.push(indexes.bishop);
      board.push(indexes.knight);
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
  isInPossibilityMoves(index) {
    const { possibilityMoves } = this.state;
    return possibilityMoves.includes(index);
  }
  updateBoard(newIndex) {
    let { turn, board, clickedIndex: oldIndex } = this.state;
    const movedPawn = board[oldIndex];
    let beatenPawn = false;
    const ifPawnHasBeenBeaten = () => {
      let boolean = false;
      if (turn === "player1") {
        if (board[newIndex] >= 11 && board[newIndex] <= 16) boolean = true;
      } else if (turn === "player2") {
        if (board[newIndex] >= 1 && board[newIndex] <= 6) boolean = true;
      }
      return boolean;
    };
    board[oldIndex] = 0; // set old place pawn to empty
    if (ifPawnHasBeenBeaten()) {
      beatenPawn = board[newIndex];
      board[newIndex] = movedPawn;
    } else {
      board[newIndex] = movedPawn;
    }

    this.setState({
      board
    });
    return beatenPawn;
  }
  updateBeatenPawns(pawn) {
    const { turn } = this.state;
    const beatenPawnsArr = this.state[`${turn}BeatenPawns`];
    beatenPawnsArr.push(pawn);
    this.setState({
      beatenPawnsArr
    });
  }
  changeTurn() {
    const presentPlayer = this.state.turn;
    let nextPlayer;
    presentPlayer === "player1"
      ? (nextPlayer = "player2")
      : (nextPlayer = "player1");
    this.setState({
      turn: nextPlayer
    });
  }
  ifClickSamePlaceTwoTimes(clickedIndex) {
    if (clickedIndex === this.state.clickedIndex) return true;
    else return false;
  }
  ifItCorrectTurn(clickedIndex) {
    const { turn, board } = this.state;
    const clickedPawn = board[clickedIndex];
    let boolean = false;
    if (turn === "player1") {
      if (clickedPawn >= 1 && clickedPawn <= 6) boolean = true;
    } else if (turn === "player2") {
      if (clickedPawn >= 11 && clickedPawn <= 16) boolean = true;
    }

    return boolean;
  }
  async handleClickBoard(e) {
    // 0. reset possibility moves
    // 1. get pawn and index on board
    // 2 change state clicked to index
    // 3. check out possibilities moves
    // 4. display possibilites moves
    // 5. handleNextClick, if has been clicked on prohibited place, unclick pawn
    e.persist();
    const pawn = e.target.classList[2];
    const clickedIndex = parseInt(e.target.id);
    this.resetPossibilityMoves();
    this.resetClicked();

    // if (!this.ifItCorrectTurn(clickedIndex)) return;

    if (this.ifClickSamePlaceTwoTimes(clickedIndex)) return;

    // IF SOMETHING IS ALREADY CLICKED
    if (this.state.clickedIndex) {
      // 1. check out if clicked index is in possibility moves
      // 2. update board
      if (this.isInPossibilityMoves(clickedIndex)) {
        const beatenPawn = this.updateBoard(clickedIndex);
        beatenPawn && this.updateBeatenPawns(beatenPawn);
        this.resetPossibilityMoves();
        this.resetClicked();
        this.changeTurn();
      } else {
        this.resetClicked();
      }
      return;
    }

    // IF IS FIRST CLICK
    if (this.possibilityMovesFunc[pawn]) {
      if (!this.ifItCorrectTurn(clickedIndex)) return;
      this.setClicked(clickedIndex);
      const possibilityMoves = this.possibilityMovesFunc[pawn](clickedIndex);
      this.setPossibilityMoves(possibilityMoves);
    }
  }

  possibilityMovesFunc = {
    // these function return array of possibility moves
    pawn: clickedIndex => this.movePawn(clickedIndex),
    king: clickedIndex => this.moveKing(clickedIndex),
    rook: clickedIndex => this.moveRook(clickedIndex),
    knight: clickedIndex => this.moveKnight(clickedIndex),
    bishop: clickedIndex => this.moveBishop(clickedIndex),
    queen: clickedIndex => this.moveQueen(clickedIndex)
  };

  moveQueen(index) {
    let possibilityMoves = [];
    const rookMoves = this.moveRook(index);
    const bishopMoves = this.moveBishop(index);
    possibilityMoves = possibilityMoves.concat(rookMoves, bishopMoves);
    return possibilityMoves;
  }

  isOnTheEdge(type, index) {
    // type mean left / right / top / bottom
    if (type === "left") {
      for (let i = 0; i <= 56; i += 8) {
        if (index === i) return true;
      }
    }
    if (type === "right") {
      for (let i = 7; i < 63; i += 8) {
        if (index === i) return true;
      }
    }
    if (type === "top") {
      for (let i = 0; i < 8; i++) {
        if (index === i) return true;
      }
    }
    if (type === "bottom") {
      for (let i = 56; i < 64; i++) {
        if (index === i) return true;
      }
    }
    return false;
  }

  moveBishop(index) {
    // goniec
    // bishop can move diagonally , this possibilty moves make an X
    let possibilityMoves = [];
    const { turn } = this.state;
    const diagonallyStartLeftTop = possibilityMovesArr => {
      // go RIGHT BOTTOM from bishop index
      for (let i = index; i < 64; i += 9) {
        if (this.isOnTheEdge("right", i) || this.isOnTheEdge("bottom", i)) {
          if (i === index) break; // if bishop stay in the botton / left edge then instead break
          possibilityMovesArr.push(i);
          break;
        }
        if (!this.logicMovement(i + 9, possibilityMoves)) break;
      }
      // go LEFT TOP from bishop index
      for (let i = index; i >= 0; i -= 9) {
        if (this.isOnTheEdge("left", i) || this.isOnTheEdge("top", i)) {
          if (i === index) break; // if bishop stay in the botton / left edge then instead break
          possibilityMovesArr.push(i);
          break;
        }
        if (!this.logicMovement(i - 9, possibilityMoves)) break;
      }
    };
    const diagonallyStartRightTop = possibilityMovesArr => {
      // go LEFT BOTTOM from bishop index
      for (let i = index; i < 64; i += 7) {
        if (this.isOnTheEdge("left", i) || this.isOnTheEdge("bottom", i)) {
          if (i === index) break; // if bishop stay in the botton / left edge then instead break
          possibilityMovesArr.push(i);
          break;
        }
        if (!this.logicMovement(i + 7, possibilityMoves)) break;
      }
      // go RIGHT TOP from bishop index
      for (let i = index; i >= 0; i -= 7) {
        if (this.isOnTheEdge("right", i) || this.isOnTheEdge("top", i)) {
          if (i === index) break; // if bishop stay in the botton / left edge then instead break
          possibilityMovesArr.push(i);
          break;
        }
        if (!this.logicMovement(i - 7, possibilityMoves)) break;
      }
    };
    diagonallyStartLeftTop(possibilityMoves);
    diagonallyStartRightTop(possibilityMoves);
    return possibilityMoves;
  }
  moveKnight(index) {
    // skoczek
    // it have 8 possibilities to move, its always 2 place in horizontal/verticale and then 1 place in vertical/horizontal
    let possibilityMoves = [];
    const { turn } = this.state;
    const moveKnight = possibilityMovesArr => {
      let possibilitiesIndexes = [
        index - 10,
        index - 17,
        index + 15,
        index + 6,
        index - 15,
        index - 6,
        index + 17,
        index + 10
      ];
      const column = index % 8;
      const row = Math.floor(index / 8);
      // rejected this that doesnt match
      // COLUMNS
      if (column === 0) {
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index - 10
        );
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index + 6
        );
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index - 17
        );
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index + 15
        );
      }
      if (column === 1) {
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index - 10
        );
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index + 6
        );
      }
      if (column === 7) {
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index + 10
        );
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index - 6
        );
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index + 17
        );
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index - 15
        );
      }
      if (column === 6) {
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index + 10
        );
        possibilitiesIndexes = possibilitiesIndexes.filter(
          item => item !== index - 6
        );
      }

      // ROWS

      if (row === 0) {
        possibilitiesIndexes.filter(item => item !== index - 10);
        possibilitiesIndexes.filter(item => item !== index - 17);
        possibilitiesIndexes.filter(item => item !== index - 15);
        possibilitiesIndexes.filter(item => item !== index - 6);
      }
      if (row === 1) {
        possibilitiesIndexes.filter(item => item !== index - 17);
        possibilitiesIndexes.filter(item => item !== index - 15);
      }
      if (row === 7) {
        possibilitiesIndexes.filter(item => item !== index + 10);
        possibilitiesIndexes.filter(item => item !== index + 17);
        possibilitiesIndexes.filter(item => item !== index + 15);
        possibilitiesIndexes.filter(item => item !== index + 6);
      }
      if (row === 6) {
        possibilitiesIndexes.filter(item => item !== index + 6);
        possibilitiesIndexes.filter(item => item !== index + 10);
      }

      possibilitiesIndexes.forEach(item => {
        if (item >= 0 && item < 64) {
          this.logicMovement(item, possibilityMoves);
        }
      });
    };

    moveKnight(possibilityMoves);
    return possibilityMoves;
  }
  isPoolEmpty(index) {
    const { board } = this.state;
    return board[index] === 0;
  }
  isPoolContainYourPawn(index) {
    const { board, turn } = this.state;
    if (turn === "player1") {
      return board[index] >= 1 && board[index] <= 6;
    } else if (turn === "player2") {
      return board[index] >= 11 && board[index] <= 16;
    }
  }

  // put index and array, it will push if can move there or can beat enemy pawn or return false just because this method is used in loop basically(BUT NOT ALWAYS), it help to break it
  logicMovement(i, array) {
    // its empty => PUSH TO ARRAY
    // its your pawn => break; these function return false then, and in the loop it means break;
    // its enemy pawn => PUSH TO ARRAY AND THEN BREAK;
    if (this.isPoolEmpty(i)) {
      array.push(i);
    } else {
      if (this.isPoolContainYourPawn(i)) {
        return false;
      } else {
        array.push(i);
        return false;
      }
    }

    return true;
  }
  moveRook(index) {
    // rook can move in 4 directions(N E S W) for full length
    let possibilityMoves = [];
    const rookMoveVertical = possibilityMovesArr => {
      // go down
      for (let i = index + 8; i < 64; i += 8) {
        if (!this.logicMovement(i, possibilityMovesArr)) break;
      }
      // go up
      for (let i = index - 8; i >= 0; i -= 8) {
        if (!this.logicMovement(i, possibilityMovesArr)) break;
      }
    };
    const rookMoveHorizontal = possibilityMovesArr => {
      const lane = Math.floor(index / 8);
      const rangeIndexStart = lane * 8;
      const rangeIndexEnd = lane * 8 + 8;
      //go left
      for (let i = index - 1; i >= rangeIndexStart; i--) {
        if (!this.logicMovement(i, possibilityMovesArr)) break;
      }
      //go right
      for (let i = index + 1; i < rangeIndexEnd; i++) {
        if (!this.logicMovement(i, possibilityMovesArr)) break;
      }
    };
    rookMoveVertical(possibilityMoves);
    rookMoveHorizontal(possibilityMoves);
    return possibilityMoves;
  }
  movePawn(index) {
    const { turn } = this.state;
    const possibilityMoves = [];
    const movePawnUp = possibilityMovesArr => {
      turn === "player1" && this.logicMovement(index + 8, possibilityMovesArr);
      turn === "player2" && this.logicMovement(index - 8, possibilityMovesArr);
    };
    const checkIfFirstMove = possibilityMovesArr => {
      if (turn === "player1") {
        // 2nd row
        if (index >= 8 && index <= 15) {
          this.logicMovement(index + 16, possibilityMovesArr);
        }
      }

      if (turn === "player2") {
        // 6th row
        if (index >= 48 && index <= 55) {
          this.logicMovement(index - 16, possibilityMovesArr);
        }
      }
    };
    movePawnUp(possibilityMoves);
    checkIfFirstMove(possibilityMoves);
    return possibilityMoves;
  }
  moveKing(index) {
    // king can move to 1 pool to every direciton
    let possibilityMoves = [];
    const moveKingInEveryDirection = possibilityMovesArr => {
      let possibilityMoves = [
        index - 9,
        index - 8,
        index - 7,
        index - 1,
        index + 1,
        index + 7,
        index + 8,
        index + 9
      ];
      if (this.isOnTheEdge("top", index)) {
        possibilityMoves = possibilityMoves.filter(item => item !== index - 9);
        possibilityMoves = possibilityMoves.filter(item => item !== index - 8);
        possibilityMoves = possibilityMoves.filter(item => item !== index - 7);
      }
      if (this.isOnTheEdge("bottom", index)) {
        possibilityMoves = possibilityMoves.filter(item => item !== index + 7);
        possibilityMoves = possibilityMoves.filter(item => item !== index + 8);
        possibilityMoves = possibilityMoves.filter(item => item !== index + 9);
      }
      if (this.isOnTheEdge("left", index)) {
        possibilityMoves = possibilityMoves.filter(item => item !== index - 9);
        possibilityMoves = possibilityMoves.filter(item => item !== index - 1);
        possibilityMoves = possibilityMoves.filter(item => item !== index + 7);
      }
      if (this.isOnTheEdge("right", index)) {
        possibilityMoves = possibilityMoves.filter(item => item !== index - 7);
        possibilityMoves = possibilityMoves.filter(item => item !== index + 1);
        possibilityMoves = possibilityMoves.filter(item => item !== index + 9);
      }
      possibilityMoves.forEach(item =>
        this.logicMovement(item, possibilityMovesArr)
      );
    };

    moveKingInEveryDirection(possibilityMoves);
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
