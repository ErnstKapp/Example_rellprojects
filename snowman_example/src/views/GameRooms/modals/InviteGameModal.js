import React from "react";
import {
  Modal,
  FormGroup,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Button,
} from "reactstrap";
import * as api from "../../../blockchain/api";

export default class InviteGameModal extends React.Component {
  state = {
    username: "",
    updating: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen && prevProps.isOpen !== this.props.isOpen) {
      this.setState({ gameName: "" });
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { username } = this.state;
    if (!username) return;
    this.setState({ updating: true });
    try {
      await api.addUserToGame(this.props.gameName, username);
      this.setState({ updating: false });
      this.props.closeModal();
      this.props.onUserInvited();
    } catch (error) {
      alert(error);
      this.setState({ updating: false });
    }
  };

  onUserNameChanged = (e) => this.setState({ username: e.target.value });

  render() {
    const { isOpen, gameName } = this.props;
    const { updating, username } = this.state;
    return (
      <Modal isOpen={isOpen} toggle={this.props.closeModal}>
        <Form onSubmit={this.onSubmit}>
          <ModalHeader>Invite User to {gameName}</ModalHeader>
          <ModalBody>
            <FormGroup className="mb-0">
              <Input
                type="text"
                autoComplete="message"
                placeholder="Username"
                value={username}
                onChange={this.onUserNameChanged}
              />
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
              disabled={updating || !username}
            >
              Invite
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}
