import React from "react";
import { Col, FormGroup, Form, Button, Input, InputGroup } from "reactstrap";
import { isEmpty } from "lodash";

import * as api from "../../../blockchain/api";
import img0 from "../../../img/0.png";
import img1 from "../../../img/1.png";
import img2 from "../../../img/2.png";
import img3 from "../../../img/3.png";
import img4 from "../../../img/4.png";
import img5 from "../../../img/5.png";
import img6 from "../../../img/6.png";
import img7 from "../../../img/7.png";
import img8 from "../../../img/8.png";
import img9 from "../../../img/9.png";
import img10 from "../../../img/10.png";
import img11 from "../../../img/11.png";
import img12 from "../../../img/12.png";
import img13 from "../../../img/13.png";
import img14 from "../../../img/14.png";

export default class MainGame extends React.Component {
  state = {
    shownLetters: "",
    word: "",
    turnsLeft: "",
    guessing: false,
    letter: "",
    images: [],
  };

  componentDidMount() {
    const { currentGame, shownLetters, lettersGuessed } = this.props;
    this.setState({ word: currentGame.word });
    this.setState({ shownLetters: shownLetters });
    this.images = [
      img0,
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      img7,
      img8,
      img9,
      img10,
      img11,
      img12,
      img13,
      img14,
    ];
  }

  postGuess = async (l) => {
    this.setState({ guessing: true });
    const letter = l.trim()[0].toUpperCase();
    this.setState({ letter: letter });
    const { currentGame, lettersGuessed, shownLetters } = this.props;
    if (
      !!letter &&
      !!currentGame.game_lobby &&
      !lettersGuessed.includes(letter) &&
      !shownLetters.includes(letter)
    ) {
      try {
        await api.guess(letter, currentGame.game_lobby);
        this.props.onLetterSent();
        this.props.fetchLetters();
      } catch (error) {
        alert(error);
      }
    }
    setTimeout(
      function () {
        this.setState({ letter: "" });
      }.bind(this),
      500
    );
    this.setState({ guessing: false });
  };

  onLetterChanged = (e) => {
    if (!this.guessing && this.state.letter.length < 1) {
      this.postGuess(e.target.value);
    }
  };

  renderGameInfo = () => {
    const { shownLetters, currentUser, currentGame, openInviteUserModal } =
      this.props;

    const buttonVisibility =
      !!currentGame.game_lobby && currentGame.admin === currentUser.username
        ? "visible"
        : "hidden";

    return (
      <h5 className="d-flex justify-content-between align-items-baseline">
        <span>#{currentGame.game_lobby}</span>
        {
          <Button
            color={shownLetters.length > 0 ? "outline-warning" : "warning"}
            className="ml-3"
            onClick={openInviteUserModal}
            style={{
              visibility: buttonVisibility,
            }}
          >
            Invite
          </Button>
        }
      </h5>
    );
  };

  renderImage = () => {
    const { turnsLeft } = this.props;

    var imgIndex = turnsLeft;

    if (turnsLeft < 0) {
      imgIndex = 0;
    } else if (turnsLeft > 14) {
      imgIndex = 14;
    }
    return (
      <img
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
        }}
        width="490"
        height="450"
        alt="Snowman"
        src={this.images[imgIndex]}
      />
    );
  };

  renderGameLetters = () => {
    const { shownLetters, lettersGuessed, currentGame } = this.props;
    const word = currentGame.word;
    let result = "";
    for (var i = 0; i < word.length; i++) {
      let c = shownLetters.includes(word.charAt(i)) ? word.charAt(i) : "_";
      result = result + c;
    }
    return (
      <div
        className="flex-grow-1 d-flex flex-column justify-content-end"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ overflow: "auto", display: "flex" }} ref="lettersGuessed">
          {
            <p
              style={{
                color: "red",
                letterSpacing: "6px",
                fontSize: "22px",
              }}
            >
              {lettersGuessed}
            </p>
          }
        </div>
        <div style={{ overflow: "auto", display: "flex" }} ref="shownLetters">
          {
            <p
              style={{
                color: "white",
                letterSpacing: "4px",
                fontSize: "40px",
              }}
            >
              {result}
            </p>
          }
        </div>
      </div>
    );
  };

  rendergameInputForm = () => {
    const { currentGame, gameResult } = this.props;
    return (
      <Form
        className="mt-3"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onSubmit={this.postGuess}
      >
        <FormGroup
          className="mb-0"
          style={{ width: "150px", alignItems: "center" }}
        >
          <InputGroup>
            <Input
              type="text"
              autoComplete="letter"
              placeholder="guess a letter..."
              className="guess-input"
              value={this.state.letter}
              disabled={!currentGame.game_lobby || gameResult !== "ongoing"}
              onChange={this.onLetterChanged}
            />
          </InputGroup>
        </FormGroup>
      </Form>
    );
  };

  renderResult = () => {
    const { gameResult, openNewRoundModal, currentGame, currentUser } =
      this.props;
    var str;
    var color;

    if (gameResult === "won") {
      str = "YOU SAVED THE SNOWMAN!";
      color = "white";
    } else if (gameResult === "lost") {
      color = "red";
      str = "The snowman died... :(";
    }

    const buttonVisibility =
      gameResult !== "ongoing" &&
      currentGame.admin_pubkey ===
        currentUser.pubKey.toString("hex").toUpperCase()
        ? "visible"
        : "hidden";

    return (
      <div className="d-flex justify-content-center">
        <h1 style={{ color: color }}>{str}</h1>
        <Button
          className="newRoundBtn"
          color="outline-warning"
          onClick={openNewRoundModal}
          style={{
            visibility: buttonVisibility,
          }}
        >
          New Round
        </Button>
      </div>
    );
  };

  render() {
    const { currentGame } = this.props;
    return (
      <Col
        id="main-game"
        className="p-3 gameroom-main-game d-flex flex-column justify-content-end"
      >
        {!isEmpty(currentGame) && (
          <>
            {this.renderGameInfo()}
            {this.renderImage()}
            {this.renderGameLetters()}
            {this.renderResult()}
            {this.rendergameInputForm()}
          </>
        )}
      </Col>
    );
  }
}
