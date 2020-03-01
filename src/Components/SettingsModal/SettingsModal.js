import React from "react";

const SettingsModal = ({
  isOpen,
  showPossibilityMoves,
  togglePossibilityMovesFunc,
  toggleDarkMoveFn,
  isDarkMode,
  resetGameFunc
}) => {
  const handleHover = e => {
    const buttons = document.querySelectorAll(".buttons .button");
    if (e.target.classList.contains("active")) {
      buttons.forEach(button => button.classList.toggle("active"));
    }
  };
  return (
    <>
      <div className={`settingModal ${isOpen && "active"}`}>
        <div
          className={`showPossibilityMovesSetting ${showPossibilityMoves &&
            "active"}`}
        >
          <span>Pokaż możliwości ruchów</span>
          <div className="slider" onClick={togglePossibilityMovesFunc}>
            <div className="circle"></div>
          </div>
        </div>
        <div className={`darkModeSetting ${isDarkMode && "active"}`}>
          <span>Włącz tryb dzienny / nocny</span>
          <div className="slider" onClick={toggleDarkMoveFn}>
            <div className="circle"></div>
          </div>
        </div>
        <div className="buttons">
          <button
            className="button toggleRules active"
            onMouseOver={e => handleHover(e)}
          >
            Zobacz poradnik
          </button>
          <button
            className="button reset "
            onClick={resetGameFunc}
            onMouseOver={e => handleHover(e)}
          >
            Zacznij od nowa
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
