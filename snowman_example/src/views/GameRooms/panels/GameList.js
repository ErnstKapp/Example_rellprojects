import React from 'react';
import { Button, Col } from 'reactstrap';
import { isEmpty } from 'lodash';

class GameList extends React.Component {

  render() {
    const { currentGame, games, addGame, composeSwitchGame } = this.props;
    return (
      <Col className="p-3 gameroom-game-list" id="game-list">
        <h5 className="d-flex justify-content-between align-items-baseline">
          <span>Game List</span>
          <Button color={isEmpty(games) ? "warning" : "outline-light"} onClick={addGame}>+</Button>
        </h5>
        {(games || []).map(game => (
          <div
            key={game.game_lobby}
            className={`game-list-item hand ${game.game_lobby === currentGame.game_lobby ? 'active' : ''}`}
            onClick={composeSwitchGame(game.game_lobby)}
          >
            #{game.game_lobby}
          </div>
        ))}
      </Col>
    )
  }
}

export default GameList;