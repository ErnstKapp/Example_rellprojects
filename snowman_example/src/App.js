import React from 'react';
import './App.scss';
import { isEmpty } from 'lodash';
import { Spinner } from 'reactstrap';

import blockchain from './blockchain/blockchain';
import auth from './blockchain/auth';

import Login from './views/Login';
import GameRooms from './views/GameRooms';



class App extends React.Component {
  state = {
    currentUser: null,
    appInitialized: false
  }

  async componentDidMount() {
    await blockchain.init();
    const savedUser = await auth.loginFromSession();
    if (!isEmpty(savedUser)) this.updateCurrentUser();
    this.setState({ appInitialized: true });
  }

  updateCurrentUser = () => {
    this.setState({ currentUser: auth.getCurrentUser() });
  }


  render() {
    const { currentUser, appInitialized } = this.state;
    if (!appInitialized) return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner color="white" />
      </div>
    );

    if (isEmpty(currentUser)) return <Login onLoginSuccessful={this.updateCurrentUser} />;

    return (
      <GameRooms currentUser={currentUser} onLogoutSuccessful={this.updateCurrentUser} />
    )
  }
}

export default App;
