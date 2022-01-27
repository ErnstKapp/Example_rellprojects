import React from 'react';
import { Button, Col } from 'reactstrap';

const topNav = ({ logout, username, token, openRegisterModal }) => (
  <Col className="gameroom-topnav p-2 d-flex justify-content-between align-items-baseline">
    <div className="d-flex align-items-baseline">
      <Button color="outline-light" className="loginBtn" onClick={openRegisterModal}>+ User</Button>
      Remaining token: {token}
    </div>
    <div className="d-flex align-items-baseline">
      <span>Welcome, {username}!</span>
      <Button color="outline-light" className="logoutBtn" onClick={logout}>Logout</Button>
    </div>
  </Col>
);

export default topNav;