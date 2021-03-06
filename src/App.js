import React from "react";
import "./style.css";
import {
  player1Name,
  player2Name,
  player1Pawns,
  player2Pawns,
  player1PawnsIndexes,
  player2PawnsIndexes,
  freeSpace
} from "./config";
import Board from "./Components/Board/Board";
import Heading from "./Components/Heading/Heading";
import PlayerBoard from "./Components/PlayerBoard/PlayerBoard";
import StartedCard from "./Components/StartedCard/StartedCard";
import ModalLabel from "./Components/ModalLabel/ModalLabel";
import SettingsModal from "./Components/SettingsModal/SettingsModal";
import CheckAlert from "./Components/CheckAlert/CheckAlert";
import WinnerCard from "./Components/WinnerCard/WinnerCard";
import PromotionPawnCard from "./Components/PromotionPawnCard/PromotionPawnCard";

class App extends React.Component {
  state = {
    startGame: false,
    showPossibilityMoves: true,
    darkMode: false
  };

  handleResetGame = () => {
    const { timer } = this.state;
    clearInterval(timer);
    this.setState({
      startGame: false,
      timer: null
    });
  };

  handleToggleDarkMode = () => {
    this.setState(
      prevState => ({
        darkMode: !prevState.darkMode
      }),
      () => {
        if (this.state.darkMode) {
          document.body.classList.add("darkMode");
        } else {
          document.body.classList.remove("darkMode");
        }
      }
    );
  };

  handleToggleShowPossibilitySetting = () => {
    this.setState(prevState => ({
      showPossibilityMoves: !prevState.showPossibilityMoves
    }));
  };
  handleToggleSettingsModal = () => {
    this.setState(prevState => ({
      isSettingsOpen: !prevState.isSettingsOpen
    }));
  };

  handleStartGameClick = () => {
    this.setState({
      startGame: true
    });
    this.setInitialState();
  };

  setInitialState() {
    const timer = this.timer();
    const board = this.setBoard();
    this.setState(prevState => ({
      timer,
      turn: player2Name,
      board,
      player1Pawns,
      player2Pawns,
      possibilityMoves: [],
      clickedIndex: null,
      player1BeatenPawns: [],
      player2BeatenPawns: [],
      isGameOver: false,
      winner: null,
      enPassantPossibility: null, // its index where pawn A stay, its pawn wchich is going to beat
      esPassantBeatenIndex: null, // its index where pawn B have to be when want to beat pawn A
      timePlayer1: 0, // IN SECONDS
      timePlayer2: 0,
      isSettingsOpen: false,
      darkMode: prevState.darkMode,
      showPossibilityMoves: prevState.showPossibilityMoves,
      player1Check: false,
      player2Check: false,
      player1Castling: {
        kingWasMoved: false,
        leftRookWasMoved: false,
        rightRookWasMoved: false
      },
      player2Castling: {
        kingWasMoved: false,
        leftRookWasMoved: false,
        rightRookWasMoved: false
      },
      castlingPossibility: [],
      promotionPawn: {
        player: null,
        position: null
      }
    }));
  }

  handlePromotionPawnOption = e => {
    let { board, promotionPawn } = this.state;
    const pawn = e.target;
    const newPawnIndex = parseInt(pawn.dataset.index);
    const position = promotionPawn.position;
    console.log(newPawnIndex, promotionPawn.position);
    board[position] = newPawnIndex;
    console.log(board);
    this.setState({
      board,
      promotionPawn: {
        player: null,
        position: null
      }
    });
  };

  checkController() {
    // CZY JEST SZACH
    // after every move check all possibilities moves from player moved in that moment
    // player1 move => player1 all possibilities moves
    // THIS FUNC IS INVOKED AFTER BOARD UPDATE AND BEFORE CHANGE TURN
    // I HAVE TO INVOKED THIS FUNC FOR 2 PLAYERS, AFTER EVERY MOVE

    const returnPawnArray = () => {
      if (turn === player1Name) {
        const allPawnsPlayer1 = [];
        board.forEach((square, index) => {
          Object.entries(player1PawnsIndexes).forEach(item => {
            item[1] === square && allPawnsPlayer1.push([item[0], index]);
          });
        });
        return allPawnsPlayer1;
      } else if (turn === player2Name) {
        const allPawnsPlayer2 = [];
        board.forEach((square, index) => {
          Object.entries(player2PawnsIndexes).forEach(item => {
            item[1] === square && allPawnsPlayer2.push([item[0], index]);
          });
        });
        return allPawnsPlayer2;
      }
    };
    const getMovesOfSinglePawn = item => {
      const [pawn, index] = item;
      return this.possibilityMovesFunc[pawn](index);
    };
    const getEnemyKingPosition = () => {
      if (turn === player1Name) {
        const kingIndex = player2PawnsIndexes.king;
        return board.findIndex(square => square === kingIndex);
      } else if (turn === player2Name) {
        const kingIndex = player1PawnsIndexes.king;
        return board.findIndex(square => square === kingIndex);
      }
    };
    const checkIfKingIsOnEnemyRange = (kingPos, moves) => {
      return moves.includes(kingPosition);
    };
    const setCheckState = boolean => {
      if (turn === player1Name) {
        this.setState({
          [`player2Check`]: boolean
        });
      } else if (turn === player2Name) {
        this.setState({
          [`player1Check`]: boolean
        });
      }
    };

    const { turn, board } = this.state;
    const allMoves = [];
    const array = returnPawnArray();
    array.forEach(item => {
      allMoves.push(...getMovesOfSinglePawn(item));
    });
    const kingPosition = getEnemyKingPosition();
    const boolean = checkIfKingIsOnEnemyRange(kingPosition, allMoves);
    setCheckState(boolean);
  }

  start() {
    this.timer();
    const board = this.setBoard();
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
      if (player === player1Name) {
        indexes = player1PawnsIndexes;
      } else if (player === player2Name) {
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
      if (player === player1Name) {
        indexes = player1PawnsIndexes;
      } else if (player === player2Name) {
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
    firstLine(player1Name);
    secondLine(player1Name);
    freePlaces();
    secondLine(player2Name);
    firstLine(player2Name);
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
      if (turn === player1Name) {
        if (board[newIndex] >= 11 && board[newIndex] <= 16) boolean = true;
      } else if (turn === player2Name) {
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
    presentPlayer === player1Name
      ? (nextPlayer = player2Name)
      : (nextPlayer = player1Name);
    this.setState({
      turn: nextPlayer
    });
  }
  timer = () => {
    const timer = setInterval(() => {
      let { turn, timePlayer1, timePlayer2 } = this.state;
      if (turn === player1Name) {
        timePlayer1++;
        this.setState({ timePlayer1 });
      } else if (turn === player2Name) {
        timePlayer2++;
        this.setState({ timePlayer2 });
      }
    }, 1000);
    return timer;
  };

  ifClickSamePlaceTwoTimes(clickedIndex) {
    if (clickedIndex === this.state.clickedIndex) return true;
    else return false;
  }
  ifItCorrectTurn(clickedIndex) {
    const { turn, board } = this.state;
    const clickedPawn = board[clickedIndex];
    let boolean = false;
    if (turn === player1Name) {
      if (clickedPawn >= 1 && clickedPawn <= 6) boolean = true;
    } else if (turn === player2Name) {
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

    if (this.ifClickSamePlaceTwoTimes(clickedIndex)) return;
    // IF SOMETHING IS ALREADY CLICKED
    if (this.state.clickedIndex || this.state.clickedIndex === 0) {
      // 1. check out if clicked index is in possibility moves
      // 2. update board
      if (this.isInPossibilityMoves(clickedIndex)) {
        const clickedIndexOld = this.state.clickedIndex;
        this.enPassantController(clickedIndexOld, clickedIndex);
        this.castlingController(clickedIndexOld, clickedIndex);
        this.promotionController(clickedIndexOld, clickedIndex);
        const beatenPawn = await this.updateBoard(clickedIndex);
        beatenPawn && (await this.updateBeatenPawns(beatenPawn));
        this.resetPossibilityMoves();
        this.resetClicked();
        await this.checkController();
        await this.changeTurn();
        this.checkController();
        this.isGameOver();
      }
      this.resetClicked();
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

  promotionController(clickedIndexOld, clickedIndex) {
    const { board, turn } = this.state;
    // check if its pawn && its on first/last row
    if (
      turn === player1Name &&
      clickedIndex >= 56 &&
      clickedIndex <= 63 &&
      board[clickedIndexOld] === player1PawnsIndexes.pawn
    ) {
      this.setState({
        promotionPawn: {
          player: player1Name,
          position: clickedIndex
        }
      });
    } else if (
      turn === player2Name &&
      clickedIndex >= 0 &&
      clickedIndex <= 7 &&
      board[clickedIndexOld] === player2PawnsIndexes.pawn
    ) {
      this.setState({
        promotionPawn: {
          player: player2Name,
          position: clickedIndex
        }
      });
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
  isGameOver() {
    const { player1BeatenPawns, player2BeatenPawns } = this.state;
    const player1King = player1PawnsIndexes.king;
    const player2King = player2PawnsIndexes.king;
    if (player1BeatenPawns.includes(player2King)) {
      this.setState({
        isGameOver: true,
        winner: player1Name
      });
    }
    if (player2BeatenPawns.includes(player1King)) {
      this.setState({
        isGameOver: true,
        winner: player2Name
      });
    }
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
    if (turn === player1Name) {
      return board[index] >= 1 && board[index] <= 6;
    } else if (turn === player2Name) {
      return board[index] >= 11 && board[index] <= 16;
    }
  }
  isEnemyPawnThere(index) {
    const { board, turn } = this.state;
    if (turn === player1Name) return board[index] >= 11 && board[index] <= 16;
    if (turn === player2Name) return board[index] >= 1 && board[index] <= 6;
  }
  enPassantController(clickedIndexOld, index) {
    // bicie w przelocie
    const { board, esPassantBeatenIndex, enPassantPossibility } = this.state;
    const isBeatedInEnPassant = () => index === esPassantBeatenIndex;
    const updateBoardAfterEnPassant = () => {
      this.updateBeatenPawns(board[enPassantPossibility]);
      board[enPassantPossibility] = 0;
    };

    if (
      (board[clickedIndexOld] === player1PawnsIndexes.pawn ||
        board[clickedIndexOld] === player2PawnsIndexes.pawn) &&
      Math.abs(index - clickedIndexOld) === 16
    ) {
      this.setState({ enPassantPossibility: index });
    } else {
      if (isBeatedInEnPassant()) updateBoardAfterEnPassant();
      this.setState({ enPassantPossibility: null, esPassantBeatenIndex: null });
    }
  }

  kingController(clickedIndexOld) {
    if (clickedIndexOld === 4)
      this.setState(prevState => ({
        player1Castling: {
          kingWasMoved: true,
          leftRookWasMoved: prevState.player1Castling.leftRookWasMoved,
          rightRookWasMoved: prevState.player1Castling.rightRookWasMoved
        }
      }));

    if (clickedIndexOld === 60)
      this.setState(prevState => ({
        player2Castling: {
          kingWasMoved: true,
          leftRookWasMoved: prevState.player1Castling.leftRookWasMoved,
          rightRookWasMoved: prevState.player1Castling.rightRookWasMoved
        }
      }));
  }

  castlingController(clickedIndexOld, index) {
    // check if you moving the king
    // check if clicked index is a castling move
    this.rookController(clickedIndexOld);
    this.kingController(clickedIndexOld);

    let { board, castlingPossibility } = this.state;
    const itsKingMove = () => {
      return (
        board[clickedIndexOld] === player1PawnsIndexes.king ||
        board[clickedIndexOld] === player2PawnsIndexes.king
      );
    };
    const itsCastlingMove = () => {
      return castlingPossibility.includes(index);
    };

    if (itsKingMove() && itsCastlingMove()) {
      // move rook, which rook
      console.log("22222");
      if (index === 2) {
        board[0] = 0;
        board[index + 1] = player1PawnsIndexes.rook;
      }

      if (index === 6) {
        board[7] = 0;
        board[index - 1] = player1PawnsIndexes.rook;
      }

      if (index === 58) {
        board[56] = 0;
        board[index + 1] = player2PawnsIndexes.rook;
      }

      if (index === 62) {
        board[63] = 0;
        board[index - 1] = player2PawnsIndexes.rook;
      }
    } else {
      // reset state
      this.setState({
        castlingPossibility: []
      });
    }
  }

  rookController(clickedIndexOld) {
    const { board } = this.state;

    const changeRookCastlingState = () => {
      if (clickedIndexOld === 0) {
        this.setState(prevState => ({
          player1Castling: {
            kingWasMoved: prevState.player1Castling.kingWasMoved,
            leftRookWasMoved: true,
            rightRookWasMoved: prevState.player1Castling.rightRookWasMoved
          }
        }));
      }

      if (clickedIndexOld === 7) {
        this.setState(prevState => ({
          player1Castling: {
            kingWasMoved: prevState.player1Castling.kingWasMoved,
            leftRookWasMoved: prevState.player1Castling.leftRookWasMoved,
            rightRookWasMoved: true
          }
        }));
      }

      if (clickedIndexOld === 56) {
        this.setState(prevState => ({
          player2Castling: {
            kingWasMoved: prevState.player1Castling.kingWasMoved,
            leftRookWasMoved: true,
            rightRookWasMoved: prevState.player1Castling.rightRookWasMoved
          }
        }));
      }

      if (clickedIndexOld === 63) {
        this.setState(prevState => ({
          player2Castling: {
            kingWasMoved: prevState.player1Castling.kingWasMoved,
            leftRookWasMoved: prevState.player1Castling.leftRookWasMoved,
            rightRookWasMoved: true
          }
        }));
      }
    };

    if (
      board[clickedIndexOld] === player1PawnsIndexes.rook ||
      board[clickedIndexOld] === player2PawnsIndexes.rook
    )
      changeRookCastlingState();
  }

  logicMovement(i, array) {
    // put index and array, it will push if can move there or can beat enemy pawn or return false just because this method is used in loop basically(BUT NOT ALWAYS), it help to break it
    // its empty => PUSH TO ARRAY
    // its your pawn => break; these function return false then, and in the loop it means break;
    // its enemy pawn => PUSH TO ARRAY AND THEN BREAK;
    if (this.isPoolEmpty(i)) {
      array.push(i);
    } else if (this.isPoolContainYourPawn(i)) return false;
    else {
      array.push(i);
      return false;
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
    // pawn can move 1 place up or 2 if its first move
    // pawn can beat diagonally, can't beat straight
    const { turn } = this.state;
    const possibilityMoves = [];
    const esPassantMove = possibilityMovesArr => {
      // 1. pawn A had to move 2 pool before this move
      //  pawnB have to move in specific place, in the same row, and in adjacent column
      // 2. check if clickedIndex is one of them
      const { enPassantPossibility } = this.state;
      let placesWherePawnHaveToBe = [
        enPassantPossibility - 1,
        enPassantPossibility + 1
      ];
      let placeWherePawnCanBeat;

      if (enPassantPossibility) {
        if (this.isOnTheEdge("right", enPassantPossibility))
          placesWherePawnHaveToBe = [enPassantPossibility - 1];

        if (this.isOnTheEdge("left", enPassantPossibility))
          placesWherePawnHaveToBe = [enPassantPossibility + 1];

        if (placesWherePawnHaveToBe.includes(index)) {
          // if pawn wchich want to beat enemy pawn is on his left / right side
          // check out if pool behind the pawn wchich is going to beat is empty
          if (turn === player1Name)
            placeWherePawnCanBeat = enPassantPossibility + 8;
          if (turn === player2Name)
            placeWherePawnCanBeat = enPassantPossibility - 8;

          if (this.isPoolEmpty(placeWherePawnCanBeat)) {
            possibilityMovesArr.push(placeWherePawnCanBeat);
            this.setState({
              esPassantBeatenIndex: placeWherePawnCanBeat
            });
          }
        }
      }
    };
    const movePawnUp = possibilityMovesArr => {
      if (turn === player1Name) {
        if (this.isPoolEmpty(index + 8) && index <= 55)
          possibilityMovesArr.push(index + 8);
      }
      if (turn === player2Name) {
        if (this.isPoolEmpty(index - 8) && index >= 8)
          possibilityMovesArr.push(index - 8);
      }
    };
    const firstMove = possibilityMovesArr => {
      if (turn === player1Name) {
        // 2nd row
        if (index >= 8 && index <= 15 && this.isPoolEmpty(index + 8)) {
          if (this.isEnemyPawnThere(index + 16)) return; // just because pawn cant beat straight
          this.logicMovement(index + 16, possibilityMovesArr);
        }
      }

      if (turn === player2Name) {
        // 6th row
        if (index >= 48 && index <= 55 && this.isPoolEmpty(index - 8)) {
          if (this.isEnemyPawnThere(index - 16)) return;
          this.logicMovement(index - 16, possibilityMovesArr);
        }
      }
    };
    const beatDiagonally = possibilityMovesArr => {
      if (turn === player1Name) {
        if (this.isOnTheEdge("left", index)) {
          this.isPoolContainOpponentPawn(index + 9) &&
            this.logicMovement(index + 9, possibilityMovesArr);
        } else if (this.isOnTheEdge("right", index)) {
          this.isPoolContainOpponentPawn(index + 7) &&
            this.logicMovement(index + 7, possibilityMovesArr);
        } else {
          this.isPoolContainOpponentPawn(index + 7) &&
            this.logicMovement(index + 7, possibilityMovesArr);
          this.isPoolContainOpponentPawn(index + 9) &&
            this.logicMovement(index + 9, possibilityMovesArr);
        }
      } else if (turn === player2Name) {
        if (this.isOnTheEdge("left", index)) {
          this.isPoolContainOpponentPawn(index - 7) &&
            this.logicMovement(index - 7, possibilityMovesArr);
        } else if (this.isOnTheEdge("right", index)) {
          this.isPoolContainOpponentPawn(index - 9) &&
            this.logicMovement(index - 9, possibilityMovesArr);
        } else {
          this.isPoolContainOpponentPawn(index - 7) &&
            this.logicMovement(index - 7, possibilityMovesArr);
          this.isPoolContainOpponentPawn(index - 9) &&
            this.logicMovement(index - 9, possibilityMovesArr);
        }
      }
    };

    movePawnUp(possibilityMoves);
    firstMove(possibilityMoves);
    beatDiagonally(possibilityMoves);
    esPassantMove(possibilityMoves);
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

    const castlingMove = possibilityMovesArr => {
      const { turn, board } = this.state;

      const returnKingPosition = () => {
        if (turn === player1Name) {
          return 4;
        } else if (turn === player2Name) {
          return 60;
        }
      };
      const isKingPositionRight = () => {
        if (turn === player1Name)
          return !this.state.player1Castling.kingWasMoved;
        else if (turn === player2Name)
          return !this.state.player2Castling.kingWasMoved;
      };
      const isleftRookPositionRight = () => {
        if (turn === player1Name) {
          return !this.state.player1Castling.leftRookWasMoved;
        } else if (turn === player2Name) {
          return !this.state.player2Castling.leftRookWasMoved;
        }
      };
      const isRightRookPositionRight = info => {
        if (turn === player1Name) {
          return !this.state.player1Castling.rightRookWasMoved;
        } else if (turn === player2Name) {
          return !this.state.player2Castling.rightRookWasMoved;
        }
      };
      const ifLineBetweenRookAndKingIsEmpty = position => {
        const kingPosition = returnKingPosition();
        let squaresToPass = [];
        let boolean = true;

        if (position === "left") {
          squaresToPass = [
            kingPosition - 1,
            kingPosition - 2,
            kingPosition - 3
          ];
        } else if (position === "right") {
          squaresToPass = [kingPosition + 1, kingPosition + 2];
        }
        squaresToPass.forEach(index => {
          if (board[index] !== 0) boolean = false;
        });

        return boolean;
      };
      const isCheck = () => {
        return this.state[`${turn}Check`];
      };
      const setCastlingeMove = index => {
        const castlingMoves = this.state.castlingPossibility;
        castlingMoves.push(index);
        this.setState({
          castlingPossibility: castlingMoves
        });
      };
      if (isKingPositionRight() && !isCheck()) {
        if (
          isleftRookPositionRight() &&
          ifLineBetweenRookAndKingIsEmpty("left")
        ) {
          // castling is possible to left rook
          possibilityMovesArr.push(returnKingPosition() - 2);
          setCastlingeMove(returnKingPosition() - 2);
        }
        if (
          isRightRookPositionRight() &&
          ifLineBetweenRookAndKingIsEmpty("right")
        ) {
          possibilityMovesArr.push(returnKingPosition() + 2);
          setCastlingeMove(returnKingPosition() + 2);
        }
      }
    };

    moveKingInEveryDirection(possibilityMoves);
    castlingMove(possibilityMoves);
    return possibilityMoves;
  }

  isPoolContainOpponentPawn(index) {
    const { board, turn } = this.state;
    if (turn === player1Name) {
      return board[index] >= 11 && board[index] <= 16;
    } else if (turn === player2Name) {
      return board[index] >= 1 && board[index] <= 6;
    }
  }
  setPossibilityMoves(moves) {
    this.setState({
      possibilityMoves: moves
    });
  }

  render() {
    const {
      timePlayer1,
      player1BeatenPawns,
      turn,
      possibilityMoves,
      clickedIndex,
      timePlayer2,
      player2BeatenPawns,
      board,
      startGame,
      isSettingsOpen,
      showPossibilityMoves,
      darkMode,
      winner,
      promotionPawn
    } = this.state;
    return (
      <>
        {!startGame ? (
          <StartedCard handleStartGameFunc={this.handleStartGameClick} />
        ) : (
          <>
            {winner && (
              <WinnerCard
                winner={winner}
                resetGameFunc={this.handleResetGame}
              />
            )}
            {promotionPawn.player && (
              <PromotionPawnCard
                handlePromotionPawnOption={this.handlePromotionPawnOption}
                promotionPawn={promotionPawn}
              />
            )}
            <div
              className={`appWrapper ${winner &&
                "disable"} ${promotionPawn.player && "disable"} `}
            >
              <div
                className={`player1Board ${turn === player1Name && "active"} `}
              >
                <PlayerBoard
                  timer={timePlayer1}
                  player={player1Name}
                  beatenPawns={player1BeatenPawns}
                />
                {this.state.player1Check && (
                  <CheckAlert className="checkPlayer1" />
                )}
              </div>
              <Heading />
              <Board
                showPossibilityMoves={showPossibilityMoves}
                clickBoard={e => this.handleClickBoard(e)}
                board={board}
                possibilityMoves={possibilityMoves}
                clicked={clickedIndex}
              />
              <div
                className={`player2Board ${turn === player2Name && "active"}`}
              >
                <PlayerBoard
                  timer={timePlayer2}
                  player={player2Name}
                  beatenPawns={player2BeatenPawns}
                />

                {this.state.player2Check && (
                  <CheckAlert className="checkPlayer2" />
                )}
              </div>
            </div>
            <ModalLabel
              togglemodal={this.handleToggleSettingsModal}
              isOpen={isSettingsOpen}
            />
            <SettingsModal
              toggleDarkMoveFn={this.handleToggleDarkMode}
              isDarkMode={darkMode}
              isOpen={isSettingsOpen}
              showPossibilityMoves={showPossibilityMoves}
              togglePossibilityMovesFunc={
                this.handleToggleShowPossibilitySetting
              }
              resetGameFunc={this.handleResetGame}
            />
          </>
        )}
      </>
    );
  }
}

export default App;
