import pcl from 'postchain-client';
import blockchain from './blockchain';

const auth = (function () {
  let currentUser = {};

  const loginFromSession = async () => {
    const session = sessionStorage.getItem('userLogin');
    if (session) return auth.login(session);
    else return {};
  }

  const login = async privKeyAsText => {
    try {
      const privKey = Buffer.from(privKeyAsText, 'hex');
      const pubKey = pcl.util.createPublicKey(privKey);
      const { id, username } = await blockchain.getGtx().query("get_user", { pubkey: pubKey.toString('hex') });

      currentUser = {
        id,
        username,
        pubKey,
        privKey
      };

      sessionStorage.setItem('userLogin', privKeyAsText);

      return {
        id,
        username
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  const logout = () => {
    currentUser = {};
    sessionStorage.removeItem('userLogin');
  }

  const isLoggedIn = () => !!currentUser.privKey;

  const getCurrentUser = () => ({ ...currentUser });

  return {
    login,
    loginFromSession,
    logout,
    isLoggedIn,
    getCurrentUser
  }
})();

export default auth;
