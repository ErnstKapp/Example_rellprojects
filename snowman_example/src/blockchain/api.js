import blockchain from "./blockchain";
import auth from "./auth";

export const createGame = (word, lobbyName) => {
  const { privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("create_game", word, lobbyName, pubKey.toString("hex"));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
};

export const guess = (letter, lobbyName) => {
  const { privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("guess_letter", letter, lobbyName, pubKey.toString("hex"));
  rq.sign(privKey, pubKey);

  console.log("THE KETTER:::");
  console.log(letter);
  return rq.postAndWaitConfirmation();
};

export const newRound = (word, lobbyName) => {
  const { privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation("new_round", word, pubKey.toString("hex"), lobbyName);
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
};

export const addUser = (newUserPubKey, newUsername) => {
  const { privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation(
    "add_user",
    newUserPubKey.toString("hex"),
    newUsername,
    pubKey.toString("hex")
  );
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
};

export const addUserToGame = (lobbyName, newUsername) => {
  const { privKey, pubKey } = auth.getCurrentUser();
  const rq = blockchain.getGtx().newTransaction([pubKey]);
  rq.addOperation(
    "add_user_to_game",
    lobbyName,
    newUsername,
    pubKey.toString("hex")
  );
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
};

export const showLetters = (game_name) => {
  return blockchain
    .getGtx()
    .query("letters_to_show", { lobby_name: game_name });
};

export const lettersGuessed = (game_name) => {
  return blockchain
    .getGtx()
    .query("letters_guessed", { lobby_name: game_name });
};

export const turnsLeft = (game_name) => {
  return blockchain.getGtx().query("turns_left", { lobby_name: game_name });
};

export const getGames = () => {
  const { pubKey } = auth.getCurrentUser();
  return blockchain
    .getGtx()
    .query("get_games", { pubkey: pubKey.toString("hex") });
};

export const getBalance = () => {
  const { pubKey } = auth.getCurrentUser();
  return blockchain
    .getGtx()
    .query("get_balance", { pubkey: pubKey.toString("hex") });
};
