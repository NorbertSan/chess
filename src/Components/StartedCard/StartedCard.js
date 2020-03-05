import React from "react";
import leftArrow from "../../assets/icons/leftArrow.svg";
import rightArrow from "../../assets/icons/rightArrow.svg";
import KeyboardEventHandler from "react-keyboard-event-handler";

const gameRules = [
  "Wieża porusza się o dowolną liczbę wolnych pól w poziomie i pionie; porusza się ona również podczas roszady (specjalnego ruchu króla)",
  "Goniec może ruszać się o dowolną liczbę wolnych pól po przekątnych.",
  "Hetman porusza się o dowolną liczbę wolnych pól w poziomie, pionie i na ukos (łączy w ten sposób w sobie ruchy wieży i gońca).",
  "Skoczek rusza się na najbliższe pole nie znajdujące się w tym samym rzędzie, kolumnie lub przekątnej; innymi słowy poruszają się one o dwa pola na kształt wieży, a następnie jedno pole prostopadle do tego kierunku. Ruch skoczka nie jest blokowany przez inne bierki, tzn. „skacze” on na nowe pole. Ruchy skoczka opisuje się także porównując je do litery „L” lub cyfry „7” (lub dowolnej odbitej, w poziomie i pionie, ich postaci), przy czym wykonuje on dwa kroki w danym kierunku, 90° zwrot w jednym z kierunków i krok w nowo wybranych kierunku.",
  "Pion ma najbardziej rozbudowane zasady poruszania się: ⚫ Pion może poruszyć się o jedno pole naprzód, o ile nie jest ono zajęte. Jeżeli nie wykonano danym pionem posunięcia, to w pierwszym ruchu ma on możliwość wykonania ruchu o dwa pola naprzód, o ile żadne z tych pól nie jest zajęte. Pion nie może ruszać się do tyłu. ⚫ Piony są jedynymi bierkami, które biją inaczej niż się poruszają. Mogą one zbić wrogą bierkę, jeśli znajduje się ona na jednym z dwóch pól sąsiadujących w poziomie z polem przed nimi (tzn. z pól na ukos przed nimi), lecz nie mogą się tam ruszyć, jeśli pola te są wolne.Piony mają również dwa szczególne posunięcia: en passant (bicie w przelocie) oraz promocję [zobacz dalej]",
  "Bicie w przelocie (En passant) Jeśli gracz A wykona ruch pionem o dwa pola, zaś gracz B ma piona w piątym, patrząc z jego perspektywy, rzędzie i sąsiadującej kolumnie, to pion gracza B może zbić piona gracza A tak, jak gdyby wykonał on posunięcie o jedno pole. Bicie to można wykonać tylko w ruchu bezpośrednio po ruchu pionem o dwa pola    Promocja piona jeśli pion osiągnie ósmy rząd, to wówczas jest on promowany (zamieniany) na hetmana, wieżę, gońca lub skoczka tego samego koloru, przy czym wybór zależy od gracza",
  "Król może ruszać się o jedno pole w poziomie, pionie lub na ukos. Najwyżej raz w grze każdy z króli może wykonać specjalny ruch zwany roszadą.Roszada składa się z wykonania posunięcia króla o dwa pola w stronę wieży, a następnie umieszczeniu wieży po drugiej stronie króla na polu z nim sąsiadującym. Roszada jest możliwa wyłącznie wtedy, gdy spełnione są wszystkie poniższe warunki: ⚫ król jak i wieża biorąca udział w roszadzie nie wykonały jeszcze posunięcia ⚫ między królem a wieżą nie ma innych bierek ⚫ król nie może być szachowany, nie może przechodzić ani zakończyć ruchu na polu atakowanym przez bierkę przeciwnika  ⚫król oraz wieża muszą znajdować się w tym samym rzędzie"
];

class StartedCard extends React.Component {
  state = {
    index: 0
  };
  componentDidMount() {
    this.setState({ index: 0 });
  }
  componentWillReceiveProps({ keydown }) {
    if (keydown.event) {
      console.log(keydown.event.which);
    }
  }
  handleClickArrow(e, typeArrow) {
    const rulesLength = gameRules.length;
    let { index } = this.state;
    const arrow = e.target;

    if (typeArrow) {
      if (typeArrow === "left") {
        index === 0 ? (index = rulesLength - 1) : index--;
      }
      if (typeArrow === "right") {
        index === rulesLength - 1 ? (index = 0) : index++;
      }
    }

    if (arrow && arrow.classList.contains("right")) {
      index === rulesLength - 1 ? (index = 0) : index++;
    } else if (arrow.classList.contains("left")) {
      index === 0 ? (index = rulesLength - 1) : index--;
    }
    this.setState({ index });
  }

  handleKeyPress(key, e) {
    console.log(key, e);
  }

  render() {
    const { index } = this.state;
    const { handleStartGameFunc } = this.props;
    return (
      <>
        <KeyboardEventHandler
          handleKeys={["right", "left"]}
          onKeyEvent={(key, e) => this.handleClickArrow(e, key)}
        />
        <div className="startedCardWrapper">
          <div className="startedCard">
            <img
              src={leftArrow}
              className="arrow left"
              alt="left arrow"
              onClick={e => this.handleClickArrow(e)}
            />
            <img
              src={rightArrow}
              className="arrow right"
              alt="right arrow"
              onClick={e => this.handleClickArrow(e)}
            />
            <h1 className="startedCard__title">Zagraj w szachy</h1>
            <div className="startedCard__rules">
              <h3>Podstawowe zasady poruszania się</h3>
              <div className="startedCard__rules__singleRule active">
                <span className="counter">{`${index + 1}.`}</span>
                <span className="ruleDescription">{gameRules[index]}</span>
              </div>
            </div>
            <button
              className="startedCard__button"
              onClick={handleStartGameFunc}
            >
              Zacznij gre !{" "}
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default StartedCard;
