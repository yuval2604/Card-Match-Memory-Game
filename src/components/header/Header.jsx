import React from "react";

const Header = ({
  restartGame,
  handleClickButton,
  handleClickUndo,
  score,
  playerNum,
}) => (
  <div className="grid-header-container">
    <div className="justify-left timer"></div>
    <div className="justify-center game-status-text">
      <div>Player {playerNum} is playing RN</div>
      <div>
        Player one have {score[0]} points and player two {score[1]} points{" "}
      </div>
      <button variant="outline-primary" onClick={() => handleClickButton(8)}>
        8
      </button>{" "}
      <button variant="outline-primary" onClick={() => handleClickButton(16)}>
        16
      </button>{" "}
      <button variant="outline-primary" onClick={() => handleClickButton(24)}>
        24
      </button>{" "}
      <button variant="outline-primary" onClick={handleClickUndo}>
        UNDO
      </button>{" "}
    </div>
    <div className="justify-end">
      <button onClick={restartGame} className="restart-button">
        Restart Game
      </button>
    </div>
  </div>
);

export default Header;
