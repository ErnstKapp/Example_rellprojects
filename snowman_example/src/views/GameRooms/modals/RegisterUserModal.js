import React from 'react';
import { Modal, FormGroup, ModalBody, ModalHeader, ModalFooter, Label, Form, Input, Button } from 'reactstrap';
import * as api from '../../../blockchain/api';
import pcl from 'postchain-client';

export default class AddGameModal extends React.Component {
  state = {
    username: '',
    userPubkey: '',
    testPubKey: '',
    textPrivKey: '',
    updating: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen && prevProps.isOpen !== this.props.isOpen) {
      this.setState({
        username: '',
        userPubkey: '',
        testPubKey: '',
        textPrivKey: ''
      });
    }
  }

  onSubmit = async e => {
    e.preventDefault();
    const { username, userPubkey} = this.state;
    if (!username || !userPubkey) return;
    this.setState({ updating: true });
    try {
      await api.addUser(userPubkey, username);
      this.props.closeModal();
      this.props.onUserCreated();
      this.setState({ updating: false });
    }
    catch (error) {
      alert(error);
      this.setState({ updating: false });
    }
  }

  generateKeyPair = () => {
    const { pubKey, privKey } = pcl.util.makeKeyPair();
    this.setState({
      testPubKey: pubKey.toString('hex'),
      textPrivKey: privKey.toString('hex')
    })
  }

  onFieldChanged = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { isOpen } = this.props;
    const { updating, username, userPubkey, testPubKey, textPrivKey } = this.state;
    return (
      <Modal isOpen={isOpen} toggle={this.props.closeModal}>
        <Form onSubmit={this.onSubmit}>
          <ModalHeader>
            Create User
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input type="text" autoComplete="message" name="username" placeholder="Username" value={username} onChange={this.onFieldChanged} />
            </FormGroup>
            <FormGroup>
              <Input type="text" autoComplete="message" name="userPubkey" placeholder="User Pubkey" value={userPubkey} onChange={this.onFieldChanged} />
            </FormGroup>
            <hr />
            <Button onClick={this.generateKeyPair} color="outline-warning">Generate Test keypair</Button>
            {testPubKey && textPrivKey && (
              <div className="mt-3">
                <FormGroup>
                  <Label>Pubkey</Label>
                  <Input type="textarea" value={testPubKey} readOnly />
                </FormGroup>
                <FormGroup>
                  <Label>Privkey (for Login)</Label>
                  <Input type="textarea" value={textPrivKey} readOnly />
                </FormGroup>
              </div>
            )}

          </ModalBody>
          <ModalFooter className="text-right">
            <Button type="button" color="outline-secondary" onClick={this.props.closeModal} disabled={updating}>Cancel</Button>
            <Button type="submit" color="warning" disabled={updating || !username || !userPubkey}>Create User</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}