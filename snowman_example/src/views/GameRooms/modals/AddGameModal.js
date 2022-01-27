import React from 'react';
import { Modal, FormGroup, ModalBody, ModalHeader, ModalFooter, InputGroup, InputGroupAddon, InputGroupText, Form, Input, Button } from 'reactstrap';
import * as api from '../../../blockchain/api';

export default class AddGameModal extends React.Component {
  state = {
    gameName: '',
    word: '',
    updating: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen && prevProps.isOpen !== this.props.isOpen) {
      this.setState({ gameName: '', word: '' });
    }
  }

  onSubmit = async e => {
    e.preventDefault();
    const { gameName, word } = this.state;
    if (!gameName || !word ) return;
    this.setState({ updating: true });
    try {
      await api.createGame(this.state.word.toUpperCase(), this.state.gameName);
      this.setState({ updating: false });
      this.props.closeModal();
      this.props.onGameAdded();
    }
    catch (error) {
      alert(error);
      this.setState({ updating: false });
    }
  }

  onGameNameChanged = e => {
    const value = e.target.value.length > 0 && e.target.value[0] === '#' ? e.target.value.slice(1) : e.target.value;

    this.setState({ gameName: value });
  }  
  onGameWordChanged = e => {
    const value = e.target.value.length > 0 && e.target.value[0] === '#' ? e.target.value.slice(1) : e.target.value;

    this.setState({ word: value });
  }

  render() {
    const { isOpen } = this.props;
    const { updating, gameName, word } = this.state;
    return (
      <Modal isOpen={isOpen} toggle={this.props.closeModal}>
        <Form onSubmit={this.onSubmit}>
          <ModalHeader>
            Add Game
          </ModalHeader>
          <ModalBody>
            <FormGroup className="mb-0">
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>#</InputGroupText>
                </InputGroupAddon>
                <Input type="text" autoComplete="message" placeholder="Game Name..." value={gameName} onChange={this.onGameNameChanged} />
                <Input type="text" autoComplete="message" placeholder="Game Word..." value={word} onChange={this.onGameWordChanged} />
              </InputGroup>
            </FormGroup>
          </ModalBody>
          <ModalFooter className="text-right">
            <Button type="button" color="outline-secondary" onClick={this.props.closeModal} disabled={updating}>Cancel</Button>
            <Button type="submit" color="warning" disabled={updating || !gameName}>Add</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}