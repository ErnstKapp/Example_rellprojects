import React from "react";
import {
  Modal,
  FormGroup,
  ModalBody,
  ModalHeader,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  Form,
  Input,
  Button,
} from "reactstrap";
import * as api from "../../../blockchain/api";

export default class NewRoundModal extends React.Component {
  state = {
    word: "",
    updating: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen && prevProps.isOpen !== this.props.isOpen) {
      this.setState({ word: "" });
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { word } = this.state;
    const { gameName } = this.props;

    if (!gameName || !word) return;
    this.setState({ updating: true });
    try {
      await api.newRound(word.toUpperCase(), gameName);
      this.setState({ updating: false });
      this.props.closeModal();
      this.props.onNewRoundCreated();
    } catch (error) {
      alert(error);
      this.setState({ updating: false });
    }
  };

  onGameWordChanged = (e) => {
    const value =
      e.target.value.length > 0 && e.target.value[0] === "#"
        ? e.target.value.slice(1)
        : e.target.value;

    this.setState({ word: value });
  };

  render() {
    const { isOpen, gameName } = this.props;
    const { updating, word } = this.state;
    return (
      <Modal isOpen={isOpen} toggle={this.props.closeModal}>
        <Form onSubmit={this.onSubmit}>
          <ModalHeader>New round for game: {gameName}</ModalHeader>
          <ModalBody>
            <FormGroup className="mb-0">
              <InputGroup>
                <InputGroupAddon addonType="prepend"></InputGroupAddon>
                <Input
                  type="text"
                  autoComplete="message"
                  placeholder="Game Word..."
                  value={word}
                  onChange={this.onGameWordChanged}
                />
              </InputGroup>
            </FormGroup>
          </ModalBody>
          <ModalFooter className="text-right">
            <Button
              type="button"
              color="outline-secondary"
              onClick={this.props.closeModal}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="warning"
              disabled={updating || !gameName}
            >
              Start
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}
