import React from "react";

const SettingsModal = ({
  isOpen,
  showPossibilityMoves,
  togglePossibilityMovesFunc,
  toggleDarkMoveFn,
  isDarkMode
}) => (
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
    </div>
  </>
);

export default SettingsModal;
