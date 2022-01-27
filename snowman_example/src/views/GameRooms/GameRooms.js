import React from "react";
import { isEmpty } from "lodash";

import auth from "../../blockchain/auth";
import * as api from "../../blockchain/api";

import TopNav from "./panels/TopNav";
import GameList from "./panels/GameList";
import MainGame from "./panels/MainGame";
import AddGameModal from "./modals/AddGameModal";
import RegisterUserModal from "./modals/RegisterUserModal";
import InviteGameModal from "./modals/InviteGameModal";
import NewRoundModal from "./modals/NewRoundModal";

class GameRooms extends React.Component {
  state = {
    currentGame: "",
    games: [],
    shownLetters: [],
    lettersGuessed: [],
    turnsLeft: null,
    gameResult: "ongoing",
    token: "",
    isAddGameModalVisible: false,
    isRegisterModalVisible: false,
    isInviteModalVisible: false,
    isNewRoundModalVisible: false,
  };

  fetchGamesInterval = null;
  fetchLettersInterval = null;
  fetchTurnsLeftInterval = null;

  componentDidMount() {
    this.fetchGamesInterval = setInterval(this.fetchGameList, 1000);
    this.fetchLettersInterval = setInterval(this.fetchLetters, 1000);
    this.fetchTurnsLeftInterval = setInterval(this.fetchTurnsLeft, 1000);
    this.fetchGameList();
    this.fetchLetters();
    this.fetchTurnsLeft();
    this.fetchUserBalance();
  }

  componentWillUnmount() {
    if (this.fetchGamesInterval !== null)
      clearInterval(this.fetchGamesInterval);
    if (this.fetchLettersInterval !== null)
      clearInterval(this.fetchLettersInterval);
    if (this.fetchTurnsLeftInterval !== null)
      clearInterval(this.fetchTurnsLeftInterval);
  }

  fetchGameList = async () => {
    try {
      const result = await api.getGames();
      if (result.length > 0 && isEmpty(this.state.games)) {
        this.setState({
          games: result,
          currentGame: result[0],
        });
      } else {
        this.setState({ games: result });
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchLetters = async () => {
    try {
      if (this.state.currentGame.game_lobby) {
        const gameName = this.state.currentGame.game_lobby;
        const result = await api.showLetters(gameName);
        if (gameName === this.state.currentGame.game_lobby) {
          this.setState({ shownLetters: result });
        }
      }
    } catch (error) {
      console.error(error);
    }
    try {
      if (this.state.currentGame.game_lobby) {
        const gameName = this.state.currentGame.game_lobby;
        const result = await api.lettersGuessed(gameName);
        if (gameName === this.state.currentGame.game_lobby) {
          this.setState({ lettersGuessed: result });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchTurnsLeft = async () => {
    try {
      if (this.state.currentGame.game_lobby) {
        const gameName = this.state.currentGame.game_lobby;
        const result = await api.turnsLeft(gameName);
        if (gameName === this.state.currentGame.game_lobby) {
          this.setState({ turnsLeft: result });
          this.checkResult();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  checkResult = () => {
    if (this.state.currentGame.word.length === this.state.shownLetters.length) {
      this.setState({ gameResult: "won" });
    } else if (this.state.turnsLeft < 1) {
      this.setState({ gameResult: "lost" });
    }
  };

  logout = () => {
    auth.logout();
    this.props.onLogoutSuccessful();
  };

  fetchUserBalance = async () => {
    try {
      const balance = await api.getBalance();
      this.setState({ token: balance });
      console.log("HERE");
      console.log(balance);
    } catch (error) {
      console.error(error);
    }
  };

  composeSwitchGame = (gameName) => () => {
    const newGame = this.state.games.find(
      (game) => game.game_lobby === gameName
    );
    if (newGame) {
      this.setState({
        currentGame: newGame,
        shownLetters: [],
        turnsLeft: null,
        gameResult: "ongoing",
      });
    }
  };

  toggleAddGameModal = () =>
    this.setState({ isAddGameModalVisible: !this.state.isAddGameModalVisible });
  toggleRegisterModal = () =>
    this.setState({
      isRegisterModalVisible: !this.state.isRegisterModalVisible,
    });
  toggleInviteModal = () =>
    this.setState({ isInviteModalVisible: !this.state.isInviteModalVisible });
  toggleNewRoundModal = () =>
    this.setState({
      isNewRoundModalVisible: !this.state.isNewRoundModalVisible,
    });

  render() {
    const { currentUser } = this.props;
    const {
      currentGame,
      games,
      shownLetters,
      lettersGuessed,
      turnsLeft,
      gameResult,
      isAddGameModalVisible,
      isRegisterModalVisible,
      isInviteModalVisible,
      isNewRoundModalVisible,
      token,
    } = this.state;
    return (
      <>
        <div className="gameroom-wrapper">
          <TopNav
            username={currentUser.username}
            logout={this.logout}
            token={token}
            openRegisterModal={this.toggleRegisterModal}
          />
          <MainGame
            shownLetters={shownLetters}
            lettersGuessed={lettersGuessed}
            turnsLeft={turnsLeft}
            currentUser={currentUser}
            currentGame={currentGame}
            gameResult={gameResult}
            openInviteUserModal={this.toggleInviteModal}
            openNewRoundModal={this.toggleNewRoundModal}
            onLetterSent={this.fetchUserBalance}
            fetchLetters={this.fetchLetters}
          />
          <GameList
            addGame={this.toggleAddGameModal}
            composeSwitchGame={this.composeSwitchGame}
            games={games}
            currentGame={currentGame}
          />
        </div>
        <AddGameModal
          isOpen={isAddGameModalVisible}
          closeModal={this.toggleAddGameModal}
          onGameAdded={this.fetchUserBalance}
        />
        <RegisterUserModal
          isOpen={isRegisterModalVisible}
          closeModal={this.toggleRegisterModal}
          onUserCreated={this.fetchUserBalance}
        />
        <InviteGameModal
          isOpen={isInviteModalVisible}
          closeModal={this.toggleInviteModal}
          gameName={currentGame.game_lobby}
          onUserInvited={this.fetchUserBalance}
        />
        <NewRoundModal
          isOpen={isNewRoundModalVisible}
          closeModal={this.toggleNewRoundModal}
          gameName={currentGame.game_lobby}
          onNewRoundCreated={this.fetchUserBalance}
        />
      </>
    );
  }
}

export default GameRooms;
