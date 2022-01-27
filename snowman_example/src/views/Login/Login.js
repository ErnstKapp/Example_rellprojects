import React from 'react';
import {
  Row, Col, Container, FormText, FormGroup, Form, Button, Input, InputGroup, InputGroupAddon
} from 'reactstrap';
import { isEmpty } from 'lodash';

import auth from '../../blockchain/auth';

class Login extends React.Component {
  state = {
    loginPrivKey: '',
    updating: false
  }

  login = async e => {
    e.preventDefault();
    if (!this.state.loginPrivKey) return;
    this.setState({ updating: true });
    const user = await auth.login(this.state.loginPrivKey);

    if (isEmpty(user)) {
      alert("Unable to login! Invalid privKey or user does not exist.");
      this.setState({ updating: false });
    }
    else {
      this.props.onLoginSuccessful();
    }
  }

  onFieldChanged = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { updating, loginPrivKey } = this.state;

    return (
      <Container fluid>
        <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Col className="m-auto" style={{ paddingBottom: '20vh' }} sm="10" md="6" lg="5" xl="4">
            <h1>Welcome!</h1>
            <Form onSubmit={this.login}>
              <FormGroup>
                <InputGroup>
                  <Input type="password" name="loginPrivKey" id="loginPrivKey" required placeholder="Enter Private Key..." value={loginPrivKey} onChange={this.onFieldChanged} />
                  <InputGroupAddon addonType="append">
                    <Button style={{ minWidth: '7em' }} className="btn-block" color="warning" type="submit" disabled={updating}>Login</Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormText>Admin Private Key: 0101010101010101010101010101010101010101010101010101010101010101</FormText>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;