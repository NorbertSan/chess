import React from "react";

const SettingsModal = ({
  isOpen,
  showPossibilityMoves,
  togglePossibilityMovesFunc
}) => (
  <>
    <div className={`settingModal ${isOpen && "active"}`}>
      <div
        className={`showPossibilityMovesSetting ${showPossibilityMoves &&
          "active"}`}
      >
        <span>Pokaż możliwości ruchów</span>
        <div
          className="possibilityMovesLabel"
          onClick={togglePossibilityMovesFunc}
        >
          <div className="circle"></div>
        </div>
      </div>
    </div>
  </>
);

export default SettingsModal;
